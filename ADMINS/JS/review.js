let currentIndex = 0;

const track = document.querySelector('.review-track');
const reviews = document.querySelectorAll('.review-card');
const total = reviews.length;

function updateSlider() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
}

document.querySelector('.arrow.left').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + total) % total;
    updateSlider();
});

document.querySelector('.arrow.right').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % total;
    updateSlider();
});