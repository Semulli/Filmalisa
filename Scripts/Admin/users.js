window.addEventListener("load", () => {
  const accessToken = sessionStorage.getItem("access_token");

  if (!accessToken) {
    window.location.href = "login.html";
  }
});

document.querySelector(".logout-div").addEventListener("click", () => {
  sessionStorage.removeItem("access_token");
  window.location.href = "../../Pages/Admin/login.html";
});
// ----------------------------------------------------------------
