async function getAllMovies() {
  try {
    
    document.getElementById("loadingIndicator").style.display = "block";

    let response = await fetch(
      "https://api.sarkhanrahimli.dev/api/filmalisa/movies",
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

    displayAllMovies(data);
    applyStarRatings();

    // Hide loading indicator
    document.getElementById("loadingIndicator").style.display = "none";
  } catch (error) {
    console.log("Unexpected error happened:", error);
    document.getElementById("loadingIndicator").style.display = "none"; 
  }
}

let card = document.querySelector("#moviePart");

function displayAllMovies(movie) {
  card.innerHTML = movie.data
    .map((el) => {
      return `
           <div class="movie-card" data-id="${el.id}">
            <div class="movie-poster">
              <img src="${el.cover_url}" alt="" />
            </div>
            <div class="movie-info">
              <h1 class="movie-genre">${el.category.name}</h1>
               <div class="movie-rating" data-rating="${el.imdb}"></div>
              <p class="movie-title">${el.title}</p>
            </div>
          </div>
        `;
    })
    .join("");
}

getAllMovies();

//------------------------------------------------
// Search movies
let searchInput = document.querySelector("#searchBar");
let searchButton = document.querySelector(".search-header img");

searchButton.addEventListener("click", () => {
 
  document.getElementById("loadingIndicator").style.display = "block";
  card.innerHTML = "<p class='loadingMessage'></p>"; 

  searchMovies(searchInput.value);
  searchInput.value = "";
  searchInput.setAttribute("placeholder", "Search...");
});

async function searchMovies(movieName) {
  try {
    document.getElementById("loadingIndicator").style.display = "block";

    let response = await fetch(
      `https://api.sarkhanrahimli.dev/api/filmalisa/movies?search=${movieName}`,
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

    displaySearchResult(data);
    applyStarRatings();

    document.getElementById("loadingIndicator").style.display = "none";
  } catch (error) {
    console.log("Unexpected error happened:", error);
    document.getElementById("loadingIndicator").style.display = "none";
  }
}

function displaySearchResult(result) {
  if (result.data.length === 0) {
    card.innerHTML = "<p class='filmMessage'>This film doesn't exist.</p>";
    return;
  }

  card.innerHTML = result.data
    .map((el) => {
      return `
        <div class="movie-card" data-id="${el.id}">
          <div class="movie-poster">
            <img src="${el.cover_url}" alt="" />
          </div>
          <div class="movie-info">
            <h1 class="movie-genre">${el.category.name}</h1>
             <div class="movie-rating" data-rating="${el.imdb}"></div>
            <p class="movie-title">${el.title}</p>
          </div>
        </div>
      `;
    })
    .join("");
}

card.addEventListener("click", (e) => {
  if (e.target.closest(".movie-card")) {
    const movieId = e.target.closest(".movie-card").getAttribute("data-id");
    window.location.href = `../../Pages/Client/details-1.html?${movieId}`;
  }
});

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
