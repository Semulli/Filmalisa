const carousel = document.querySelector(".carousel");
let dots = [];
const token = sessionStorage.getItem("user_token");

if (!token) {
  window.location.href = "../../Pages/Client/login.html";
}

let currentIndex = 0;

function showSlide(index) {
  carousel.style.transform = `translateX(-${index * 100}%)`;
  dots.forEach((dot, idx) => {
    dot.classList.toggle("active", idx === index);
  });
}

function createDots(movies) {
  const dotsContainer = document.querySelector(".carousel-buttons");
  dotsContainer.innerHTML = "";

  movies.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = `dot ${index === 0 ? "active" : ""}`;
    dot.addEventListener("click", () => {
      currentIndex = index;
      showSlide(currentIndex);
    });
    dotsContainer.appendChild(dot);
  });

  dots = Array.from(document.querySelectorAll(".dot"));
}

setInterval(() => {
  currentIndex = (currentIndex + 1) % dots.length;
  showSlide(currentIndex);
}, 5000);
async function getMovies() {
  try {
    const response = await fetch(
      "https://api.sarkhanrahimli.dev/api/filmalisa/movies",
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("user_token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const movies = await response.json();
    const movieList = Array.isArray(movies)
      ? movies.slice(0, 3)
      : movies.data.slice(0, 3);

    populateCarousel(movieList);
    createDots(movieList);
  } catch (error) {
    console.error("Unexpected error happen:", error.message);
  }
}

function populateCarousel(movies) {
  carousel.innerHTML = "";

  movies.forEach((movie, index) => {
    const slide = document.createElement("div");
    slide.className = `slide slide-${index + 1}`;
    slide.style.backgroundImage = `url(${movie.cover_url})`;
    slide.style.backgroundSize = "cover";
    slide.style.backgroundPosition = "center";

    slide.innerHTML = `
      <div class="text-overlay">
        <span class="category">${movie.category.name}</span>
        <h1>${movie.title}</h1>
        <p>${movie.overview}</p>
        <button class="watch-btn" onclick="window.open('${movie.watch_url}', '_blank')">Watch Now</button>
      </div>
    `;
    carousel.appendChild(slide);
  });
}
//--------------------------------------------------
async function getMoviesByCategory() {
  try {
    const response = await fetch(
      "https://api.sarkhanrahimli.dev/api/filmalisa/categories",
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("user_token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API hatası: ${response.status}`);
    }

    const categories = await response.json();

    const mainContainer = document.querySelector(".main-container");
    mainContainer.innerHTML = "";

    categories.data.forEach((category) => {
      if (!category.movies || category.movies.length === 0) {
        return;
      }

      const categorySection = document.createElement("div");
      categorySection.className = "category-section";

      const categoryHeader = document.createElement("div");
      categoryHeader.className = "category-header";

      const categoryTitle = document.createElement("p");
      categoryTitle.className = "category-P";
      categoryTitle.textContent = category.name;

      const chevronIcon = document.createElement("div");
      chevronIcon.className = "chevron-icon";

      categoryHeader.appendChild(categoryTitle);
      categoryHeader.appendChild(chevronIcon);

      const categoryCardContainer = document.createElement("div");
      categoryCardContainer.className = "category-card";

      let isDown = false;
      let startX;
      let scrollLeft;

      categoryCardContainer.addEventListener("mousedown", (e) => {
        isDown = true;
        categoryCardContainer.classList.add("active");
        startX = e.pageX - categoryCardContainer.offsetLeft;
        scrollLeft = categoryCardContainer.scrollLeft;

        categoryCardContainer
          .querySelectorAll(".movie-card")
          .forEach((card) => {
            card.style.pointerEvents = "none";
          });
      });

      categoryCardContainer.addEventListener("mouseleave", () => {
        isDown = false;
        categoryCardContainer.classList.remove("active");

        categoryCardContainer
          .querySelectorAll(".movie-card")
          .forEach((card) => {
            card.style.pointerEvents = "auto";
          });
      });

      categoryCardContainer.addEventListener("mouseup", () => {
        isDown = false;
        categoryCardContainer.classList.remove("active");

        categoryCardContainer
          .querySelectorAll(".movie-card")
          .forEach((card) => {
            card.style.pointerEvents = "auto";
          });
      });

      categoryCardContainer.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - categoryCardContainer.offsetLeft;
        const walk = (x - startX) * 2;
        categoryCardContainer.scrollLeft = scrollLeft - walk;
      });

      category.movies.forEach((movie) => {
        const movieCard = document.createElement("div");
        movieCard.className = "movie-card";

        const movieImage = document.createElement("img");
        movieImage.src = movie.cover_url;
        movieImage.alt = movie.title;
        movieImage.className = "movie-image";

        const movieDetails = document.createElement("div");
        movieDetails.className = "movie-details";

        const movieTitle = document.createElement("p");
        movieTitle.className = "movie-title";
        movieTitle.textContent = movie.title;

        const movieCategory = document.createElement("span");
        movieCategory.className = "movie-category";
        movieCategory.textContent = category.name;

        const movieRating = document.createElement("div");
        movieRating.className = "movie-rating";

        const starCount = Math.floor(movie.imdb / 2);
        const hasHalfStar = (movie.imdb / 2) % 1 !== 0;

        for (let i = 1; i <= 5; i++) {
          const star = document.createElement("span");
          star.innerHTML = "★";
          if (i <= starCount) {
            star.className = "star filled";
          } else if (i === starCount + 1 && hasHalfStar) {
            star.className = "star half";
          } else {
            star.className = "star";
          }
          movieRating.appendChild(star);
        }

        movieDetails.appendChild(movieCategory);
        movieDetails.appendChild(movieRating);
        movieDetails.appendChild(movieTitle);

        movieCard.appendChild(movieImage);
        movieCard.appendChild(movieDetails);

        movieCard.addEventListener("click", () => {
          window.location.href = `../../Pages/Client/details-1.html?id=${movie.id}`;
        });

        categoryCardContainer.appendChild(movieCard);
      });

      categorySection.appendChild(categoryHeader);
      categorySection.appendChild(categoryCardContainer);

      mainContainer.appendChild(categorySection);
    });
  } catch (error) {
    console.error("Unexpected error happen:", error.message);
  }
}

getMoviesByCategory();

getMovies();
