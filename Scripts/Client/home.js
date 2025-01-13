const carousel = document.querySelector(".carousel");
const dots = document.querySelectorAll(".dot");

let currentIndex = 0;

function showSlide(index) {
  carousel.style.transform = `translateX(-${index * 100}%)`;
  dots.forEach((dot, idx) => {
    dot.classList.toggle("active", idx === index);
  });
}

dots.forEach((dot, idx) => {
  dot.addEventListener("click", () => {
    currentIndex = idx;
    showSlide(currentIndex);
  });
});

// Auto slide
// setInterval(() => {
//   currentIndex = (currentIndex + 1) % 3;
//   showSlide(currentIndex);
// }, 5000); // 5 saniyede bir geçiş
