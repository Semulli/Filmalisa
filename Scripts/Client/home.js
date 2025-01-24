const carousel = document.querySelector(".carousel");
const dots = document.querySelectorAll(".dot");

let currentIndex = 0;

function showSlide(index) {
  carousel.style.transform = `translateX(-${index * 100}%)`;
  dots.forEach((dot, idx) => {
    dot.classList.toggle("active", idx === index);
  });
}

dots.forEach((dot, idx) => {
  dot.addEventListener("click", () => {
    currentIndex = idx;
    showSlide(currentIndex);
  });
});

// Auto slide
setInterval(() => {
  currentIndex = (currentIndex + 1) % 3;
  showSlide(currentIndex);
}, 5000);

async function fetchMovies() {
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
  } catch (error) {
    console.error("Unexpected error happen:", error.message);
  }
}

function populateCarousel(movies) {
  const carousel = document.querySelector(".carousel");
  const dotsContainer = document.querySelector(".carousel-buttons");

  movies.forEach((movie, index) => {
    const slide = document.createElement("div");
    slide.className = `slide slide-${index + 1}`;
    slide.style.backgroundImage = `url(${movie.cover_url})`;
    slide.style.backgroundSize = "fill";
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

    const dot = document.createElement("button");
    dot.className = `dot ${index === 0 ? "active" : ""}`;
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => {
      currentIndex = idx;
      showSlide(currentIndex);
    });
  });
}
//--------------------------------------------------
async function loadMoviesByCategory() {
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
    console.log(categories);

    const mainContainer = document.querySelector(".main-container");
    mainContainer.innerHTML = "";

    categories.data.forEach((category, categoryIndex) => {
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

      category.movies.forEach((movie) => {
        const movieCard = document.createElement("div");

        if (categoryIndex === 0) {
          movieCard.className = "movie-card";
        } else {
          movieCard.className = "content-card";
        }

        const movieImage = document.createElement("img");
        movieImage.src = movie.cover_url;
        movieImage.alt = movie.title;
        movieImage.className =
          movieCard.className === "movie-card"
            ? "movie-image"
            : "content-image";

        const movieDetails = document.createElement("div");
        movieDetails.className =
          movieCard.className === "movie-card"
            ? "movie-details"
            : "content-info";

        const movieCategory = document.createElement("span");
        movieCategory.className =
          movieCard.className === "movie-card"
            ? "movie-category"
            : "content-category";
        movieCategory.textContent = category.name;

        const movieTitle = document.createElement("p");
        movieTitle.className =
          movieCard.className === "movie-card"
            ? "movie-title"
            : "content-title";
        movieTitle.textContent = movie.title;

        const movieRating = document.createElement("div");
        movieRating.className = "movie-rating";

        const starCount = Math.floor(movie.imdb / 2); 
        const hasHalfStar = (movie.imdb / 2) % 1 !== 0; 

        for (let i = 1; i <= 5; i++) {
          const star = document.createElement("span");
          if (i <= starCount) {
            star.className = "star filled"; 
          } else if (i === starCount + 1 && hasHalfStar) {
            star.className = "star half"; 
          } else {
            star.className = "star";
          }
          star.innerHTML = "★";
          movieRating.appendChild(star);
        }

        movieDetails.appendChild(movieRating); 

        movieDetails.appendChild(movieCategory);
        movieDetails.appendChild(movieTitle);
        movieDetails.appendChild(movieRating); 

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

loadMoviesByCategory();

fetchMovies();
