const actorSlider = document.querySelector(".actors-slider");
const movieSlider = document.querySelector(".movies-slider");

function sliderFunction(slider) {
  const isScrollable = slider.scrollWidth > slider.offsetWidth;

  if (!isScrollable) {
    slider.classList.remove("active");
    return;
  }

  let isDown = false;
  let startX;
  let scrollLeft;

  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
    slider.classList.add("grabbing");
  });

  slider.addEventListener("mouseenter", () => {
    slider.classList.add("active");
  });

  slider.addEventListener("mouseleave", () => {
    isDown = false;
    slider.classList.remove("grabbing");
    slider.classList.remove("active");
  });

  slider.addEventListener("mouseup", () => {
    isDown = false;
    slider.classList.remove("grabbing");
  });

  slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;

    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = x - startX;
    slider.scrollLeft = scrollLeft - walk;
  });
}

sliderFunction(actorSlider);
sliderFunction(movieSlider);

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
    document.querySelector(".status p").textContent = filmData.adult
      ? "Adult Content"
      : "General Audience";
    document.querySelector(".run-time p").textContent = `${
      filmData.run_time_min || 0
    } dk`;
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
          window.location.href = filmData.watch_url;
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
    alert("Film detayları alınırken bir hata oluştu.");
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
