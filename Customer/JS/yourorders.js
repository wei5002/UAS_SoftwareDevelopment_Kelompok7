document.querySelectorAll('.status_pesanan').forEach(group => {
    const buttons = group.querySelectorAll('button');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));

            button.classList.add('active');
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("popup");
    const confirmBtn = document.getElementById("confirmCancel");
    const closeBtn = document.getElementById("closePopup");
    let targetCard = null;

    document.querySelectorAll(".cancel-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            targetCard = e.target.closest(".order-card");
            
            const cusName = button.dataset.cusName;
            const bankName = button.dataset.cusBankName;
            const accountHolder = button.dataset.cusAccountHolder;
            const accountNumber = button.dataset.cusAccountNumber;

            document.getElementById("cus-name").innerText = cusName;
            document.getElementById("cus-bank-name").innerText = bankName;
            document.getElementById("cus-account-holder").innerText = accountHolder;
            document.getElementById("cus-account-number").innerText = accountNumber;
            popup.style.display = "flex";
        });
    });

    confirmBtn.addEventListener("click", () => {
        const reasonInput = document.querySelector('.popup-reason input');
        const reason = reasonInput.value.trim();

        if (reason === "") {
            alert("Please enter your reason before sending the request.");
            reasonInput.focus();
            return;
        }

        if (targetCard) {
            targetCard.classList.add("dimmed");

            const overlay = document.createElement("div");
            overlay.className = "dimmed-overlay";
            overlay.innerText = "Cancellation request submitted\nPending admin confirmation";
            targetCard.appendChild(overlay);
        }

        // Bersihkan input setelah submit
        reasonInput.value = "";
        popup.style.display = "none";
    });

    closeBtn.addEventListener("click", () => {
        popup.style.display = "none";
    });
});


document.querySelectorAll(".done-btn").forEach(button => {
    button.addEventListener("click", (e) => {
        const orderCard = e.target.closest(".order-card");

        orderCard.classList.add("order-done");

        const doneOverlay = document.createElement("div");
        doneOverlay.className = "done-overlay";
        doneOverlay.innerText = "This order has been completed";
        orderCard.appendChild(doneOverlay);

        button.disabled = true;
        button.style.opacity = "0.5";
        button.style.cursor = "not-allowed";
    });
});