document.getElementById("create-btn").addEventListener("click", function () {
  document.getElementById("modal").style.display = "flex";
});

document.getElementById("modal").addEventListener("click", function (event) {
  if (event.target === this) {
    document.getElementById("modal").style.display = "none";
  }
});

document.getElementById("myForm").addEventListener("submit", function (event) {
  event.preventDefault();
  let isValid = true;

  const inputs = document.querySelectorAll(
    "#myForm input, #myForm textarea, #myForm select"
  );

  inputs.forEach((input) => {
    if (input.type !== "checkbox" && input.value.trim() === "") {
      input.setAttribute("placeholder-original", input.placeholder);
      input.placeholder = "This field is required!";
      input.classList.add("error");
      isValid = false;
    } else if (input.type === "checkbox" && !input.checked) {
      input.nextElementSibling.style.color = "red";
      isValid = false;
    } else {
      input.classList.remove("error");
    }
  });

  if (isValid) {
    inputs.forEach((input) => {
      if (input.type === "checkbox") {
        input.checked = false;
      } else {
        input.value = "";
      }
      input.placeholder =
        input.getAttribute("placeholder-original") || input.placeholder;
      input.classList.remove("error");
    });

    document.getElementById("modal").style.display = "none";
  }
});

function openModal() {
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  const inputs = document.querySelectorAll(
    "#myForm input, #myForm textarea, #myForm select"
  );
  inputs.forEach((input) => {
    if (input.type === "checkbox") {
      input.checked = false;
    } else {
      input.value = "";
    }
    input.placeholder =
      input.getAttribute("placeholder-original") || input.placeholder;
    input.classList.remove("error");
  });

  document.getElementById("modal").style.display = "none";
}

const inputs = document.querySelectorAll(
  "#myForm input, #myForm textarea, #myForm select"
);
inputs.forEach((input) => {
  input.addEventListener("input", () => {
    if (input.value.trim() !== "") {
      input.classList.remove("error");
    }
  });
});
