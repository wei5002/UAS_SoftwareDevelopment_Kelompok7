document.addEventListener('DOMContentLoaded', function () {
    const popup = document.getElementById('popup');
    const popupTitle = document.getElementById('popup-title');
    const popupImg = document.getElementById('popup-img');
    const cusName = document.getElementById("cus-name");
    const cusBankName = document.getElementById("cus-bank-name");
    const cusAccountHolder = document.getElementById("cus-account-holder");
    const cusAccountNumber = document.getElementById("cus-account-number");
    const cusProvince = document.getElementById("cus-province");
    const cusCity = document.getElementById("cus-city");
    const cusDistrict = document.getElementById("cus-district");
    const cusUrban = document.getElementById("cus-urban");
    const cusStreet = document.getElementById("cus-street");
    const cusPhone = document.getElementById("cus-phone");
    const popupSpec1Title = document.getElementById("popup-spec-1-title");
    const popupSpec1Value = document.getElementById("popup-spec-1-value");
    const popupSpec2Title = document.getElementById("popup-spec-2-title");
    const popupSpec2Value = document.getElementById("popup-spec-2-value");
    const popupPrice = document.getElementById("popup-price");

    const receiptPopup = document.getElementById("receipt-popup");
    const receiptImg = document.getElementById("receipt-img");
    const closeReceiptPopup = document.querySelector(".close-receipt-popup");

    let currentReceiptUrl = "";

    document.querySelectorAll('.detail-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            popup.style.display = 'flex';

            popupTitle.textContent = btn.dataset.title;
            popupImg.src = btn.dataset.img;
            cusName.textContent = btn.dataset.cusName;
            cusBankName.textContent = btn.dataset.cusBankName;
            cusAccountHolder.textContent = btn.dataset.cusAccountHolder;
            cusAccountNumber.textContent = btn.dataset.cusAccountNumber;
            cusProvince.textContent = btn.dataset.cusProvince;
            cusCity.textContent = btn.dataset.cusCity;
            cusDistrict.textContent = btn.dataset.cusDistrict;
            cusUrban.textContent = btn.dataset.cusUrban;
            cusStreet.textContent = btn.dataset.cusStreet;
            cusPhone.textContent = btn.dataset.cusPhone;

            popupSpec1Title.textContent = btn.dataset.spec1Title;
            popupSpec1Value.textContent = btn.dataset.spec1Value;
            popupSpec2Title.textContent = btn.dataset.spec2Title;
            popupSpec2Value.textContent = btn.dataset.spec2Value;
            popupPrice.textContent = btn.dataset.price;

            currentReceiptUrl = btn.dataset.receiptImg;
        });
    });

    document.querySelector('.close-popup').addEventListener('click', function () {
        popup.style.display = 'none';
    });

    // Saat tombol "see receipt" diklik
    document.querySelector('.see-receipt-btn').addEventListener('click', function () {
        if (currentReceiptUrl) {
            receiptImg.src = currentReceiptUrl;
            receiptPopup.style.display = 'flex';
        }
    });

    // Tutup popup bukti transfer
    closeReceiptPopup.addEventListener('click', function () {
        receiptPopup.style.display = 'none';
        receiptImg.src = "";
    });

    // Tutup popup receipt jika klik di luar konten
    receiptPopup.addEventListener('click', function (e) {
        if (e.target === receiptPopup) {
            receiptPopup.style.display = 'none';
            receiptImg.src = "";
        }
    });
});
