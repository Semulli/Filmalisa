document
  .getElementById("login-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const emailDiv = emailInput.closest(".form-group");
    const passwordDiv = passwordInput.closest(".form-group");
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    const validEmailSuffixes = [
      ".com",
      ".ru",
      ".org",
      ".net",
      ".edu",
      ".gov",
      ".int",
    ];
    const apiUrl =
      "https://api.sarkhanrahimli.dev/api/filmalisa/auth/admin/login";

    const resetBorders = () => {
      emailDiv.style.border = "1px solid #ccc";
      passwordDiv.style.border = "1px solid #ccc";
    };

    const isValidEmail = (email) =>
      email.includes("@") &&
      validEmailSuffixes.includes(email.substring(email.lastIndexOf(".")));

    resetBorders();

    let hasError = false;
    if (!isValidEmail(email)) {
      emailDiv.style.border = "2px solid red";
      hasError = true;
    }
    if (password !== "1234") {
      passwordDiv.style.border = "2px solid red";
      hasError = true;
    }
    if (hasError) {
      setTimeout(resetBorders, 3000);
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok && data.result === true) {
        sessionStorage.setItem("access_token", data.data.tokens.access_token);
        emailInput.value = "";
        passwordInput.value = "";
        window.location.href = "dashboard.html";
      } else {
        emailDiv.style.border = "2px solid red";
        passwordDiv.style.border = "2px solid red";
        setTimeout(resetBorders, 3000);
      }
    } catch {
      emailDiv.style.border = "2px solid red";
      passwordDiv.style.border = "2px solid red";
      setTimeout(resetBorders, 3000);
    }
  });

document.getElementById("toggle-password").addEventListener("click", () => {
  const passwordInput = document.getElementById("password");
  const type =
    passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);
});
