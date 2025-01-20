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

const API_URL = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/dashboard";

document.addEventListener("DOMContentLoaded", () => {
  const token = sessionStorage.getItem("access_token");

  if (!token) {
    window.location.href = "../../Pages/Admin/login.html";
    return;
  }

  fetchDashboardData(token);
});

async function fetchDashboardData(token) {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        alert("Geçersiz token, lütfen yeniden giriş yapın!");
        sessionStorage.removeItem("accessToken");
        window.location.href = "../../Pages/Admin/login.html";
      } else {
        throw new Error(`HTTP Hatası: ${response.status}`);
      }
    }

    const result = await response.json();

    if (result.result) {
      animateDashboard(result.data);
    } else {
      console.error("Veri alınamadı:", result.message);
    }
  } catch (error) {
    console.error("API Hatası:", error.message);
  }
}

function animateNumber(element, targetValue, duration) {
  let startValue = 0;
  const increment = targetValue / (duration / 50);

  function updateNumber() {
    startValue += increment;
    if (startValue >= targetValue) {
      element.textContent = targetValue;
    } else {
      element.textContent = Math.floor(startValue);
      requestAnimationFrame(updateNumber);
    }
  }

  updateNumber();
}

function animateDashboard(data) {
  animateNumber(
    document.querySelector(".card1 .card-p2"),
    data.favorites || 0,
    5000
  );
  animateNumber(
    document.querySelector(".card2 .card-p2"),
    data.users || 0,
    5000
  );
  animateNumber(
    document.querySelector(".card3 .card-p2"),
    data.movies || 0,
    5000
  );
  animateNumber(
    document.querySelector(".card4 .card-p2"),
    data.comments || 0,
    5000
  );
  animateNumber(
    document.querySelector(".card5 .card-p2"),
    data.categories || 0,
    5000
  );
  animateNumber(
    document.querySelector(".card6 .card-p2"),
    data.actors || 0,
    5000
  );
  animateNumber(
    document.querySelector(".card7 .card-p2"),
    data.contacts || 0,
    5000
  );
}
