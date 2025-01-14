const icons = document.querySelectorAll(".icon-img");

document.addEventListener("mousemove", (event) => {
  icons.forEach((icon) => {
    const rect = icon.getBoundingClientRect();
    const distance = Math.sqrt(
      Math.pow(event.clientX - (rect.left + rect.width / 2), 2) +
        Math.pow(event.clientY - (rect.top + rect.height / 2), 2)
    );

    if (distance < 100) {
      icon.classList.add("active");
    } else {
      icon.classList.remove("active");
    }
  });
});
