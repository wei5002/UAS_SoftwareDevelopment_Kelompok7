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
      window.location.href = "/Admin/HTML/home.html";
    };
  })
  .catch((error) => console.error("Error loading logout:", error));
