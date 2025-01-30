const tbody = document.querySelector(".tbody");
const paginationContainer = document.getElementById("pagination-container");
let currentPage = 1;
const rowsPerPage = 7;
let comments = [];
let currentMovieId = null;
let currentDeleteId = null;

window.addEventListener("load", () => {
  const accessToken = sessionStorage.getItem("access_token");
  if (!accessToken) {
    window.location.href = "../../Pages/Admin/login.html";
  } else {
    getComments();
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
    console.error(`Comment elementi bulunamadı: ${commentId}`);
  }
}

document.getElementById("modal").addEventListener("click", function (event) {
  if (event.target === this) {
    this.style.display = "none";
  }
});

function openRemoveModal(movieId, commentId) {
  const modal = document.getElementById("modal-remove");
  if (modal) {
    currentMovieId = movieId;
    currentDeleteId = commentId;
    modal.style.display = "flex";
  } else {
    console.error("Delete modal not found..");
  }
}

function closeRemoveModal() {
  const modal = document.getElementById("modal-remove");
  if (modal) {
    modal.style.display = "none";
    currentDeleteId = null;
    currentMovieId = null;
  } else {
    console.error("Delete modal not found.");
  }
}

document.getElementById("yes-btn").addEventListener("click", async () => {
  if (currentMovieId && currentDeleteId) {
    await deleteComments(currentMovieId, currentDeleteId);
    closeRemoveModal();
  }
});

async function deleteComments(movieId, commentId) {
  try {
    const response = await fetch(
      `https://api.sarkhanrahimli.dev/api/filmalisa/admin/movies/${movieId}/comment/${commentId}`,
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
      console.error("error:", errorData);
      throw new Error(errorData.message || "Deletion failed.");
    }
    comments = comments.filter((comment) => comment.id !== commentId);
    displayComments(comments, tbody, rowsPerPage, currentPage);
    setupPagination(comments, paginationContainer, rowsPerPage);
    document.getElementById("pop-p").textContent =
      "Comment deleted successfully!";
    showPopup();
  } catch (error) {
    console.error("Unexpected error:", error.message);
  }
}

async function getComments() {
  try {
    const response = await fetch(
      "https://api.sarkhanrahimli.dev/api/filmalisa/admin/comments",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error in Submitting Comments:", errorData);
      throw new Error(errorData.message || `Hata kodu: ${response.status}`);
    }
    const data = await response.json();
    comments = data.data.sort((a, b) =>
      new Date(a.created_at) > new Date(b.created_at) ? -1 : 1
    );
    displayComments(comments, tbody, rowsPerPage, currentPage);
    setupPagination(comments, paginationContainer, rowsPerPage);
  } catch (error) {
    console.error("An error occurred while retrieving comments:", error.message);
  }
}

function displayComments(items, tableBody, rowsPerPage, page) {
  tableBody.innerHTML = "";
  if (items.length === 0) {
    const emptyRow = document.createElement("tr");
    emptyRow.innerHTML = `
      <td colspan="6" style="text-align:center; padding: 20px;">
        There are currently no comments to display.
      </td>
    `;
    tableBody.appendChild(emptyRow);
    return;
  }
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedItems = items.slice(startIndex, endIndex);
  paginatedItems.forEach((comment, index) => {
    const row = document.createElement("tr");
    row.dataset.id = comment.id;
    row.innerHTML = `
      <td>${startIndex + index + 1}</td>
      <td>anonymous</td>
      <td>anonymous</td>
      <td>${comment.movie.title}</td>
      <td id="reason-${comment.id}">${
      comment.comment || "Sebep belirtilmedi."
    }</td>
      <td>
        <img
          src="../../Assets/icons/comments/comments-zoom.png"
          alt="zoom-icon"
          class="img-icon"
          onclick="showCommentModal('reason-${comment.id}')"
        />
      </td>
      <td>
        <img
          src="../../Assets/icons/categories/remove-icon.png"
          alt="remove-icon"
          class="img-icon"
          id="create-btn2"
          onclick="openRemoveModal(${comment.movie.id}, ${comment.id})"
        />
      </td>
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
        displayComments(items, tbody, rowsPerPage, currentPage);
        setupPagination(items, container, rowsPerPage);
      }
    });

    container.appendChild(button);
  });
};

function showPopup() {
  const popup = document.getElementById("popup");
  popup.classList.add("show");
  setTimeout(() => {
    closePopup();
  }, 2000);
}

function closePopup() {
  const popup = document.getElementById("popup");
  popup.classList.remove("show");
  popup.style.display = "none";
}
