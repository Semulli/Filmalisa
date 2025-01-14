window.addEventListener("load", () => {
  const accessToken = sessionStorage.getItem("access_token");

  if (!accessToken) {
    window.location.href = "login.html";
  }
});

// ----------------------------------------------------------------

function showCommentModal(commentId) {
  const commentText = document.getElementById(commentId).textContent.trim();
  const modal = document.getElementById("modal");
  const modalComment = document.getElementById("modalComment");

  modalComment.textContent = commentText;
  modal.style.display = "flex";
}

document.getElementById("modal").addEventListener("click", function (event) {
  if (event.target === this) {
    document.getElementById("modal").style.display = "none";
  }
});

// ---------------------------------------------------------------
function openRemoveModal() {
  const modal = document.getElementById("modal-remove");
  modal.style.display = "flex";
}

function closeRemoveModal() {
  const modal = document.getElementById("modal-remove");
  modal.style.display = "none";
}
