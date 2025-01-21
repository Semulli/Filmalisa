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
  if (!email || !password) {
    if (!email) emailInput.parentElement.style.border = "1px solid red";
    if (!password) passwordInput.parentElement.style.border = "1px solid red";
    if (!name) nameInput.parentElement.style.border = "1px solid red";
    return;
  }
  const bodyData = {
    password: password,
    full_name: name,
    email: email,
  };

  try {
    let response = await fetch(
      "https://api.sarkhanrahimli.dev/api/filmalisa/auth/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      }
    );

    let data = await response.json();
    console.log(data);

    if (response.ok && data.result === true) {
      localStorage.setItem("userRegistered", "true");
      showPopup(
        "Registration successful! You are being directed to the main page."
      );
      setTimeout(() => {
        window.location.href = "../../index.html";
      }, 2000);
    } else {
      if (data.message === "Internal server error") {
        showPopup(
          "This email is already registered. Redirecting to the login page..."
        );
        setTimeout(() => {
          window.location.href = "../../Pages/Client/login.html"; //
        }, 2000);
      } else {
        showPopup(data.message || "This email address is already registered.");
      }
    }
  } catch (error) {
    showPopup("An error occurred. Please try again.");
    console.log("Signup error:", error);
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
