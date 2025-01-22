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

// ? StartInterval and display none
events(
  filmImageDom,
  overlayFilmInfoDOM,
  svgFilmInfoDOM,
  "mouseleave",
  startInterval,
  "none"
);

// ? StopInterval and display block
events(
  filmImageDom,
  overlayFilmInfoDOM,
  svgFilmInfoDOM,
  "mouseenter",
  stopInterval,
  "block"
);

startInterval();

svgFilmInfoDOM.addEventListener("click", function () {
  const filmOverlay = document.querySelector(".film-overlay"),
    filmModal = document.querySelector(".film-modal");

  stopInterval();
  filmModal.style.display = "block";
  filmOverlay.style.display = "block";
  filmModal.classList.remove("close-animation");

  filmOverlay.addEventListener("click", function () {
    filmModal.classList.add("close-animation");
    setTimeout(() => {
      filmModal.style.display = "none";
    }, 500);
    filmOverlay.style.display = "none";
  });
});

const textarea = document.querySelector(".auto-break"),
  alertComment = document.querySelector(".alert-comment");
textarea.addEventListener("input", function () {
  if (this.value.length > 2999) {
    this.style.color = "red";
    alertComment.style.display = "block";
  } else {
    this.style.color = "#fff";
    alertComment.style.display = "none";
    if (this.scrollHeight < 200) {
      this.style.height = "auto";
      this.style.height = this.scrollHeight + "px";
    } else {
    }
  }
});

// ? Comments loadmore
// const comments = document.querySelectorAll(".comment");
// const filmCommentDOM = document.querySelector(".film-comments");
