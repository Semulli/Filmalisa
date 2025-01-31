const actorSlider = document.querySelector(".actors-slider");
const movieSlider = document.querySelector(".movies-slider");
const token = sessionStorage.getItem("user_token");

if (!token) {
  window.location.href = "../../Pages/Client/login.html";
}

function sliderFunction(slider) {
  let isDown = false;
  let isDragging = false;
  let startX, scrollLeft;
  let dragTimeout;

  slider.style.cursor = "default";

  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    isDragging = false;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;

    dragTimeout = setTimeout(() => {
      if (isDown) {
        isDragging = true;
        slider.style.cursor = "grabbing";
      }
    });
  });

  slider.addEventListener("mouseleave", () => {
    isDown = false;
    clearTimeout(dragTimeout);
    slider.style.cursor = "default";
  });

  slider.addEventListener("mouseup", (e) => {
    clearTimeout(dragTimeout);

    if (!isDragging) {
      const clickedElement = document.elementFromPoint(e.clientX, e.clientY);
      if (clickedElement) {
        const clickable = clickedElement.closest(".movie");
        if (clickable) {
          clickable.click();
        }
      }
    }

    isDown = false;
    isDragging = false;
    slider.style.cursor = "default";
  });

  slider.addEventListener("mousemove", (e) => {
    if (!isDown || !isDragging) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = x - startX;
    slider.scrollLeft = scrollLeft - walk;
  });
}

sliderFunction(document.querySelector(".actors-slider"));
sliderFunction(document.querySelector(".movies-slider"));

const filmImageDom = document.querySelector(".film-image");
const overlayFilmInfoDOM = document.querySelector(".film-image .overlay");
const svgFilmInfoDOM = document.querySelector(".film-image svg");

let isVisible = false;
let setOverlayAndSvgInterval;

function startInterval() {
  setOverlayAndSvgInterval = setInterval(() => {
    if (isVisible) {
      visible(overlayFilmInfoDOM, "none");
      visible(svgFilmInfoDOM, "none");
    } else {
      visible(overlayFilmInfoDOM, "block");
      visible(svgFilmInfoDOM, "block");
    }
    isVisible = !isVisible;
  }, 1000);
  function visible(domElem, styleValue) {
    domElem.style.display = `${styleValue}`;
  }
}

function stopInterval() {
  clearInterval(setOverlayAndSvgInterval);
}

function events(domelem, overlay, svg, event, interval, styleType) {
  domelem.addEventListener(`${event}`, () => {
    overlay.style.display = `${styleType}`;
    svg.style.display = `${styleType}`;
    interval();
  });
}

events(
  filmImageDom,
  overlayFilmInfoDOM,
  svgFilmInfoDOM,
  "mouseleave",
  startInterval,
  "none"
);

events(
  filmImageDom,
  overlayFilmInfoDOM,
  svgFilmInfoDOM,
  "mouseenter",
  stopInterval,
  "block"
);

startInterval();

const textarea = document.querySelector(".auto-break"),
  alertComment = document.querySelector(".alert-comment");

textarea.addEventListener("input", function () {
  if (this.value.length > 2999) {
    this.style.color = "red";
    alertComment.style.display = "block";
  } else {
    this.style.color = "#fff";
    alertComment.style.display = "none";
    this.style.height = "auto";
    if (this.scrollHeight > 200) {
      this.style.height = "200px";
    } else {
      this.style.height = this.scrollHeight + "px";
    }
  }
});

// ---------------------------------------------------------------------------------------------------
// Movie Film İD Api

const urlParams = window.location.search.substring(1);
const filmId = urlParams;

const userToken = sessionStorage.getItem("user_token");
if (!userToken) {
  window.location.href = "../Client/login.html";
}

async function fetchFilmDetails() {
  try {
    const response = await fetch(
      `https://api.sarkhanrahimli.dev/api/filmalisa/movies/${filmId}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API Hatası: ${response.status}`);
    }

    const { data: filmData } = await response.json();

    const favoriteButton = document.getElementById("favorite-btn");
    favoriteButton.setAttribute("data-movie-id", filmData.id);

    document.querySelector(".iframe-fragman").src =
      filmData.fragman || "Film Başlığı Bulunamadı";
    document.querySelector(".film-modal-name").textContent =
      filmData.title || "Film Başlığı Bulunamadı";
    document.querySelector(".film-bg").src =
      filmData.cover_url || "../../Assets/images/details-bg.jpeg";
    document.querySelector(".film-name h1").textContent =
      filmData.title || "Film Başlığı Bulunamadı";
    document.querySelector(".film-name p").textContent =
      filmData.category.name || "Kategori Yok";
    document.querySelector(".film-text").textContent =
      filmData.overview || "Film açıklaması bulunamadı.";
    document.querySelector(".first-date p").textContent = filmData.created_at
      ? formatDate(filmData.created_at)
      : "Film Tarihi bulunamadı";

    function formatDate(dateString) {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    }
    document.querySelector(".last-date p").textContent = filmData.created_at
      ? formatDateTime(filmData.created_at)
      : "Film Saati bulunamadı";

    function formatDateTime(dateString) {
      const date = new Date(dateString);
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    }
    document.querySelector(".film-score span").textContent =
      filmData.imdb || "N/A";
    document.querySelector(".genres p").textContent =
      filmData.category?.name || "Bilinmiyor";
    document.querySelector(".smilar-link").childNodes[0].textContent =
      (filmData.category?.name || "Bilinmiyor") + " ";
    document.querySelector(".status p").textContent = filmData.adult
      ? "Adult Content"
      : "General Audience";
    document.querySelector(".run-time p").textContent = `${
      filmData.run_time_min || 0
    } min`;
    document.querySelector(".film-image img").src =
      filmData.cover_url || "../../Assets/images/lost-in-space.jpeg";

    const watchLink = document.querySelector(".film-text-header-left a");

    watchLink.addEventListener("click", (event) => {
      event.preventDefault();

      if (filmData.watch_url) {
        if (filmData.watch_url.startsWith("https://www.youtube.com/embed/")) {
          const embedId = filmData.watch_url.split("embed/")[1].split("?")[0];

          window.location.href = `details-2.html#${encodeURIComponent(
            embedId
          )}`;
          sessionStorage.setItem("movie.name", filmData.title);
        } else {
          window.open(filmData.watch_url, "_blank");
        }
      } else {
        console.error("Geçerli bir URL bulunamadı!");
      }
    });

    const actorSlides = document.querySelector(
      ".film-actors .actors-slider .actor-slides"
    );
    actorSlides.innerHTML = "";
    filmData.actors.forEach((actor) => {
      const actorSlide = document.createElement("div");
      actorSlide.classList.add("actor");

      actorSlide.innerHTML = `
          <img src="${actor.img_url}" alt="${actor.name} ${actor.surname}" " />
          <div class="actor-name" style="display: flex; flex-direction: column;">
            <span style="font-weight:;">${actor.name}</span>
            <span >${actor.surname}</span>
          </div>
        `;

      actorSlides.appendChild(actorSlide);
    });
  } catch (error) {
    console.error("Hata:", error.message);
  }
}

fetchFilmDetails();

// ---------------------------------------------------------------------------------------------------
// Movie Fragman

svgFilmInfoDOM.addEventListener("click", function () {
  const filmOverlay = document.querySelector(".film-overlay"),
    filmModal = document.querySelector(".film-modal"),
    iframe = filmModal.querySelector("iframe"),
    playButton = filmModal.querySelector(".film-modal-start"),
    filmModalInfo = filmModal.querySelector(".film-modal-info");

  stopInterval();
  filmModal.style.display = "block";
  filmOverlay.style.display = "block";
  filmModal.classList.remove("close-animation");

  let videoSrc = iframe.getAttribute("src");
  if (!videoSrc.includes("enablejsapi=1")) {
    videoSrc +=
      (videoSrc.includes("?") ? "&" : "?") +
      "enablejsapi=1&rel=0&controls=0&modestbranding=1&iv_load_policy=3&showinfo=0";
    iframe.setAttribute("src", videoSrc);
  }

  const player = new YT.Player(iframe, {
    events: {
      onReady: () => {
        playButton.addEventListener("click", () => {
          player.playVideo();
          player.unMute();
          filmModalInfo.classList.add("hide");
        });
      },
    },
  });

  filmOverlay.addEventListener("click", function () {
    filmModal.classList.add("close-animation");

    setTimeout(() => {
      filmModal.style.display = "none";

      player.stopVideo();
      filmModalInfo.classList.remove("hide");
    }, 500);

    filmOverlay.style.display = "none";
  });
});

function loadYouTubeAPI() {
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);
}

loadYouTubeAPI();

// ----------------------------------------------------------------------------------------------------------------
// Comment Get Api

document.addEventListener("DOMContentLoaded", async () => {
  const commentsContainer = document.querySelector(".film-comments");
  const loadMoreContainer = document.createElement("div");
  loadMoreContainer.classList.add("load-more");
  loadMoreContainer.innerHTML = `
      <button class="load-more-btn">Load more</button>
    `;
  commentsContainer.insertAdjacentElement("afterend", loadMoreContainer);

  const urlSearch = window.location.search.substring(1);
  const movieId = urlSearch.match(/\d+/) ? urlSearch.match(/\d+/)[0] : null;

  const apiCommentsUrl = `https://api.sarkhanrahimli.dev/api/filmalisa/movies/${movieId}/comments`;
  const defaultImageUrl = "../../Assets/images/default-profile.jpg";

  const userId = localStorage.getItem("userId");

  if (!userId) {
    console.error(
      "userId localStorage'de bulunamadı. Lütfen giriş yapmayı kontrol edin."
    );
    return;
  }

  let allComments = [];
  let visibleCommentsCount = 3;

  async function fetchComments() {
    try {
      const commentsResponse = await fetch(apiCommentsUrl, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      });

      if (commentsResponse.ok) {
        const commentsData = await commentsResponse.json();

        allComments = commentsData.data.reverse();
        renderComments();

        if (allComments.length > visibleCommentsCount) {
          loadMoreContainer.style.display = "block";
        }
      } else {
        console.error(
          "API Hatası: Yorumlar Alınamadı.",
          commentsResponse.statusText
        );
        commentsContainer.innerHTML =
          "<p>Yorumlar yüklenirken bir hata oluştu.</p>";
      }
    } catch (error) {
      console.error("API çağrılarında hata oluştu:", error);
      commentsContainer.innerHTML =
        "<p>Yorumlar yüklenirken bir hata oluştu.</p>";
    }
  }

  function renderComments() {
    commentsContainer.innerHTML = "";

    const sortedComments = [...allComments].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateB - dateA;
    });

    const commentsToShow = sortedComments.slice(0, visibleCommentsCount);

    commentsToShow.forEach((comment) => {
      const commentElement = document.createElement("div");
      commentElement.classList.add("comment");
      commentElement.setAttribute("data-comment-id", comment.id);

      const createdAt = new Date(comment.created_at);
      const hours = createdAt.getHours().toString().padStart(2, "0");
      const minutes = createdAt.getMinutes().toString().padStart(2, "0");
      const timeAgo = calculateTimeAgo(createdAt);

      const userImage = comment.user?.img_url || defaultImageUrl;
      const userName = comment.user?.full_name || "User";
      const isUserComment = parseInt(comment.user?.id) === parseInt(userId);

      commentElement.innerHTML = `
          <div class="user-info" style="position: relative;">
            <div class="user">
              <img src="${userImage}" alt="${userName}" />
              <span>${userName}</span>
            </div>
            <p>${hours}:${minutes} ${timeAgo}</p>
            ${
              isUserComment
                ? `
            <div class="menu-icon" style="position: absolute; top: -16px; right: -10px; cursor: pointer; display: none;">
              <span style="display: block; margin: 1px 0; font-size: 20px; line-height: 0;">•</span>
              <span style="display: block; margin: 8px 0; font-size: 20px; line-height: 0;">•</span>
              <span style="display: block; margin: 1px 0; font-size: 20px; line-height: 0;">•</span>
            </div>
            <div class="side-menu" style="display: none; position: absolute; top: -25px; right: -90px; background-color: #333; color: white; padding: 10px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.3); transition: all 0.3s ease-in-out;">
              <button class="delete-button" style="background: none; color: white; border: none; cursor: pointer;">Delete</button>
            </div>
            `
                : ""
            }
          </div>
          <p>${comment.comment}</p>
        `;

      if (isUserComment) {
        const menuIcon = commentElement.querySelector(".menu-icon");
        const sideMenu = commentElement.querySelector(".side-menu");

        commentElement.addEventListener("mouseenter", () => {
          menuIcon.style.display = "block";
        });

        commentElement.addEventListener("mouseleave", () => {
          menuIcon.style.display = "none";
        });

        menuIcon.addEventListener("click", (e) => {
          e.stopPropagation();
          closeAllSideMenus();
          sideMenu.style.display =
            sideMenu.style.display === "block" ? "none" : "block";
        });

        const deleteButton = commentElement.querySelector(".delete-button");
        deleteButton.addEventListener("click", () => {
          sideMenu.style.display = "none";

          const commentId = commentElement.getAttribute("data-comment-id");
          if (commentId) {
            openRemoveModal(commentId);
          } else {
            console.error("Yorum ID'si bulunamadı!");
          }
        });

        function closeAllSideMenus() {
          const allSideMenus = document.querySelectorAll(".side-menu");
          allSideMenus.forEach((menu) => {
            menu.style.display = "none";
          });
        }

        document.addEventListener("click", (e) => {
          if (!sideMenu.contains(e.target) && !menuIcon.contains(e.target)) {
            sideMenu.style.display = "none";
          }
        });
      }

      commentsContainer.appendChild(commentElement);
    });

    if (visibleCommentsCount >= allComments.length) {
      loadMoreContainer.style.display = "none";
    }
  }

  function calculateTimeAgo(date) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const givenDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    const diffInMs = today - givenDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return "today";
    } else if (diffInDays === 1) {
      return "yesterday";
    } else {
      return `${diffInDays} days ago`;
    }
  }

  loadMoreContainer
    .querySelector(".load-more-btn")
    .addEventListener("click", () => {
      visibleCommentsCount += 5;
      renderComments();
    });

  window.fetchComments = fetchComments;

  await fetchComments();
});

// ---------------------------------------------------------------------------------------------------
// Favorite Api

document.addEventListener("DOMContentLoaded", async () => {
  const favoriteButton = document.getElementById("favorite-btn");

  if (!favoriteButton) {
    console.error("Favorite button not found.");
    return;
  }

  const userToken = sessionStorage.getItem("user_token");
  if (!userToken) {
    console.error("User token not found in sessionStorage.");
    return;
  }

  const url = window.location.href;
  const movieId = url.split("?")[1];
  if (!movieId) {
    console.error("Movie ID not found in URL.");
    return;
  }

  const apiUrlBase = "https://api.sarkhanrahimli.dev/api/filmalisa/movies";
  const movieApiUrl = `${apiUrlBase}/${movieId}`;

  try {
    const response = await fetch(movieApiUrl, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const movieData = await response.json();

    const isFavorite = movieData.data.is_favorite;

    if (isFavorite) {
      favoriteButton.classList.add("active");
      favoriteButton.style.border = "2px solid #00FF00";
      favoriteButton.innerHTML = `
        <svg
          viewBox="8 8 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 16L14 20L22 12"
            stroke="#00FF00"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>`;
    } else {
      favoriteButton.classList.remove("active");
      favoriteButton.style.border = "2px solid #fff";
      favoriteButton.innerHTML = `
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M7.2 7.2L7.2 0H8.8L8.8 7.2L16 7.2V8.8L8.8 8.8L8.8 16H7.2L7.2 8.8L0 8.8V7.2L7.2 7.2Z"
            fill="white"
          />
        </svg>`;
    }
  } catch (error) {
    console.error("Error fetching movie data:", error);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const favoriteButton = document.getElementById("favorite-btn");
  const apiUrlBase = "https://api.sarkhanrahimli.dev/api/filmalisa/movie";

  favoriteButton.addEventListener("click", async () => {
    const movieId = favoriteButton.getAttribute("data-movie-id");
    const apiUrlFavorite = `${apiUrlBase}/${movieId}/favorite`;

    try {
      const response = await fetch(apiUrlFavorite, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();

        favoriteButton.classList.toggle("active");

        if (favoriteButton.classList.contains("active")) {
          favoriteButton.style.border = "2px solid #00FF00";
          favoriteButton.innerHTML = `
        <svg
          viewBox="8 8 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 16L14 20L22 12"
            stroke="#00FF00"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>`;
        } else {
          favoriteButton.style.border = "2px solid #fff";
          favoriteButton.innerHTML = `
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M7.2 7.2L7.2 0H8.8L8.8 7.2L16 7.2V8.8L8.8 8.8L8.8 16H7.2L7.2 8.8L0 8.8V7.2L7.2 7.2Z"
                fill="white"
              />
            </svg>`;
        }
      } else {
        console.error("Failed to toggle favorite:", response.statusText);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  });
});

// ---------------------------------------------------------------------------------------------------
// Comment Post Api

document.addEventListener("DOMContentLoaded", () => {
  const commentForm = document.querySelector("form");
  const commentTextarea = document.querySelector(".form-comment textarea");
  const submitButton = document.querySelector("#button-submit");

  const urlSearch = window.location.search.substring(1);
  const movieId = urlSearch.match(/^\d+$/) ? urlSearch : null;

  if (!movieId) {
    console.error("Geçersiz URL! Movie ID bulunamadı.");
    return;
  }

  const commentApiUrl = `https://api.sarkhanrahimli.dev/api/filmalisa/movies/${movieId}/comment`;

  async function postComment(event) {
    event.preventDefault();

    const commentText = commentTextarea.value.trim();

    try {
      const response = await fetch(commentApiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: commentText,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        document.getElementById("pop-p").textContent =
          "Your comment has been sent successfully.";
        showPopup();
        fetchComments();

        commentTextarea.value = "";
      } else {
        console.error("Yorum gönderme hatası:", response.statusText);
      }
    } catch (error) {
      console.error("Yorum API çağrısında hata:", error);
    }
  }

  submitButton.addEventListener("click", postComment);
});

// ---------------------------------------------------------------------------------------------------
// Movie Get Categories List

async function fetchAndDisplayCategoryMovies() {
  try {
    const response = await fetch(
      "https://api.sarkhanrahimli.dev/api/filmalisa/movies",
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API Hatası: ${response.status}`);
    }

    const { data: movies } = await response.json();

    const currentFilm = movies.find((movie) => movie.id == filmId);
    if (!currentFilm) {
      console.error("Belirtilen ID'ye sahip film bulunamadı.");
      return;
    }

    const sameCategoryMovies = movies.filter(
      (movie) =>
        movie.category?.name === currentFilm.category?.name &&
        movie.id != currentFilm.id
    );

    if (sameCategoryMovies.length === 0) {
      console.error("Bu kategoriye ait başka film bulunamadı.");
      return;
    }

    const moviesSlidesContainer = document.querySelector(".movies-slides");
    moviesSlidesContainer.innerHTML = "";

    let isDragging = false;

    sameCategoryMovies.forEach((movie) => {
      const movieSlide = document.createElement("div");
      movieSlide.classList.add("movie");

      movieSlide.innerHTML = `
        <img src="${movie.cover_url}" alt="${movie.title}" />
        <div class="movie-overlay"></div>
        <div class="movie-desc">
          <span class="smilar-category">${
            movie.category?.name || "Bilinmiyor"
          }</span>
          <div class="stars">
            ${generateStars(movie.imdb)}
          </div>
          <p class="smilar-movie-name">${movie.title}</p>
        </div>
      `;

      movieSlide.addEventListener("mouseenter", () => {
        movieSlide.style.cursor = "pointer";
      });

      movieSlide.addEventListener("mouseleave", () => {
        movieSlide.style.cursor = "default";
      });

      movieSlide.addEventListener("mousedown", () => {
        isDragging = false;
      });

      movieSlide.addEventListener("mousemove", () => {
        isDragging = true;
      });

      movieSlide.addEventListener("mouseup", () => {
        if (!isDragging) {
          window.location.href = `../../Pages/Client/details-1.html?${movie.id}`;
        }
      });

      moviesSlidesContainer.appendChild(movieSlide);
    });
  } catch (error) {
    console.error("Hata:", error.message);
  }
}

function generateStars(imdbScore) {
  const fullStars = Math.floor(imdbScore / 2);
  const halfStar = imdbScore % 2 >= 1 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  const stars = [
    ...Array(fullStars).fill(
      `<svg width="18" height="18" viewBox="0 0 24 24" fill="yellow" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L14.4 8.4H21L15.6 12.3L17.8 18.7L12 14.7L6.2 18.7L8.4 12.3L3 8.4H9.6L12 2Z" />
      </svg>`
    ),
    ...(halfStar
      ? [
          `<svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="halfStarGradient">
                <stop offset="50%" stop-color="yellow" />
                <stop offset="50%" stop-color="gray" />
              </linearGradient>
            </defs>
            <path d="M12 2L14.4 8.4H21L15.6 12.3L17.8 18.7L12 14.7L6.2 18.7L8.4 12.3L3 8.4H9.6L12 2Z" fill="url(#halfStarGradient)" />
          </svg>`,
        ]
      : []),
    ...Array(emptyStars).fill(
      `<svg width="18" height="18" viewBox="0 0 24 24" fill="gray" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L14.4 8.4H21L15.6 12.3L17.8 18.7L12 14.7L6.2 18.7L8.4 12.3L3 8.4H9.6L12 2Z" />
      </svg>`
    ),
  ];

  return stars.join("");
}

fetchAndDisplayCategoryMovies();

// ----------------------------------------------------------------------------------------------------------------
// Remove Comment Api

document.addEventListener("DOMContentLoaded", () => {
  const yesButton = document.getElementById("yes-btn");

  if (!yesButton) {
    console.error("#yes-btn element not found in DOM.");
    return;
  }

  yesButton.addEventListener("click", async () => {
    const removeModal = document.getElementById("modal-remove");
    if (!removeModal) {
      console.error("#modal-remove element not found in DOM.");
      return;
    }

    const commentId = removeModal.getAttribute("data-actor-id");
    if (!commentId) {
      console.error("Comment ID not found in modal.");
      return;
    }

    const urlSearch = window.location.search.substring(1);
    const movieId = urlSearch.match(/^\d+$/) ? urlSearch : null;

    if (!movieId) {
      console.error("Invalid URL! Movie ID not found.");
      return;
    }

    const apiUrl = `https://api.sarkhanrahimli.dev/api/filmalisa/movies/${movieId}/comment/${commentId}`;

    try {
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("user_token")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        document.getElementById("pop-p").textContent =
          "Your comment has been successfully deleted.";
        showPopup();
        removeModal.style.display = "none";
        removeModal.removeAttribute("data-actor-id");
        fetchComments();
      } else if (response.status === 400) {
        document.getElementById("pop-p").textContent =
          "You can't delete someone else's message.";
        showPopup();
        removeModal.style.display = "none";
        removeModal.removeAttribute("data-actor-id");
      } else {
        document.getElementById("pop-p").textContent =
          "An error occurred while deleting the comment.";
        showPopup();
      }
    } catch (error) {
      console.error("Error deleting the comment:", error);
      document.getElementById("pop-p").textContent =
        "An error occurred. Please try again.";
      showPopup();
      removeModal.style.display = "none";
    }
  });
});

// ----------------------------------------------------------------------------------------------------------------
// Profile Get Api

async function fetchUserProfile() {
  try {
    const token = sessionStorage.getItem("user_token");
    if (!token) {
      throw new Error("Yetkilendirme hatası: Token bulunamadı");
    }

    const response = await fetch(
      "https://api.sarkhanrahimli.dev/api/filmalisa/profile",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Kullanıcı bilgileri alınamadı");
    }

    const responseData = await response.json();
    const userData = responseData.data;

    const defaultImageUrl = "../../Assets/images/default-profile.jpg";
    const userPhotoUrl = userData?.img_url || defaultImageUrl;
    const userId = userData.id;

    const mainUserPhoto = document.querySelector(".user-profile-photo img");
    if (mainUserPhoto) {
      mainUserPhoto.src = userPhotoUrl;
    }

    const commentUserPhoto = document.querySelector(".user-comment-photo img");
    if (commentUserPhoto) {
      commentUserPhoto.src = userPhotoUrl;
    }

    localStorage.setItem("userId", userId);
  } catch (error) {
    console.error("Hata:", error);
  }
}

window.addEventListener("DOMContentLoaded", fetchUserProfile);

// ----------------------------------------------------------------------------------------------------------------
// Modals

function openRemoveModal(id) {
  const removeModal = document.getElementById("modal-remove");
  if (!removeModal) {
    console.error("#modal-remove element not found in DOM.");
    return;
  }

  removeModal.setAttribute("data-actor-id", id);
  removeModal.style.display = "flex";
}

function closeRemoveModal(commentId) {
  const removeModal = document.getElementById("modal-remove");
  if (!removeModal) return;
  removeModal.style.display = "none";
  removeModal.removeAttribute("data-actor-id");
}

// ----------------------------------------------------------------------------------------------------------------
// PopUp

function showPopup() {
  const popup = document.getElementById("popup");
  popup.classList.add("show");
  popup.style.display = "flex";
}

function closePopup() {
  const popup = document.getElementById("popup");
  popup.classList.remove("show");
  setTimeout(() => {
    popup.style.display = "none";
  }, 500);
}
