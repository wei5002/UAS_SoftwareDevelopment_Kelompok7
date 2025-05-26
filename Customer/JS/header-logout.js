fetch("header-logout.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("header-placeholder").innerHTML = data;
  })
  .catch((error) => console.error("Error loading logout:", error));