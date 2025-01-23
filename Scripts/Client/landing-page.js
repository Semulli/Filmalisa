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
  const registerURL = "./Pages/Client/register.html";

  function setEmailBorder(isValid) {
    emailEl.style.border = isValid ? "none" : "1px solid red";
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|net|org|edu|gov)$/i;
    return emailRegex.test(email);
  }

  const userToken = sessionStorage.getItem("user_token");
  if (userToken) {
    btn.disabled = true;
  } else {
    btn.addEventListener("click", () => {
      const emailValue = emailEl.value.trim();

      if (emailValue === "" || !isValidEmail(emailValue)) {
        setEmailBorder(false);
      } else {
        sessionStorage.setItem("email", emailValue);

        setEmailBorder(true);
        emailEl.value = "";
        location.href = registerURL;
      }
    });
  }

  emailEl.addEventListener("input", () => {
    setEmailBorder(true);
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
  const userEmail = document.querySelector("#emailInput");
  const userFullname = document.querySelector("#fullname");
  const userEmail2 = document.querySelector("#email");
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

        userImg.src = data.img_url || "./Assets/images/user-image.png";
        userImg.onerror = function () {
          this.src = "./Assets/images/user-image.png";
        };

        userName.textContent = data.full_name || "Kullanıcı Adı";
        if (userEmail2) {
          userEmail2.value = data.email || "";
          userEmail2.setAttribute("readonly", true);
        }
        if (userFullname) {
          userFullname.value = data.full_name || "";
          userFullname.setAttribute("readonly", true);
        }
      })
      .catch((error) => {
        console.error("Kullanıcı bilgileri alınamadı:", error);
        userImg.src = "./Assets/images/user-image.png";
        userImg.onerror = function () {
          this.src = "./Assets/images/user-image.png";
        };
        userName.textContent = "Kullanıcı Adı Mevcut Değil";
      });
  } else {
    userBtn.style.display = "flex";
    userDiv.style.display = "none";
  }
});

// -----------------------------------------------------------------------------------------------------------
// Contactus Post Api

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const fullnameInput = document.getElementById("fullname");
  const emailInput = document.getElementById("email");
  const reasonInput = document.getElementById("reason");

  function setInputBorder(input, isValid) {
    input.style.border = isValid ? "1px solid #ccc" : "1px solid red";
  }

  function validateInputs() {
    let isValid = true;

    if (fullnameInput.value.trim() === "") {
      setInputBorder(fullnameInput, false);
      isValid = false;
    } else {
      setInputBorder(fullnameInput, true);
    }

    if (
      emailInput.value.trim() === "" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)
    ) {
      setInputBorder(emailInput, false);
      isValid = false;
    } else {
      setInputBorder(emailInput, true);
    }

    if (reasonInput.value.trim() === "") {
      setInputBorder(reasonInput, false);
      isValid = false;
    } else {
      setInputBorder(reasonInput, true);
    }

    return isValid;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userToken = sessionStorage.getItem("user_token");
    if (!userToken) {
      document.getElementById("pop-p").textContent =
        "Please log in before contacting us";
      showPopup();

      const closeBtn = document.getElementById("closePopup");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          window.location.href = "./Pages/Client/login.html";
        });
      }

      return;
    }

    if (!validateInputs()) {
      return;
    }

    const formData = {
      full_name: fullnameInput.value.trim(),
      email: emailInput.value.trim(),
      reason: reasonInput.value.trim(),
    };

    console.log("Sending Data:", formData);

    try {
      const response = await fetch(
        "https://api.sarkhanrahimli.dev/api/filmalisa/contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        document.getElementById("pop-p").textContent =
          "Your message has been sent successfully!";
        showPopup();
        reasonInput.value = "";
      } else {
        const errorData = await response.json();
        console.error("API Error:", errorData);
      }
    } catch (error) {
      console.error("Network Error:", error);
    }
  });

  [fullnameInput, emailInput, reasonInput].forEach((input) => {
    input.addEventListener("input", () => {
      setInputBorder(input, true);
    });
  });
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

function showPopup() {
  const popup = document.getElementById("popup");
  popup.classList.add("show");
  popup.style.display = "flex";
}

function closePopup() {
  const popup = document.getElementById("popup");
  popup.classList.remove("show");
  setTimeout(() => {
    popup.style.display = "none";
  }, 500);
}
