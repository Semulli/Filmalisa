function toggleAccordion(header) {
  const content = header.nextElementSibling;
  const isOpen = content.classList.contains("open");
  if (isOpen) {
    content.classList.remove("open");
    header.querySelector("span").classList.remove("rotate");
  } else {
    content.classList.add("open");
    header.querySelector("span").classList.add("rotate");
  }
}

const emailEl = document.querySelector("#emailInput");
const btn = document.querySelector("#startBtn");

btn.addEventListener("click", () => {
  if (emailEl.value == "") {
    emailEl.style.border = "1px solid red";
  } else {
    location.href = "../../Pages/Client/login.html";
    emailEl.style.border="none"
    emailEl.value= ""
  }
});
