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

function showCommentModal(commentId) {
  const commentElement = document.getElementById(commentId);
  if (commentElement) {
    const commentText = commentElement.textContent.trim();
    const modal = document.getElementById("modal");
    const modalComment = document.getElementById("modalComment");

    modalComment.textContent = commentText;
    modal.style.display = "flex";
  } else {
    console.error(`Comment elementi tapılmadı: ${commentId}`);
  }
}

document.getElementById("modal").addEventListener("click", function (event) {
  if (event.target === this) {
    this.style.display = "none";
  }
});

let currentDeleteId = null;

function openRemoveModal(id) {
  const modal = document.getElementById("modal-remove");
  if (modal) {
    currentDeleteId = id;
    modal.style.display = "flex";
  } else {
    console.error("Silmə modalı tapılmadı.");
  }
}

function closeRemoveModal() {
  const modal = document.getElementById("modal-remove");
  if (modal) {
    modal.style.display = "none";
    currentDeleteId = null;
  } else {
    console.error("Silmə modalı tapılmadı.");
  }
}

document.getElementById("yes-btn").addEventListener("click", async () => {
  if (currentDeleteId) {
    await deleteClientComplaint(currentDeleteId);
    closeRemoveModal();
  }
});

const tbody = document.querySelector(".tbody");
const paginationContainer = document.getElementById("pagination-container");
let currentPage = 1;
const rowsPerPage = 7;
let categories = [];

// async function addSampleData() {
//   try {
//     const response = await fetch(
//       "https://api.sarkhanrahimli.dev/api/filmalisa/contact",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           full_name: "John Doe",
//           email: "john.doe@example.com",
//           reason: "Sample reason",
//         }),
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log(data);
//   } catch (error) {
//     console.log("Error adding data:", error);
//   }
// }

// addSampleData();

async function deleteClientComplaint(id) {
  try {
    const response = await fetch(
      `https://api.sarkhanrahimli.dev/api/filmalisa/admin/contact/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.log("Unexpected error happens:", errorData);
      throw new log(errorData.message || "can't deleted message");
    }

    const data = await response.json();
    console.log("response:", data);

    if (data && data.result === true) {
      document.getElementById("pop-p").textContent =
        "Info succesfully deleted!";
      showPopup();

      contacts = contacts.filter((cont) => cont.id !== id);
      displayTable(contacts, tbody, rowsPerPage, currentPage);
      setupPagination(contacts, paginationContainer, rowsPerPage);
    } else {
      throw new Error(data.message || "Can't delete the data ");
    }
  } catch (error) {
    console.error("unexpected error:", error.message);
  }
}
document.getElementById("yes-btn").addEventListener("click", async () => {
  if (currentDeleteId) {
    await deleteClientComplaint(currentDeleteId);
    showPopup();
    closeRemoveModal();
  }
});

async function getClientComplaint() {
  try {
    const response = await fetch(
      "https://api.sarkhanrahimli.dev/api/filmalisa/admin/contacts",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`error: ${response.status}`);
    }

    const data = await response.json();
    contacts = data.data.sort((a, b) =>
      new Date(a.created_at) > new Date(b.created_at) ? -1 : 1
    );

    displayTable(contacts, tbody, rowsPerPage, currentPage);
    setupPagination(contacts, paginationContainer, rowsPerPage);
  } catch (error) {
    console.error("error", error);
  }
}

const displayTable = (items, tableBody, rowsPerPage, page) => {
  tableBody.innerHTML = "";

  if (items.length === 0) {
    const emptyRow = document.createElement("tr");
    emptyRow.innerHTML = `
      <td colspan="6" style="text-align:center; padding: 20px;">
      There are currently no complaints to be made.
      </td>
    `;
    tableBody.appendChild(emptyRow);
    return;
  }

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedItems = items.slice(startIndex, endIndex);

  paginatedItems.forEach((contact, index) => {
    const row = document.createElement("tr");
    row.dataset.id = contact.id;
    row.innerHTML = `
      <td>${startIndex + index + 1}</td>
      <td>${contact.full_name}</td>
      <td>${contact.email}</td>
      <td id="reason-${contact.id}">${contact.reason || "No reason given."}</td>
      <td>
        <img
          src="../../Assets/icons/comments/comments-zoom.png"
          alt="zoom-icon"
          class="img-icon"
          onclick="showCommentModal('reason-${contact.id}')"
        />
      </td>
      <td>
        <img
          src="../../Assets/icons/categories/remove-icon.png"
          alt="remove-icon"
          class="img-icon"
          onclick="openRemoveModal(${contact.id})"
        />
      </td>
    `;
    tableBody.appendChild(row);
  });
};

const setupPagination = (items, container, rowsPerPage) => {
  container.innerHTML = "";

  const pageCount = Math.ceil(items.length / rowsPerPage);

  for (let i = 1; i <= pageCount; i++) {
    const button = document.createElement("button");
    button.classList.add("pagination-btn");
    button.textContent = i;
    button.classList.toggle("active", currentPage === i);

    button.addEventListener("click", () => {
      currentPage = i;
      displayTable(items, tbody, rowsPerPage, currentPage);
      setupPagination(items, container, rowsPerPage);
    });

    container.appendChild(button);
  }
};
function showPopup() {
  const popup = document.getElementById("popup");
  if (popup) {
    popup.classList.remove("hide");
    popup.classList.add("show");
    setTimeout(() => {
      popup.classList.remove("show");
      popup.classList.add("hide");
    }, 3000); 
  } else {
    console.error("Popup mesajı bulunamadı.");
  }
}

function closePopup() {
  const popup = document.getElementById("popup");
  popup.classList.remove("show");
  popup.style.display = "none";
}

window.addEventListener("load", getClientComplaint);
