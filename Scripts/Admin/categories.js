// ----------------------------------------------------------------------------------------------------------------------
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

// ----------------------------------------------------------------------------------------------------------------------
// API URL

const apiUrl = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/categories";
const apiUrl2 = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/category";

// Elements

const tbody = document.querySelector(".tbody");
const paginationContainer = document.getElementById("pagination-container");
let currentPage = 1;
const rowsPerPage = 7;
let categories = [];

// ----------------------------------------------------------------------------------------------------------------------
// Get Api

const fetchCategories = async () => {
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const result = await response.json();

    categories = result.data.sort((a, b) =>
      new Date(a.created_at) > new Date(b.created_at) ? -1 : 1
    );

    displayTable(categories, tbody, rowsPerPage, currentPage);
    setupPagination(categories, paginationContainer, rowsPerPage);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

const displayTable = (items, tableBody, rowsPerPage, page) => {
  tableBody.innerHTML = "";
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedItems = items.slice(startIndex, endIndex);

  paginatedItems.forEach((category, index) => {
    const row = document.createElement("tr");
    row.dataset.id = category.id;
    row.innerHTML = `
      <td>${startIndex + index + 1}</td>
      <td>${category.name}</td>
      <td>
        <img
          src="../../Assets/icons/categories/edit-icon.png"
          alt="edit-icon"
          class="img-icon"
          onclick="openModal('edit', ${category.id}, '${category.name}')"
        />
      </td>
      <td>
        <img
          src="../../Assets/icons/categories/remove-icon.png"
          alt="remove-icon"
          class="img-icon"
          onclick="openRemoveModal(${category.id})"
        />
      </td>
    `;
    tableBody.appendChild(row);
  });
};

window.addEventListener("load", fetchCategories);

// ----------------------------------------------------------------------------------------------------------------------
// Create and Edit Modal

const myForm = document.getElementById("myForm");
myForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const categoryName = document.getElementById("title").value.trim();
  if (!categoryName) return;

  if (mode === "create") {
    await createCategory(categoryName);
  } else if (mode === "edit") {
    await editCategory(currentCategoryId, categoryName);
  }

  closeModal();
});

// ----------------------------------------------------------------------------------------------------------------------
// Create Api

const createCategory = async (categoryName) => {
  try {
    const actionBtn = document.getElementById("action-btn");
    actionBtn.disabled = true;

    const response = await fetch(apiUrl2, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({ name: categoryName }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create category");
    }

    const result = await response.json();

    if (result.result === true) {
      document.getElementById("pop-p").textContent =
        "Category created successfully!";
      showPopup();
      categories.unshift(result.data);
      displayTable(categories, tbody, rowsPerPage, 1);
      setupPagination(categories, paginationContainer, rowsPerPage);
    } else {
      throw new Error(
        result.message || "An error occurred while creating the category."
      );
    }
  } catch (error) {
    console.error("Error creating category:", error);
  } finally {
    document.getElementById("action-btn").disabled = false;
  }
};

// ----------------------------------------------------------------------------------------------------------------------
// Edit Api

const editCategory = async (id, newName) => {
  try {
    const editUrl = `${apiUrl2}/${id}`;

    const response = await fetch(editUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({ name: newName }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to edit category");
    }

    const result = await response.json();

    if (result.result === true) {
      document.getElementById("pop-p").textContent =
        "Category updated successfully!";
      showPopup();

      const category = categories.find((cat) => cat.id === id);
      if (category) category.name = newName;
      displayTable(categories, tbody, rowsPerPage, currentPage);
    } else {
      throw new Error(
        result.message || "An error occurred while editing the category."
      );
    }
  } catch (error) {
    console.error("Error editing category:", error);
  }
};

// ----------------------------------------------------------------------------------------------------------------------
// Delete Api

const deleteCategory = async (id) => {
  try {
    const deleteUrl = `${apiUrl2}/${id}`;

    const response = await fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete category");
    }

    const result = await response.json();

    if (result.result === true) {
      document.getElementById("pop-p").textContent =
        "Category deleted successfully!";
      showPopup();
      categories = categories.filter((cat) => cat.id !== id);
      displayTable(categories, tbody, rowsPerPage, currentPage);
      setupPagination(categories, paginationContainer, rowsPerPage);
      closeRemoveModal();
    } else {
      throw new Error(
        result.message || "An error occurred while deleting the category."
      );
    }
  } catch (error) {
    console.error("Error deleting category:", error);
  }
};

// -------------------------------------------------------------------------------------------------------------
// Page Buttons

const setupPagination = (items, container, rowsPerPage) => {
  container.innerHTML = "";
  const pageCount = Math.ceil(items.length / rowsPerPage);

  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(pageCount, startPage + 2);

  if (endPage - startPage + 1 < 3) {
    startPage = Math.max(1, endPage - 2);
  }

  for (let i = startPage; i <= startPage + 2; i++) {
    const button = document.createElement("button");
    button.classList.add("pagination-btn");
    button.textContent = i;

    if (i > pageCount) {
      button.disabled = true;
      button.classList.add("disabled");
    } else {
      button.classList.toggle("active", currentPage === i);

      button.addEventListener("click", () => {
        if (!button.disabled) {
          currentPage = i;
          displayTable(items, tbody, rowsPerPage, currentPage);
          setupPagination(items, container, rowsPerPage);
        }
      });
    }

    container.appendChild(button);
  }
};

// -------------------------------------------------------------------------------------------------------------
// Modals Open and Closed

document.getElementById("create-btn").addEventListener("click", () => {
  openModal("create");
});

const openModal = (action = "create", categoryId = null, categoryName = "") => {
  const modal = document.getElementById("modal");
  const actionBtn = document.getElementById("action-btn");
  const titleInput = document.getElementById("title");

  mode = action;

  if (mode === "create") {
    titleInput.value = "";
    actionBtn.textContent = "Submit";
    currentCategoryId = null;
  } else if (mode === "edit") {
    titleInput.value = categoryName;
    actionBtn.textContent = "Edit";
    currentCategoryId = categoryId;
  }

  modal.style.display = "flex";

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
};

const closeModal = () => {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
};

const openRemoveModal = (id) => {
  const modal = document.getElementById("modal-remove");
  modal.style.display = "flex";

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeRemoveModal();
    }
  });

  document.getElementById("yes-btn").onclick = () => deleteCategory(id);
  document.getElementById("no-btn").onclick = closeRemoveModal;
};

const closeRemoveModal = () => {
  const modal = document.getElementById("modal-remove");
  modal.style.display = "none";
};

function showPopup() {
  const popup = document.getElementById("popup");
  popup.classList.add("show");
  popup.style.display = "flex";

  setTimeout(() => {
    closePopup();
  }, 2000);
}

function closePopup() {
  const popup = document.getElementById("popup");
  popup.classList.remove("show");
  popup.style.display = "none";
}
