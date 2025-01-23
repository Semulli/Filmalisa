document.addEventListener("DOMContentLoaded", () => {
  const token = sessionStorage.getItem("user_token");

  if (token) {
    window.location.href = "../../index.html";
  }

  const emailInput = document.querySelector("#email");
  if (emailInput) {
    const emailValue = sessionStorage.getItem("email");
    if (emailValue) {
      emailInput.value = emailValue;
    }
  }
});

window.addEventListener("load", () => {
  const mainToken = sessionStorage.getItem("access_token");

  if (mainToken) {
    window.location.href = "../../index.html";
  }
});

async function signUpSite() {
  const nameInput = document.querySelector("#fullName");
  const emailInput = document.querySelector("#email");
  const passwordInput = document.querySelector("#password");
  const formGroup = document.querySelectorAll(".form-group");

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  formGroup.forEach(
    (group) => (group.style.border = "1px solid var(--Border-color_1)")
  );

  let isValid = true;
  if (!name) {
    nameInput.parentElement.style.border = "1px solid red";
    isValid = false;
  }
  if (!email) {
    emailInput.parentElement.style.border = "1px solid red";
    isValid = false;
  }
  if (!password) {
    passwordInput.parentElement.style.border = "1px solid red";
    isValid = false;
  }

  if (!isValid) {
    showPopup("Please fill in all required fields.");
    return;
  }

  const bodyData = {
    full_name: name,
    email: email,
    password: password,
  };

  try {
    const response = await fetch(
      "https://api.sarkhanrahimli.dev/api/filmalisa/auth/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      }
    );

    const data = await response.json();

    if (response.ok && !data.message.includes("already registered")) {
      sessionStorage.setItem("userRegistered", bodyData.email);

      nameInput.value = "";
      emailInput.value = "";
      passwordInput.value = "";

      window.location.href = "../../Pages/Client/login.html";
    } else {
      showPopup("This email is already in use. Please try logging in.");

      setTimeout(() => {
        window.location.href = "../../Pages/Client/login.html";
      }, 2000);
    }
  } catch (error) {
    showPopup("An error occurred. Please try again.");
    nameInput.value = "";
    emailInput.value = "";
    passwordInput.value = "";
    console.error("Signup error:", error);
  }
}

function showPopup(message) {
  const popup = document.getElementById("popup");
  const popupText = document.getElementById("pop-p");
  popupText.textContent = message;
  popup.classList.add("show");

  setTimeout(() => {
    closePopup();
  }, 3000);
}

function closePopup() {
  const popup = document.getElementById("popup");
  popup.classList.remove("show");
  popup.style.display = "none";
}

document
  .querySelectorAll(".form-group img[alt='password-right']")
  .forEach((icon) => {
    icon.addEventListener("click", (event) => {
      const passwordInput = event.target.previousElementSibling;
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.src = "../../Assets/icons/Client-login/right-icon.svg";
      } else {
        passwordInput.type = "password";
        icon.src = "../../Assets/icons/Client-login/right-icon.svg";
      }
    });
  });

document.querySelector(".register-btn").addEventListener("click", (event) => {
  event.preventDefault();
  signUpSite();
});
