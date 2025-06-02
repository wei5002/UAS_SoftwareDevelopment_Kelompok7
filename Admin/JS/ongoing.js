document.querySelectorAll('.status_pesanan').forEach(group => {
  const buttons = group.querySelectorAll('button');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      // hapus yg sebelumnya
      buttons.forEach(btn => btn.classList.remove('active'));

      // buat active baru 
      button.classList.add('active');
    });
  });
});


document.addEventListener("DOMContentLoaded", function () {
      const cancelBtn = document.querySelector(".cancel-btn");
      const cancelPopup = document.getElementById("cancel-popup");
      const closeCancel = document.querySelector(".close-cancel");

      const acceptBtn = document.querySelector(".accept-btn");
      const acceptPopup = document.getElementById("accept-popup");
      const closeAccept = document.querySelector(".close-accept");

      const declineBtn = document.querySelector(".decline-btn");
      const declinePopup = document.getElementById("decline-popup");
      const closeDecline = document.querySelector(".close-decline");

      // Tampilkan popup cancel utama
      cancelBtn.addEventListener("click", () => {
        cancelPopup.style.display = "flex";
      });

      // Accept Request = tampilkan upload popup
      acceptBtn.addEventListener("click", () => {
        cancelPopup.style.display = "none";
        acceptPopup.style.display = "flex";
      });

      // Decline Request = tampilkan alasan pembatalan
      declineBtn.addEventListener("click", () => {
        cancelPopup.style.display = "none";
        declinePopup.style.display = "flex";
      });

      // Tutup semua popup
      closeCancel.addEventListener("click", () => cancelPopup.style.display = "none");
      closeAccept.addEventListener("click", () => acceptPopup.style.display = "none");
      closeDecline.addEventListener("click", () => declinePopup.style.display = "none");

      // Klik luar untuk tutup popup
      window.addEventListener("click", (e) => {
        if (e.target === cancelPopup) cancelPopup.style.display = "none";
        if (e.target === acceptPopup) acceptPopup.style.display = "none";
        if (e.target === declinePopup) declinePopup.style.display = "none";
      });
    });

    
const acceptPopup = document.getElementById('accept-popup');
const closeAcceptBtn = acceptPopup.querySelector('.close-accept');

// Tutup popup saat klik tombol close (×)
closeAcceptBtn.addEventListener('click', () => {
  acceptPopup.style.display = 'none';
});

// Tutup popup saat klik area luar popup-content (background overlay)
acceptPopup.addEventListener('click', (e) => {
  if (e.target === acceptPopup) {
    acceptPopup.style.display = 'none';
  }
});
