document.addEventListener('DOMContentLoaded', function () {
  const popup = document.getElementById('popup');
  const popupTitle = document.getElementById('popup-title');
  const popupThickness = document.getElementById('popup-thickness');
  const popupSize = document.getElementById('popup-size');
  const popupClose = document.querySelector('.popup-close');

  document.querySelectorAll('.eye-icon').forEach(icon => {
    icon.addEventListener('click', openPopup);
  });

  function openPopup(event) {
    const target = event.currentTarget;
    popupTitle.textContent = target.getAttribute('data-title');
    popupThickness.textContent = target.getAttribute('data-thickness');
    popupSize.textContent = target.getAttribute('data-size');
    popup.classList.remove('popup-hidden');
    popup.classList.add('popup-visible');
  }

  function closePopup() {
    popup.classList.remove('popup-visible');
    popup.classList.add('popup-hidden');
  }

  popupClose.addEventListener('click', closePopup);

  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      closePopup();
    }
  });
});