window.addEventListener("load", () => {
  const container = document.querySelector("#contentContainer");

  if (!container) {
    console.error("Element #contentContainer not found!");
    return;
  }

  let isDown = false;
  let startX;
  let scrollLeft;
  let isDrag = false;
  let clickTimeout;

  container.addEventListener("mousedown", (e) => {
    isDown = true;
    isDrag = false;
    container.classList.add("active");
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;

    clickTimeout = setTimeout(() => {
      isDrag = true;
      container.querySelectorAll(".content-card").forEach((card) => {
        card.style.pointerEvents = "none";
      });
    }, 150);
  });

  container.addEventListener("mouseleave", () => {
    isDown = false;
    clearTimeout(clickTimeout);
    container.classList.remove("active");

    container.querySelectorAll(".content-card").forEach((card) => {
      card.style.pointerEvents = "auto";
    });
  });

  container.addEventListener("mouseup", () => {
    isDown = false;
    clearTimeout(clickTimeout);
    container.classList.remove("active");

    container.querySelectorAll(".content-card").forEach((card) => {
      card.style.pointerEvents = "auto";
    });
  });

  container.addEventListener("mousemove", (e) => {
    if (!isDown || !isDrag) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    container.scrollLeft = scrollLeft - walk;
  });

  getFavoriteMovies();
});


async function getFavoriteMovies() {
  try {
    let response = await fetch(
      "https://api.sarkhanrahimli.dev/api/filmalisa/movies/favorites",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("user_token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    let data = await response.json();
    console.log(data);
    displayFavoriteMovies(data);
  } catch (error) {
    console.log("Unexpected error happened:", error);
  }
}

window.addEventListener("load", () => {
  const mainToken = sessionStorage.getItem("user_token");

  if (!mainToken) {
    window.location.href = "../../Pages/Client/register.html";
  }
});

function displayFavoriteMovies(element) {
  let container = document.querySelector("#contentContainer");

  if (!container) {
    console.error("Container element not found!");
    return;
  }

  container.innerHTML = element.data
    .map((el) => {
      return `
        <div class="content-card" data-id="${el.id}">
          <img
            src="${el.cover_url}"
            alt="${el.title}"
            class="content-image"
          />
          <div class="content-info">
            <span class="content-category">${el.category}</span>
            <div class="movie-rating" data-rating="${el.imdb}"></div>
            <p class="content-title">${el.title}</p>
          </div>
        </div>
      `;
    })
    .join("");

  applyStarRatings();

  // Add click event to each movie card
  container.querySelectorAll(".content-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      const movieId = e.currentTarget.getAttribute("data-id");
      window.location.href = `../../Pages/Client/details-1.html?${movieId}`;
    });
  });
}

function applyStarRatings() {
  document.querySelectorAll(".movie-rating").forEach((ratingContainer) => {
    let imdbRating = parseFloat(ratingContainer.getAttribute("data-rating"));
    let starCount = Math.floor(imdbRating / 2);
    let hasHalfStar = (imdbRating / 2) % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      const star = document.createElement("span");
      star.className = "star";

      if (i <= starCount) {
        star.classList.add("filled");
      } else if (i === starCount + 1 && hasHalfStar) {
        star.classList.add("half");
      }

      ratingContainer.appendChild(star);
    }
  });
}

getFavoriteMovies();
