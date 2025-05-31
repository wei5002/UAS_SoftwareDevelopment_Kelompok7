fetch("header-logout.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("header-placeholder").innerHTML = data;

    // Tambahkan fungsi ke window supaya bisa dipanggil dari HTML
    window.showLogoutPopup = function () {
      document.getElementById("logout-popup").style.display = "flex";
    };

    window.closeLogoutPopup = function () {
      document.getElementById("logout-popup").style.display = "none";
    };

    window.confirmLogout = function () {
      window.location.href = "/Customer/HTML/home.html";
    };

        window.showAccountPopup = function () {
      document.getElementById("account-popup").style.display = "flex";

      // Simulasi data user
      const userData = {
        name: "Heru",
        email: "heruheru@gmail.com",
        password: "HeruSatu23#"
      };

      document.getElementById("acc-name").value = userData.name;
      document.getElementById("acc-email").value = userData.email;
      document.getElementById("acc-password").value = userData.password;
    };

    window.togglePasswordVisibility = function () {
      const passwordInput = document.getElementById("acc-password");
      const icon = document.querySelector(".toggle-password i");

      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
      } else {
        passwordInput.type = "password";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
      }
    };

    window.saveAccountChanges = function () {
      const name = document.getElementById("acc-name").value;
      const email = document.getElementById("acc-email").value;
      const password = document.getElementById("acc-password").value;
      console.log("Saving account:", { name, email, password });

      alert("Perubahan akun tersimpan!");
      document.getElementById("account-popup").style.display = "none";
    };

    fetch("header-logout.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("header-placeholder").innerHTML = data;

    // Tambahkan fungsi ke window supaya bisa dipanggil dari HTML
    window.showLogoutPopup = function () {
      document.getElementById("logout-popup").style.display = "flex";
    };

    window.closeLogoutPopup = function () {
      document.getElementById("logout-popup").style.display = "none";
    };

    window.confirmLogout = function () {
      window.location.href = "/Customer/HTML/home.html";
    };

    window.showAccountPopup = function () {
      document.getElementById("account-popup").style.display = "flex";

      // Simulasi data user
      const userData = {
        name: "Heru",
        email: "heruheru@gmail.com",
        password: "HeruSatu23#"
      };

      document.getElementById("acc-name").value = userData.name;
      document.getElementById("acc-email").value = userData.email;
      document.getElementById("acc-password").value = userData.password;
    };

    window.togglePasswordVisibility = function () {
      const passwordInput = document.getElementById("acc-password");
      const icon = document.querySelector(".toggle-password i");

      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
      } else {
        passwordInput.type = "password";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
      }
    };

    window.saveAccountChanges = function () {
      const name = document.getElementById("acc-name").value;
      const email = document.getElementById("acc-email").value;
      const password = document.getElementById("acc-password").value;
      console.log("Saving account:", { name, email, password });

      alert("Perubahan akun tersimpan!");
      document.getElementById("account-popup").style.display = "none";
    };

    // Tambahkan ini untuk nutup popup kalau klik di luar
    document.addEventListener("click", function (event) {
      const popup = document.getElementById("account-popup");
      const container = document.querySelector(".account-popup-container");

      if (
        popup.style.display === "flex" &&
        !container.contains(event.target) &&
        !event.target.closest(".account-btn")
      ) {
        popup.style.display = "none";
      }
    });
  })
  .catch((error) => console.error("Error loading logout:", error));

  document.addEventListener("click", function (event) {
    const popup = document.getElementById("account-popup");
    const container = document.querySelector(".account-popup-container");

    if (
      popup.style.display === "flex" &&
      !container.contains(event.target) &&
      !event.target.closest(".account-btn")
    ) {
      popup.style.display = "none";
    }
  });
})
.catch((error) => console.error("Error loading logout:", error));