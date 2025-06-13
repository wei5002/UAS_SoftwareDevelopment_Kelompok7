'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './sales.report.module.css';
import HeaderAdmin from '@/app/headerAdmin';
import NavbarAdmin from '@/app/components/navbarAdmin';
import FooterHitam from '@/app/components/footerHitam';

// --- Interface Definitions based on Prisma Schema ---
type Produk = {
    id: string;
    namaProduk: string;
};

type ProdukVarian = {
    id: string;
    produk: Produk;
    size?: string;
    thickness?: number;
    hole?: number;
    harga: number;
};

type KeranjangBelanja = {
    jumlah: number;
    produkVarian: ProdukVarian;
    totalHarga: number;
};

type Pelanggan = {
    id: string;
    nama: string;
};

type Pesanan = {
    id: string;
    user: Pelanggan;
    keranjang: KeranjangBelanja;
    ongkosKirim?: number;
    alamatDetail: string;
    provinsi: string;
    kabupaten: string;
    kecamatan: string;
    kelurahan: string;
};

type LaporanPenjualan = {
    id: string;
    tanggalLaporan: string;
    pesananId: string;
    pesanan: Pesanan;
    totalPenjualan: number;
    keterangan?: string;
};

// --- Main Component ---
export default function SalesReportPage() {
    const [allReports, setAllReports] = useState<LaporanPenjualan[]>([]);
    const [filteredReports, setFilteredReports] = useState<LaporanPenjualan[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // State for filters
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<number | ''>(new Date().getMonth() + 1); // Allow empty month
    const [filterUserId, setFilterUserId] = useState<string>('');
    const [filterProdukId, setFilterProdukId] = useState<string>('');
    const [filterTujuan, setFilterTujuan] = useState<string>('');

    // State for chart and popup
    const [viewMode, setViewMode] = useState<'monthly' | 'daily'>('monthly');
    const [showDetailPopup, setShowDetailPopup] = useState<boolean>(false);
    const [selectedReportDetail, setSelectedReportDetail] = useState<LaporanPenjualan | null>(null);

    const fetchAllReportsForYear = async (year: number) => {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token_admin');
        if (!token) {
            setError("Autentikasi diperlukan.");
            setLoading(false);
            return;
        }

        const url = `http://localhost:5001/api/laporan?year=${year}`;

        try {
            const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!response.ok) throw new Error(`Gagal mengambil data laporan: ${response.statusText}`);
            
            const result = await response.json();
            setAllReports(Array.isArray(result.data) ? result.data : []);
        } catch (err: any) {
            setError(err.message);
            setAllReports([]);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchAllReportsForYear(selectedYear);
    }, [selectedYear]);

    const applyFilters = () => {
        let reports = [...allReports];

        if (selectedMonth) {
            reports = reports.filter(r => new Date(r.tanggalLaporan).getMonth() + 1 === selectedMonth);
        }
        if (filterUserId) {
            reports = reports.filter(r => r.pesanan.user.id.includes(filterUserId));
        }
        if (filterProdukId) {
            reports = reports.filter(r => r.pesanan.keranjang.produkVarian.produk.id.includes(filterProdukId));
        }
        if (filterTujuan) {
            const tujuanLower = filterTujuan.toLowerCase();
            reports = reports.filter(r => 
                r.pesanan.provinsi.toLowerCase().includes(tujuanLower) ||
                r.pesanan.kabupaten.toLowerCase().includes(tujuanLower)
            );
        }
        
        setFilteredReports(reports);
    };
    
    useEffect(() => {
        applyFilters();
    }, [allReports, selectedMonth, filterUserId, filterProdukId, filterTujuan]);

    const processedChartData = useMemo(() => {
        const targetReports = filteredReports;

        if (viewMode === 'monthly') {
            const monthlySales: { [key: string]: number } = {};
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
            
            monthNames.forEach((_, index) => {
                monthlySales[index] = 0;
            });

            targetReports.forEach(report => {
                const monthIndex = new Date(report.tanggalLaporan).getMonth();
                monthlySales[monthIndex] = (monthlySales[monthIndex] || 0) + report.totalPenjualan;
            });

            return monthNames.map((name, index) => ({
                name,
                Penjualan: monthlySales[index]
            }));
        }
        
        // Daily view for the selected month
        const dailySales: { [key: string]: number } = {};
        const daysInMonth = selectedMonth ? new Date(selectedYear, selectedMonth, 0).getDate() : 31;

        for (let day = 1; day <= daysInMonth; day++) {
            dailySales[day] = 0;
        }

        targetReports.forEach(report => {
            if (selectedMonth && new Date(report.tanggalLaporan).getMonth() + 1 === selectedMonth) {
                const day = new Date(report.tanggalLaporan).getDate();
                dailySales[day] = (dailySales[day] || 0) + report.totalPenjualan;
            }
        });
        
        return Object.keys(dailySales).map(day => ({
            name: `Tgl ${day}`,
            Penjualan: dailySales[day] || 0,
        }));

    }, [filteredReports, viewMode, selectedYear, selectedMonth]);

    const summaryData = useMemo(() => {
        const totalPenjualan = filteredReports.reduce((sum, report) => sum + report.totalPenjualan, 0);
        const jumlahPesanan = filteredReports.length;
        const rataRataPenjualan = jumlahPesanan > 0 ? totalPenjualan / jumlahPesanan : 0;
        return { totalPenjualan, jumlahPesanan, rataRataPenjualan };
    }, [filteredReports]);
    
    const handleOpenDetail = (report: LaporanPenjualan) => {
        setSelectedReportDetail(report);
        setShowDetailPopup(true);
    };

    return (
        <div className={styles.pageContainer}>
            <HeaderAdmin />
            <NavbarAdmin />
            <main className={styles.mainContent}>
                <h1 className={styles.pageTitle}>Laporan Penjualan</h1>

                {/* -- Filter Section -- */}
                <div className={styles.filterContainer}>
                    <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value ? Number(e.target.value) : '')} className={styles.select}>
                        <option value="">Semua Bulan</option>
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('id-ID', { month: 'long' })}</option>
                        ))}
                    </select>
                    <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className={styles.select}>
                        {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                    <input type="text" placeholder="Filter ID Pembeli..." value={filterUserId} onChange={e => setFilterUserId(e.target.value)} className={styles.filterInput} />
                    <input type="text" placeholder="Filter ID Produk..." value={filterProdukId} onChange={e => setFilterProdukId(e.target.value)} className={styles.filterInput} />
                    <input type="text" placeholder="Filter Tujuan..." value={filterTujuan} onChange={e => setFilterTujuan(e.target.value)} className={styles.filterInput} />
                </div>

                {loading && <p className={styles.loadingText}>Memuat data...</p>}
                {error && <p className={styles.errorText}>{error}</p>}

                {!loading && !error && (
                    <>
                        {filteredReports.length === 0 ? (
                           <div className={styles.noDataMessage}>
                                <h3>Tidak ada data penjualan</h3>
                                <p>Tidak ditemukan laporan untuk filter yang Anda pilih. Coba ubah periode atau filter lainnya.</p>
                           </div>
                        ) : (
                            <>
                                {/* -- Summary Cards -- */}
                                <div className={styles.summaryGrid}>
                                    <div className={styles.summaryCard}>
                                        <h4>Total Penjualan</h4>
                                        <p>Rp {summaryData.totalPenjualan.toLocaleString('id-ID')}</p>
                                    </div>
                                    <div className={styles.summaryCard}>
                                        <h4>Jumlah Pesanan</h4>
                                        <p>{summaryData.jumlahPesanan.toLocaleString('id-ID')}</p>
                                    </div>
                                    <div className={styles.summaryCard}>
                                        <h4>Rata-rata Penjualan</h4>
                                        <p>Rp {summaryData.rataRataPenjualan.toLocaleString('id-ID', { maximumFractionDigits: 0 })}</p>
                                    </div>
                                </div>

                                {/* -- Chart Section -- */}
                                <div className={styles.chartContainer}>
                                    <div className={styles.chartHeader}>
                                       <h3>Grafik Penjualan</h3>
                                        <div className={styles.viewToggle}>
                                            <button onClick={() => setViewMode('monthly')} className={viewMode === 'monthly' ? styles.active : ''}>Bulanan</button>
                                            <button disabled={!selectedMonth} onClick={() => setViewMode('daily')} className={viewMode === 'daily' ? styles.active : ''}>Harian</button>
                                        </div>
                                    </div>
                                     <ResponsiveContainer width="100%" height={400}>
                                        <BarChart data={processedChartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis tickFormatter={(value: number) => `Rp${(value / 1000000).toFixed(1)}Jt`} />
                                            <Tooltip formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Penjualan']} />
                                            <Legend />
                                            <Bar dataKey="Penjualan" fill="#8884d8" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                               
                                {/* -- Data Table -- */}
                                <div className={styles.tableContainer}>
                                    <h3 className={styles.tableTitle}>Detail Laporan</h3>
                                    <table className={styles.reportTable}>
                                        <thead>
                                            <tr>
                                                <th>Tanggal</th>
                                                <th>Nama Produk</th>
                                                <th>Total Penjualan</th>
                                                <th>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredReports.map(report => (
                                                <tr key={report.id}>
                                                    <td>{new Date(report.tanggalLaporan).toLocaleDateString('id-ID')}</td>
                                                    <td>{report.pesanan?.keranjang?.produkVarian?.produk?.namaProduk || 'N/A'}</td>
                                                    <td>Rp {report.totalPenjualan.toLocaleString('id-ID')}</td>
                                                    <td>
                                                        <button onClick={() => handleOpenDetail(report)} className={styles.detailButton}>Lihat Detail</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </>
                )}
            </main>
            
            {/* -- Detail Popup -- */}
            {showDetailPopup && selectedReportDetail && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popupContent}>
                        <button onClick={() => setShowDetailPopup(false)} className={styles.closeButton}>&times;</button>
                        <h2>Detail Laporan Penjualan</h2>
                        <div className={styles.detailGrid}>
                            <div className={styles.detailSection}>
                                <h4>Informasi Pembeli</h4>
                                <p><strong>ID Pembeli:</strong> {selectedReportDetail.pesanan.user.id}</p>
                                <p><strong>Nama:</strong> {selectedReportDetail.pesanan.user.nama}</p>
                                <p><strong>Tujuan Pengiriman:</strong> {`${selectedReportDetail.pesanan.kabupaten}, ${selectedReportDetail.pesanan.provinsi}`}</p>
                                <p><strong>Alamat Lengkap:</strong> {selectedReportDetail.pesanan.alamatDetail}</p>
                            </div>
                            <div className={styles.detailSection}>
                                <h4>Detail Produk</h4>
                                <p><strong>ID Produk:</strong> {selectedReportDetail.pesanan.keranjang.produkVarian.produk.id}</p>
                                <p><strong>Nama Produk:</strong> {selectedReportDetail.pesanan.keranjang.produkVarian.produk.namaProduk}</p>
                                <p><strong>Jumlah:</strong> {selectedReportDetail.pesanan.keranjang.jumlah}</p>
                            </div>
                            <div className={styles.detailSection}>
                                <h4>Rincian Pembayaran</h4>
                                <p><strong>Harga Barang:</strong> Rp {(selectedReportDetail.pesanan.keranjang.totalHarga).toLocaleString('id-ID')}</p>
                                <p><strong>Ongkos Kirim:</strong> Rp {(selectedReportDetail.pesanan.ongkosKirim || 0).toLocaleString('id-ID')}</p>
                                <p><strong>Total Penjualan:</strong> Rp {selectedReportDetail.totalPenjualan.toLocaleString('id-ID')}</p>
                            </div>
                             <div className={styles.detailSectionFull}>
                                <h4>Keterangan</h4>
                                <p>{selectedReportDetail.keterangan || 'Tidak ada keterangan.'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <FooterHitam />
        </div>
    );
}
