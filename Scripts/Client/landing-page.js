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
  const loginURL = "../../Pages/Client/login.html";

  function setEmailBorder(isValid) {
    emailEl.style.border = isValid ? "none" : "1px solid red";
  }

  btn.addEventListener("click", () => {
    if (emailEl.value.trim() === "") {
      setEmailBorder(false);
    } else {
      location.href = loginURL;
      setEmailBorder(true);
      emailEl.value = "";
    }
  });
} else {
  console.error("Email input veya buton bulunamadı.");
}

// -----------------------------------------------------------------------------------------------------------
// User Get Api

document.addEventListener("DOMContentLoaded", function () {
  const accessToken = sessionStorage.getItem("user_token");

  const userDiv = document.querySelector(".user-div");
  const userImg = document.querySelector("#user-id-image");
  const userName = document.querySelector("#user-id-name");
  const userBtn = document.querySelector(".user-btn");

  if (accessToken) {
    userBtn.style.display = "none";
    userDiv.style.display = "flex";

    fetch("https://api.sarkhanrahimli.dev/api/filmalisa/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          console.error(
            `Hata Detayı: ${response.status} - ${response.statusText}`
          );
          throw new Error("API isteği başarısız oldu");
        }
        return response.json();
      })
      .then((responseData) => {
        const data = responseData.data;

        userImg.src = data.img_url || "/Assets/images/default.jpg";
        userImg.onerror = function () {
          this.src = "/Assets/images/default.jpg";
        };

        userName.textContent = data.full_name || "Kullanıcı Adı";
      })
      .catch((error) => {
        console.error("Kullanıcı bilgileri alınamadı:", error);
        userImg.src = "/Assets/images/default.jpg";
        userImg.onerror = function () {
          this.src = "/Assets/images/default.jpg";
        };
        userName.textContent = "Kullanıcı Adı Mevcut Değil";
      });
  } else {
    userBtn.style.display = "flex";
    userDiv.style.display = "none";
  }
});

// ------------------------------------------------------------------------------------------------------------------------
// User Modul

document.addEventListener("DOMContentLoaded", function () {
  const userDiv = document.querySelector(".user-div");
  const userModal = document.querySelector("#user-modal");

  function openModal() {
    userModal.classList.remove("hide");
    userModal.classList.add("show");
  }

  function closeModal() {
    userModal.classList.remove("show");
    userModal.classList.add("hide");
  }

  userDiv.addEventListener("click", function (event) {
    event.stopPropagation();

    if (userModal.classList.contains("show")) {
      closeModal();
    } else {
      openModal();
    }
  });

  document.addEventListener("click", function (event) {
    if (!userDiv.contains(event.target) && !userModal.contains(event.target)) {
      if (userModal.classList.contains("show")) {
        closeModal();
      }
    }
  });
  userModal.addEventListener("click", function (event) {
    const clickedItem = event.target.closest("li");
    if (clickedItem) {
      const action = clickedItem.textContent.trim();
      if (action.includes("Settings")) {
        window.location.href = "./Pages/Client/account.html";
      } else if (action.includes("Logout")) {
        sessionStorage.clear();
        location.reload();
      }
    }
  });
});
