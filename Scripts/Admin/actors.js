// -------------------------------------------------------------------------------------------------
// Token Control
window.addEventListener("load", () => {
  const accessToken = sessionStorage.getItem("access_token");

  if (!accessToken) {
    window.location.href = "login.html";
  }
});

const logoutDiv = document.querySelector(".logout-div");
if (logoutDiv) {
  logoutDiv.addEventListener("click", () => {
    sessionStorage.removeItem("access_token");
    window.location.href = "../../Pages/Admin/login.html";
  });
} else {
  console.error(".logout-div element not found");
}

// -------------------------------------------------------------------------------------------------
// Url And Token Api

const API_URL = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/actors";
const API_URL2 = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/actor";
const accessToken = sessionStorage.getItem("access_token");

// -------------------------------------------------------------------------------------------------
// Elements

const tbody = document.querySelector(".tbody");
const paginationContainer = document.getElementById("pagination-container");
const imgURLInput = document.getElementById("imgURL");
const previewImage = document.getElementById("previewImage");
const DEFAULT_IMAGE_URL = "../../Assets/images/default.jpg";
const rowsPerPage = 7;
let currentPage = 1;
let isEditMode = false;
let editActorId = null;

// ------------------------------------------------------------------------------------------------------------
// GET Api

async function fetchActorsWithPagination() {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    let actors = result.data || [];

    actors.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    displayTableWithPagination(actors, tbody, rowsPerPage, currentPage);
    setupPagination(actors, paginationContainer, rowsPerPage);
  } catch (error) {
    console.error("Error fetching actors:", error);
  }
}

const displayTableWithPagination = (items, tableBody, rowsPerPage, page) => {
  if (!tableBody) return;
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
          src="${actor.img_url || DEFAULT_IMAGE_URL}"
          style="width: 29px; height: 39px"
          alt="Actor Image"
          class="image-default-1"
          onerror="this.onerror=null; this.src='${DEFAULT_IMAGE_URL}';"
        />
      </td>
      <td>${actor.name}</td>
      <td>${actor.surname}</td>
      <td>
        <img
          src="../../Assets/icons/categories/edit-icon.png"
          alt="Edit Icon"
          class="img-icon"
          onclick="openEditModal(${actor.id}, '${actor.name}', '${
      actor.surname
    }', '${actor.img_url}')"
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

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", fetchActorsWithPagination);
} else {
  fetchActorsWithPagination();
}

// ------------------------------------------------------------------------------------------------------------
// Page Button

const setupPagination = (items, container, rowsPerPage) => {
  if (!container) return;
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
// Create Modal

const createBtn = document.getElementById("create-btn");
const modal = document.getElementById("modal");
const form = document.getElementById("myForm");

if (createBtn) {
  createBtn.addEventListener("click", function () {
    isEditMode = false;
    editActorId = null;
    document.getElementById("submit-btn").textContent = "Create";
    form.reset();
    previewImage.src = DEFAULT_IMAGE_URL;
    if (modal) modal.style.display = "flex";
  });
} else {
  console.error("#create-btn element not found in DOM.");
}

if (modal) {
  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
} else {
  console.error("#modal element not found in DOM.");
}

if (imgURLInput) {
  imgURLInput.addEventListener("input", () => {
    const url = imgURLInput.value.trim();
    previewImage.src = url || DEFAULT_IMAGE_URL;

    previewImage.onerror = () => {
      previewImage.onerror = null;
      previewImage.src = DEFAULT_IMAGE_URL;
    };
  });
}

// ---------------------------------------------------------------------------------------------------------
// Modal

function openRemoveModal(id) {
  const removeModal = document.getElementById("modal-remove");
  if (!removeModal) {
    console.error("#modal-remove element not found in DOM.");
    return;
  }

  removeModal.setAttribute("data-actor-id", id);
  removeModal.style.display = "flex";
}

function closeRemoveModal() {
  const removeModal = document.getElementById("modal-remove");
  if (!removeModal) return;

  removeModal.style.display = "none";
  removeModal.removeAttribute("data-actor-id");
}

function openEditModal(id, name, surname, imgURL) {
  isEditMode = true;
  editActorId = id;

  document.getElementById("name").value = name;
  document.getElementById("surname").value = surname;
  document.getElementById("imgURL").value = imgURL;

  previewImage.src = imgURL || DEFAULT_IMAGE_URL;

  previewImage.onerror = () => {
    previewImage.onerror = null;
    previewImage.src = DEFAULT_IMAGE_URL;
  };

  document.getElementById("submit-btn").textContent = "Edit";
  modal.style.display = "flex";
}

document.getElementById("yes-btn").addEventListener("click", () => {
  const removeModal = document.getElementById("modal-remove");
  if (!removeModal) return;

  const actorId = removeModal.getAttribute("data-actor-id");
  if (actorId) {
    deleteActor(actorId);
  }

  closeRemoveModal();
});

document.getElementById("no-btn").addEventListener("click", () => {
  closeRemoveModal();
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

// ---------------------------------------------------------------------------------------------------------
// Post and Edit Api

async function handleFormSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const surname = document.getElementById("surname").value.trim();
  const imgURL = document.getElementById("imgURL").value.trim();

  const actorData = { name, surname, img_url: imgURL };

  try {
    if (isEditMode) {
      const response = await fetch(`${API_URL2}/${editActorId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(actorData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      document.getElementById("pop-p").textContent =
        "Actor updated successfully!";
      showPopup();
    } else {
      const response = await fetch(API_URL2, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(actorData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      document.getElementById("pop-p").textContent =
        "Actor created successfully!";
      showPopup();
    }

    modal.style.display = "none";
    fetchActorsWithPagination();
  } catch (error) {
    console.error("Error:", error);
  }
}

form.addEventListener("submit", handleFormSubmit);

// ---------------------------------------------------------------------------------------------------------
// DELETE Api

async function deleteActor(id) {
  try {
    const response = await fetch(`${API_URL2}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    document.getElementById("pop-p").textContent =
      "Actor deleted successfully!";
    showPopup();
    fetchActorsWithPagination();
  } catch (error) {
    console.error("Error deleting actor:", error);
  }
}
