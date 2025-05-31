document.addEventListener("DOMContentLoaded", function () {
  const popupOrder = document.getElementById("popup-order");
  const orderButtons = document.querySelectorAll(".button-wrap button:first-child"); // tombol Order
  const closePopup = document.querySelector(".close-popup-order");

  // Buka popup saat tombol order diklik
  orderButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      popupOrder.style.display = "flex";
      document.body.style.overflow = "hidden"; // biar ga bisa scroll di belakang
    });
  });

  // Tutup popup saat close diklik
  if (closePopup) {
    closePopup.addEventListener("click", () => {
      popupOrder.style.display = "none";
      document.body.style.overflow = "auto";
    });
  }

  // Tutup popup kalau klik di luar area isi
  window.addEventListener("click", function (e) {
    if (e.target === popupOrder) {
      popupOrder.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const fileBtn = document.getElementById("file-attach-btn");
  const fileInput = document.getElementById("file-input");

  fileBtn.addEventListener("click", function () {
    fileInput.click(); // buka file picker
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