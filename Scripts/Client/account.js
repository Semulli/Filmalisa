window.addEventListener("load", () => {
  const mainToken = sessionStorage.getItem("user_token");

  if (!mainToken) {
    window.location.href = "../../Pages/Client/login.html";
  }
});
