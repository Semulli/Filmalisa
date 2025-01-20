// -------------------------------------------------------------------------------------------------
// Token Control
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

// -------------------------------------------------------------------------------------------------
// Url And Token Api

const API_URL = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/actors";
const accessToken = sessionStorage.getItem("access_token");

// -------------------------------------------------------------------------------------------------
// Elements

const tbody = document.querySelector(".tbody");
const paginationContainer = document.getElementById("pagination-container");
let currentPage = 1;
const rowsPerPage = 7;

// ------------------------------------------------------------------------------------------------------------
// Get Api

async function fetchActorsWithPagination() {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const actors = result.data || [];

    displayTableWithPagination(actors, tbody, rowsPerPage, currentPage);
    setupPagination(actors, paginationContainer, rowsPerPage);
  } catch (error) {
    console.error("Error fetching actors:", error);
  }
}

const displayTableWithPagination = (items, tableBody, rowsPerPage, page) => {
  tableBody.innerHTML = "";
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedItems = items.slice(startIndex, endIndex);

  paginatedItems.forEach((actor, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${startIndex + index + 1}</td>
      <td>
        <img
          src="${actor.img_url || "../../Assets/images/default.jpg"}"
          style="width: 29px; height: 39px"
          alt="Actor Image"
          class="image-default-1"
          onerror="this.onerror=null; this.src='../../Assets/images/default.jpg';"
        />
      </td>
      <td>${actor.name}</td>
      <td>${actor.surname}</td>
      <td>
        <img
          src="../../Assets/icons/categories/edit-icon.png"
          alt="Edit Icon"
          class="img-icon"
        />
      </td>
      <td>
        <img
          src="../../Assets/icons/categories/remove-icon.png"
          alt="Remove Icon"
          class="img-icon"
          onclick="openRemoveModal(${actor.id})"
        />
      </td>
    `;

    tableBody.appendChild(row);
  });
};

document.addEventListener("DOMContentLoaded", fetchActorsWithPagination);

// ------------------------------------------------------------------------------------------------------------
// Page Button

const setupPagination = (items, container, rowsPerPage) => {
  container.innerHTML = "";
  const pageCount = Math.ceil(items.length / rowsPerPage);

  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(pageCount, startPage + 2);

  if (endPage - startPage + 1 < 3) {
    startPage = Math.max(1, endPage - 2);
  }

  const buttons = [];
  for (let i = startPage; i <= endPage; i++) {
    buttons.push(i);
  }

  while (buttons.length < 3) {
    if (buttons[0] > 1) {
      buttons.unshift(buttons[0] - 1);
    } else if (buttons[buttons.length - 1] < pageCount) {
      buttons.push(buttons[buttons.length - 1] + 1);
    } else {
      buttons.push(buttons.length + 1);
    }
  }

  buttons.forEach((i) => {
    const button = document.createElement("button");
    button.classList.add("pagination-btn");
    button.textContent = i;

    if (i > pageCount) {
      button.disabled = true;
      button.classList.add("disabled");
    }

    if (i === currentPage) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      if (!button.disabled) {
        currentPage = i;
        displayTableWithPagination(items, tbody, rowsPerPage, currentPage);
        setupPagination(items, container, rowsPerPage);
      }
    });

    container.appendChild(button);
  });
};

// -------------------------------------------------------------------------------------------------

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
