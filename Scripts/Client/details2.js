document.addEventListener("DOMContentLoaded", () => {
  const token = sessionStorage.getItem("user_token");

  if (!token) {
    window.location.href = "../../Pages/Client/login.html";
  }
});

window.addEventListener("beforeunload", () => {
  sessionStorage.removeItem("movie.name");
});

const hashValue = window.location.hash.substring(1);

let player;
let isPlaying = false;
let isDragging = false;
let isFullscreen = false;
let isMuted = false;
let mouseTimeout;
let videoUrl = `https://www.youtube.com/embed/${hashValue}`;

const progressBar = document.getElementById("progress-bar");
const progressFill = document.getElementById("progress-fill");
const progressThumb = document.getElementById("progress-thumb");
const playPauseButton = document.getElementById("play-pause");
const volumeButton = document.getElementById("volume");
const fullscreenToggle = document.getElementById("fullscreen-toggle");
const videoContainer = document.getElementById("video-container");
const replayButton = document.getElementById("replay");
const forwardButton = document.getElementById("forward");
const speedButton = document.getElementById("speed-button");
const speedMenu = document.getElementById("speed-menu");
const iframe = document.getElementById("youtube-player");

function setVideoUrl(url) {
  const baseUrl = url.split("?")[0];
  iframe.src = `${baseUrl}?enablejsapi=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0&disablekb=1&fs=0`;
}

setVideoUrl(videoUrl);

function onYouTubeIframeAPIReady() {
  player = new YT.Player("youtube-player", {
    playerVars: { rel: 0 },
    events: {
      onReady: initializePlayer,
      onStateChange: handleStateChange,
    },
  });
}

function initializePlayer() {
  updateProgress();
  document.addEventListener("mousemove", handleMouseMove);

  speedButton.addEventListener("click", () => {
    speedMenu.style.display =
      speedMenu.style.display === "flex" ? "none" : "flex";
  });

  replayButton.addEventListener("click", () => {
    const currentTime = player.getCurrentTime();
    player.seekTo(Math.max(currentTime - 10, 0));
  });

  forwardButton.addEventListener("click", () => {
    const currentTime = player.getCurrentTime();
    player.seekTo(Math.min(currentTime + 10, player.getDuration()));
  });
}

function handleMouseMove() {
  clearTimeout(mouseTimeout);
  videoContainer.classList.add("show-controls");
  document.body.classList.remove("hide-cursor");
  mouseTimeout = setTimeout(() => {
    if (isPlaying) {
      videoContainer.classList.remove("show-controls");
      document.body.classList.add("hide-cursor");
    }
  }, 1000);
}

function handleStateChange(event) {
  if (event.data === YT.PlayerState.PAUSED) {
    videoContainer.classList.add("show-controls");
    document.body.classList.remove("hide-cursor");
  } else if (event.data === YT.PlayerState.PLAYING) {
    videoContainer.classList.remove("show-controls");
  }
}

playPauseButton.addEventListener("click", () => {
  if (isPlaying) {
    player.pauseVideo();
    isPlaying = false;
    playPauseButton.className = "fas fa-play icon";
  } else {
    player.playVideo();
    isPlaying = true;
    playPauseButton.className = "fas fa-pause icon";
  }
});

volumeButton.addEventListener("click", () => {
  if (isMuted) {
    player.unMute();
    isMuted = false;
    volumeButton.className = "fas fa-volume-up icon";
  } else {
    player.mute();
    isMuted = true;
    volumeButton.className = "fas fa-volume-mute icon";
  }
});

progressBar.addEventListener("click", (e) => {
  const rect = progressBar.getBoundingClientRect();
  const clickedTime =
    ((e.clientX - rect.left) / rect.width) * player.getDuration();
  player.seekTo(clickedTime);
});

progressThumb.addEventListener("mousedown", () => {
  isDragging = true;
});

document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    const rect = progressBar.getBoundingClientRect();
    const offsetX = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const duration = player.getDuration();
    const newTime = (offsetX / rect.width) * duration;
    progressFill.style.width = `${(newTime / duration) * 100}%`;
    progressThumb.style.left = `${(newTime / duration) * 100}%`;
  }
});

document.addEventListener("mouseup", () => {
  if (isDragging) {
    const rect = progressBar.getBoundingClientRect();
    const offsetX = Math.min(
      Math.max(event.clientX - rect.left, 0),
      rect.width
    );
    const duration = player.getDuration();
    const newTime = (offsetX / rect.width) * duration;
    player.seekTo(newTime);
    isDragging = false;
  }
});

fullscreenToggle.addEventListener("click", () => {
  if (!isFullscreen) {
    if (videoContainer.requestFullscreen) {
      videoContainer.requestFullscreen();
    } else if (videoContainer.mozRequestFullScreen) {
      videoContainer.mozRequestFullScreen();
    } else if (videoContainer.webkitRequestFullscreen) {
      videoContainer.webkitRequestFullscreen();
    } else if (videoContainer.msRequestFullscreen) {
      videoContainer.msRequestFullscreen();
    }
    fullscreenToggle.className = "fas fa-compress icon";
    isFullscreen = true;
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    fullscreenToggle.className = "fas fa-expand icon";
    isFullscreen = false;
  }
});

function updateProgress() {
  setInterval(() => {
    if (!isDragging && player && player.getDuration) {
      const currentTime = player.getCurrentTime();
      const duration = player.getDuration();
      progressFill.style.width = `${(currentTime / duration) * 100}%`;
      progressThumb.style.left = `${(currentTime / duration) * 100}%`;
    }
  }, 500);
}

function setPlaybackRate(rate) {
  player.setPlaybackRate(rate);
  speedMenu.style.display = "none";
}

document.getElementById("back-button").addEventListener("click", function () {
  window.history.back();
});

function handleMouseMove() {
  clearTimeout(mouseTimeout);
  videoContainer.classList.add("show-controls");
  document.body.classList.remove("hide-cursor");
  document.getElementById("back-button").style.opacity = "1";

  mouseTimeout = setTimeout(() => {
    if (isPlaying) {
      videoContainer.classList.remove("show-controls");
      document.body.classList.add("hide-cursor");
      document.getElementById("back-button").style.opacity = "0";
    }
  }, 1000);
}

const movieName = sessionStorage.getItem("movie.name");
if (movieName) {
  const titleBar = document.querySelector(".title-bar");
  titleBar.textContent = movieName;
}
