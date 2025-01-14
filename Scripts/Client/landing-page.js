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

if (emailEl && btn) {
  const registerURL = "https://semulli.github.io/Filmalisa/Pages/Client/register.html";

  function setEmailBorder(isValid) {
    emailEl.style.border = isValid ? "none" : "1px solid red";
  }

  btn.addEventListener("click", () => {
    if (emailEl.value.trim() === "") {
      setEmailBorder(false);
    } else {
      location.href = registerURL;
      setEmailBorder(true);
      emailEl.value = "";
    }
  });
} else {
  console.error("Email input veya buton bulunamadı.");
}
