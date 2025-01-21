window.addEventListener("load", () => {
  const mainToken = sessionStorage.getItem("access_token");

  if (!mainToken) {
    window.location.href = "../../Pages/Client/register.html";
  }
});
