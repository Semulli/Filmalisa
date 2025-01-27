window.addEventListener("load", () => {
  const mainToken = sessionStorage.getItem("user_token");

  if (!mainToken) {
    window.location.href = "../../Pages/Client/login.html";
  }
});

//------------------------------------------------------------------
// Get personal info
async function getProfileInfo() {
  try {
    let response = await fetch(
      "https://api.sarkhanrahimli.dev/api/filmalisa/profile",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("user_token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    let data = await response.json();
    console.log(data);

    showProfile(data);
  } catch (error) {
    console.error("Unexpected error happened:", error);
  }
}

function showProfile(info) {
  let formElement = document.querySelector("#form");

  if (!formElement) {
    console.error("Form element not found in DOM");
    return;
  }

  formElement.innerHTML = `
    <div class="form-group">
      <img src="../../Assets/icons/Client-login/left-icon.svg" alt="fullname" class="input-icon" />
      <input type="text" name="img_url" id="img_url" value="${info.data.img_url}" />
    </div>
    <div class="form-group">
      <img src="../../Assets/icons/Client-login/left-icon.svg" alt="fullname" class="input-icon" />
      <input type="text" name="full_name" value="${info.data.full_name}" required />
    </div>
    <div class="form-group">
      <img src="../../Assets/icons/login/login_messages.svg" alt="username" class="input-icon" />
      <input type="text" id="email" name="email" value="${info.data.email}" readonly />
    </div>
    <div class="form-group">
      <img src="../../Assets/icons/Client-login/lpassword-icon.svg" alt="password" class="input-icon" />
      <input type="password" id="password" name="password" placeholder="password" required />
      <img src="../../Assets/icons/Client-login/right-icon.svg" alt="password-right" class="input-icon" id="toggle-password"/>
    </div>
    <button type="submit" class="register-btn">Save</button>
  `;

  const togglePassword = document.getElementById("toggle-password");
  if (togglePassword) {
    togglePassword.addEventListener("click", () => {
      const passwordInput = document.getElementById("password");
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.src = "../../Assets/icons/Client-login/eye-open-icon.svg"; 
      } else {
        passwordInput.type = "password";
        togglePassword.src = "../../Assets/icons/Client-login/right-icon.svg"; 
      }
    });
  } else {
    console.warn("'toggle-password' element not found");
  }

  const profileImage = document.querySelector("#image");
  const imgInput = document.querySelector("#img_url");

  if (profileImage && imgInput) {
    profileImage.src = info.data.img_url;

    imgInput.addEventListener("input", (e) => {
      profileImage.src = e.target.value;
    });
  }
}

async function updateProfileInfo(newProfileData) {
  try {
    let response = await fetch(
      "https://api.sarkhanrahimli.dev/api/filmalisa/profile",
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("user_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProfileData),
      }
    );

    if (response.ok) {
      let updatedData = await response.json();
      console.log("Profile updated successfully:", updatedData);

      showPopup("Profile updated successfully!"); 
    } else {
      console.log("Failed to update profile");
      showPopup("Failed to update profile");
    }
  } catch (error) {
    console.log("Unexpected error during profile update:", error);
    showPopup("Unexpected error occurred");
  }
}

const formElement = document.querySelector("#form");
if (formElement) {
  formElement.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const newProfileData = {
      img_url: formData.get("img_url") || "",
      full_name: formData.get("full_name") || "",
      email: formData.get("email") || "",
      password: formData.get("password") || "",
    };

    updateProfileInfo(newProfileData);
  });
} else {
  console.warn("'#form' element not found in DOM");
}

function showPopup(message) {
  const popup = document.getElementById("popup");
  const popupText = document.getElementById("pop-p");

  popupText.textContent = message;
  popup.classList.add("show");

  setTimeout(() => {
    closePopup();
    getProfileInfo();  
  }, 3000);
}

function closePopup() {
  const popup = document.getElementById("popup");

  popup.classList.remove("show");
  popup.style.display = "none";
}

getProfileInfo();
