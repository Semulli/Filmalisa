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
let comments = [];

async function deleteComments(id) {
  try {
    const response = await fetch(
      `https://api.sarkhanrahimli.dev/api/filmalisa/admin/movies/1/comment/${id}`,
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
    }

    const data = await response.json();
    console.log("response:", data);

    if (data && data.result === true) {
      document.getElementById("pop-p").textContent =
        "Info succesfully deleted!";
      showPopup();

      comments = comments.filter((cont) => cont.id !== id);
      displayComments(comments, tbody, rowsPerPage, currentPage);
      setupPagination(comments, paginationContainer, rowsPerPage);
    } else {
      throw new Error(data.message || "Can't delete the data ");
    }
  } catch (error) {
    console.error("unexpected error:", error.message);
  }
}
document.getElementById("yes-btn").addEventListener("click", async () => {
  if (currentDeleteId) {
    await deleteComments(currentDeleteId);
    document.getElementById("pop-p").textContent =
      "ClientComplaint is removed successfully!";
    showPopup();
    closeRemoveModal();
  }
});

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
      throw new Error(`error: ${response.status}`);
    }

    const data = await response.json();
    comments = data.data.sort((a, b) =>
      new Date(a.created_at) > new Date(b.created_at) ? -1 : 1
    );

    displayComments(comments, tbody, rowsPerPage, currentPage);
    setupPagination(comments, paginationContainer, rowsPerPage);
  } catch (error) {
    console.error("error", error);
  }
}

function displayComments(items, tableBody, rowsPerPage, page) {
  tableBody.innerHTML = "";

  if (items.length === 0) {
    const emptyRow = document.createElement("tr");
    emptyRow.innerHTML = `
      <td colspan="6" style="text-align:center; padding: 20px;">
      There are currently no comments to be made.
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
              <td>${comment.full_name}</td>
              <td>${comment.email}</td>
              <td>${comment.movie.title}</td>
              <td id="reason-${comment.id}">${
      comment.comment || "No reason given."
    }>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Illum,
                doloribus minus! Quo, eum cum! Ipsum eligendi porro
                exercitationem alias provident dicta nisi temporibus omnis saepe
                repellat cumque aliquam, eum et doloribus quod. Omnis alias
                ducimus molestiae unde laborum, voluptatibus, nesciunt aut sed
                quisquam, quo accusamus! Ab porro maiores id officia officiis?
                Nam voluptatum nisi odio architecto quasi modi maxime natus
                aspernatur dignissimos numquam, blanditiis fugiat adipisci ea
                provident tenetur tempora, rem deleniti? Cum, provident tempore
                libero totam ab explicabo suscipit ratione veritatis, odit harum
                praesentium, atque eos in mollitia eum sed? Nihil dolores
                quisquam perferendis culpa, commodi numquam dolorem
                perspiciatis.
              </td>
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
                  onclick="openRemoveModal(${comment.id})"
                />
              </td>
    `;
    tableBody.appendChild(row);
  });
}

const setupPagination = (items, container, rowsPerPage) => {
  container.innerHTML = "";

  const pageCount = Math.ceil(items.length / rowsPerPage);

  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(pageCount, startPage + 2);

  if (pageCount < 3) {
    startPage = 1;
    endPage = pageCount;
  }

  for (let i = 0; i < 3; i++) {
    const pageNumber = startPage + i;

    const button = document.createElement("button");
    button.classList.add("pagination-btn");
    button.textContent = pageNumber;

    if (pageNumber > pageCount) {
      button.disabled = true;
    } else {
      button.disabled = false;
      button.classList.toggle("active", currentPage === pageNumber);

      button.addEventListener("click", () => {
        currentPage = pageNumber;
        displayComments(items, tbody, rowsPerPage, currentPage);
        setupPagination(items, container, rowsPerPage);
      });
    }

    container.appendChild(button);
  }
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

window.addEventListener("load", getComments);
