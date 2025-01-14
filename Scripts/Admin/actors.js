window.addEventListener("load", () => {
  const accessToken = sessionStorage.getItem("access_token");

  if (!accessToken) {
    window.location.href = "login.html";
  }
});

// ----------------------------------------------------------------

document.getElementById("create-btn").addEventListener("click", function () {
  document.getElementById("modal").style.display = "flex";
});

document.getElementById("modal").addEventListener("click", function (event) {
  if (event.target === this) {
    document.getElementById("modal").style.display = "none";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("name");
  const surnameInput = document.getElementById("surname");
  const imgURLInput = document.getElementById("imgURL");
  const form = document.getElementById("myForm");

  const validateInputs = () => {
    let allFilled = true;

    [nameInput, surnameInput, imgURLInput].forEach((input) => {
      if (input.value.trim() === "") {
        input.style.border = "1px solid red";
        input.style.backgroundColor = "#ffe6e6";
        allFilled = false;
      } else {
        input.style.border = "1px solid #323b54";
        input.style.backgroundColor = "#0000001a";
      }
    });

    return allFilled;
  };

  [nameInput, surnameInput, imgURLInput].forEach((input) => {
    input.addEventListener("input", () => {
      input.style.border = "1px solid #323b54";
      input.style.backgroundColor = "#0000001a";
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (validateInputs()) {
      console.log("Name:", nameInput.value);
      console.log("Surname:", surnameInput.value);
      console.log("Image URL:", imgURLInput.value);

      resetModal();
      document.getElementById("modal").style.display = "none";
    }
  });

  const resetModal = () => {
    form.reset();
    [nameInput, surnameInput, imgURLInput].forEach((input) => {
      input.style.border = "1px solid #323b54";
      input.style.backgroundColor = "#0000001a";
    });
  };
});

function openRemoveModal() {
  const modal = document.getElementById("modal-remove");
  modal.style.display = "flex";
}

function closeRemoveModal() {
  const modal = document.getElementById("modal-remove");
  modal.style.display = "none";
}
