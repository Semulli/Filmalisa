document.getElementById("create-btn").addEventListener("click", function () {
  document.getElementById("modal").style.display = "flex";
});

document.getElementById("modal").addEventListener("click", function (event) {
  if (event.target === this) {
    document.getElementById("modal").style.display = "none";
  }
});

// sumbit

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("title");
  const form = document.getElementById("myForm");
  const submitButton = document.querySelector(".submit-btn");

  input.addEventListener("input", () => {
    if (input.value.trim() !== "") {
      submitButton.disabled = false;
      input.classList.remove("error");
    } else {
      submitButton.disabled = true;
    }
  });

  form.addEventListener("submit", (e) => {
    if (input.value.trim() === "") {
      e.preventDefault();
      input.classList.add("error");
    } else {
      input.classList.remove("error");
      form.reset();
      submitButton.disabled = true;
    }
  });
});
