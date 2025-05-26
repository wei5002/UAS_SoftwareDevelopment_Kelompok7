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
    const popupSpec1Title = document.getElementById('popup-spec-1-title');
    const popupSpec1Value = document.getElementById('popup-spec-1-value');
    const popupSpec2Title = document.getElementById('popup-spec-2-title');
    const popupSpec2Value = document.getElementById('popup-spec-2-value');
    const popupPrice = document.getElementById('popup-price');
    const closeBtn = document.querySelector('.close-popup');

    document.querySelectorAll('.detail-btn').forEach(button => {
        button.addEventListener('click', () => {
            popupTitle.textContent = button.dataset.title;
            popupImg.src = button.dataset.img;
            cusName.textContent = button.dataset.cusName;
            cusBankName.textContent = button.dataset.cusBankName;
            cusAccountHolder.textContent = button.dataset.cusAccountHolder;
            cusAccountNumber.textContent = button.dataset.cusAccountNumber;
            cusProvince.textContent = button.dataset.cusProvince;
            cusCity.textContent = button.dataset.cusCity;
            cusDistrict.textContent = button.dataset.cusDistrict;
            cusUrban.textContent = button.dataset.cusUrban;
            cusStreet.textContent = button.dataset.cusStreet;
            cusPhone.textContent = button.dataset.cusPhone;
            popupSpec1Title.textContent = button.dataset.spec1Title;
            popupSpec1Value.textContent = button.dataset.spec1Value;
            popupSpec2Title.textContent = button.dataset.spec2Title;
            popupSpec2Value.textContent = button.dataset.spec2Value;
            popupPrice.textContent = button.dataset.price;

            popup.style.display = 'flex';
        });
    });

    closeBtn.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    });
});
