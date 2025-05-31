document.addEventListener("DOMContentLoaded", function () {
  const popupOrder = document.getElementById("popup-order");
  const orderButtons = document.querySelectorAll(".button-wrap button:first-child"); // tombol Order
  const closePopup = document.querySelector(".close-popup-order");
  const orderButton = document.getElementById('order-btn');
  const fileInput = document.getElementById('file-input');

  let currentOrderCard = null;

  orderButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      popupOrder.style.display = "flex";
      document.body.style.overflow = "hidden";

      currentOrderCard = btn.closest(".order-card");
    });
  });

  if (closePopup) {
    closePopup.addEventListener("click", () => {
      popupOrder.style.display = "none";
      document.body.style.overflow = "auto";
    });
  }

  window.addEventListener("click", function (e) {
    if (e.target === popupOrder) {
      popupOrder.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });

  orderButton.addEventListener('click', function (event) {
    const inputs = document.querySelectorAll(
      'input[data-bank], input[data-holder], input[data-account], input[data-phone], input[data-province], input[data-city], input[data-district], input[data-urban]'
    );

    let isValid = true;
    inputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
      }
    });

    const isFileAttached = fileInput.files.length > 0;

    if (!isValid || !isFileAttached) {
      event.preventDefault();
      alert('Please fill in all fields and attach the transfer receipt.');
    } else {
      alert('Order submitted successfully!');
      popupOrder.style.display = "none";
      document.body.style.overflow = "auto";

      if (currentOrderCard) {
        currentOrderCard.remove();
        currentOrderCard = null;
      }
    }
  });

  const fileBtn = document.getElementById("file-attach-btn");

  fileBtn.addEventListener("click", function () {
    fileInput.click();
  });

  fileInput.addEventListener("change", function () {
    if (fileInput.files.length > 0) {
      const fileName = fileInput.files[0].name;
      fileBtn.textContent = fileName;
    } else {
      fileBtn.textContent = "No file attached";
    }
  });
});