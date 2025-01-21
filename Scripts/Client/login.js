async function signInSite() {
  const emailIn = document.querySelector("#email");
  const passwordIn = document.querySelector("#password");
  const formGroup = document.querySelectorAll(".form-group");

  let email = emailIn.value.trim();
  let password = passwordIn.value.trim();

  formGroup.forEach(
    (group) => (group.style.border = "1px solid var(--Border-color_1)")
  );
  if (!email || !password) {
    if (!email) emailIn.parentElement.style.border = "1px solid red";
    if (!password) passwordIn.parentElement.style.border = "1px solid red";
    return;
  }

  const mainData = {
    email: email,
    password: password,
  };

  try {
    let response = await fetch(
      "https://api.sarkhanrahimli.dev/api/filmalisa/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mainData),
      }
    );

    let data = await response.json();
    console.log(data);
    console.log("Response status:", response.status);

    if (response.ok && data.result === true) {
      localStorage.setItem("userRegistered", "true");
      localStorage.setItem("access_token", data.access_token);
      window.location.href = "../../index.html";
    } else if (
      response.status === 500 ||
      data.message === "Internal server error"
    ) {
      showPopup("This email is not registered. Redirecting to sign-up page...");
      setTimeout(() => {
        window.location.href = "../../Pages/Client/register.html";
      }, 2000);
    } else {
      showPopup(data.message || "Invalid email or password.");
    }
  } catch (error) {
    console.error("Unexpected error happened:", error);
    showPopup("An unexpected error occurred. Please try again.");
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

document.querySelector("#loginBtn").addEventListener("click", (event) => {
  event.preventDefault();
  signInSite();
});
