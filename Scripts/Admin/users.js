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
const tbody = document.querySelector("#tBody");
const paginationContainer = document.getElementById("pagination-container");
let currentPage = 1;
const rowsPerPage = 7;
let users = [];

async function getUser() {
  try {
    const token = sessionStorage.getItem("access_token");
    console.log("Access token:", token);

    const response = await fetch(
      "https://api.sarkhanrahimli.dev/api/filmalisa/admin/users",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching users: ${response.status}`);
    }

    const data = await response.json();
    users = data.data.sort((a, b) =>
      new Date(a.created_at) > new Date(b.created_at) ? -1 : 1
    );

    console.log("Fetched users:", users);

    displayUser(users, tbody, rowsPerPage, currentPage);
    setupPagination(users, paginationContainer, rowsPerPage);
  } catch (error) {
    console.error("Unexpected error happened:", error);
  }
}

function displayUser(items, tableBody, rowsPerPage, page) {
  tableBody.innerHTML = "";

  if (items.length === 0) {
    const emptyRow = document.createElement("tr");
    emptyRow.innerHTML = `
      <td colspan="6" style="text-align:center; padding: 20px;">
      There are currently no users available.
      </td>
    `;
    tableBody.appendChild(emptyRow);
    return;
  }

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedItems = items.slice(startIndex, endIndex);

  paginatedItems.forEach((user, index) => {
    const row = document.createElement("tr");
    row.dataset.id = user.id;
    row.innerHTML = `
      <td>${startIndex + index + 1}</td>
      <td>${user.full_name}</td>
      <td>${user.email}</td>
    `;
    tableBody.appendChild(row);
  });
}

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
        displayUser(items, tbody, rowsPerPage, currentPage);
        setupPagination(items, container, rowsPerPage);
      }
    });

    container.appendChild(button);
  });
};

window.addEventListener("load", getUser);