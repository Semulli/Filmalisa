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

// --------------------------------------------------------------------------------
// Modal
const apiURLCategories =
  "https://api.sarkhanrahimli.dev/api/filmalisa/admin/categories";
const apiURLMovie = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/movies";
const apiURLActors =
  "https://api.sarkhanrahimli.dev/api/filmalisa/admin/actors";
const apiURLMovieCreate =
  "https://api.sarkhanrahimli.dev/api/filmalisa/admin/movie";
// Token
const token = sessionStorage.getItem("access_token");
// Elementleri id'leri
const modal = document.querySelector("#modal");
const myForm = document.querySelector("#myForm");
const title = document.querySelector("#title");
const overview = document.querySelector("#overview");
const coverUrl = document.querySelector("#cover-url");
const fragman = document.querySelector("#fragman");
const watchUrl = document.querySelector("#watch-url");
const imdb = document.querySelector("#imdb");
const runtime = document.querySelector("#runtime");
const category = document.querySelector("#category");
const adult = document.querySelector("#adult");
const submitBtn = document.querySelector(".submit-btn");
const tableBody = document.querySelector(".table-div table tbody");
const paginationContainer = document.querySelector(".pagination-container");
const currentBtn = document.querySelector(".pagination-btn.active");
const dropdown = document.querySelector(".dropdown");
const dropdownToggle = dropdown.querySelector(".dropdown-togglee");
const dropdownItems = dropdown.querySelector("#dropdown-items");
const categoryDropdown = document.querySelector(".category-dropdown");
const categoryToggle = categoryDropdown.querySelector(".category-toggle");
const categoryItems = categoryDropdown.querySelector("#category-items");
const runtimeInput = document.getElementById("runtime");
const imdbInput = document.getElementById("imdb");
// ---------------------------------------------------------------------------------------------------------------------
// Movie Table

let currentPage = 1;
const rowsPerPage = 9;
let movies = [];

async function fetchMovies() {
  try {
    const response = await fetch(apiURLMovie, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    movies = Array.isArray(data.data) ? data.data : [];

    if (movies.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="8">No movies found.</td></tr>`;
      return;
    }

    displayTable(movies, tableBody, rowsPerPage, currentPage);
    setupPagination(movies, paginationContainer, rowsPerPage);
  } catch (error) {
    console.error("Veriler çekilirken hata oluştu:", error);
    tableBody.innerHTML = `<tr><td colspan="8">Error fetching movies: ${error.message}</td></tr>`;
  }
}

function displayTable(items, tableBody, rowsPerPage, page) {
  tableBody.innerHTML = "";
  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedItems = items.slice(start, end);

  paginatedItems.forEach((movie, index) => {
    const newRow = document.createElement("tr");

    const imdbValue = isNaN(parseFloat(movie.imdb)) ? "NaN" : movie.imdb;

    // category.name kullanımı
    const categoryValue = movie.category?.name || "Unknown Category";

    newRow.innerHTML = `
      <td>${start + index + 1}</td>
      <td>
        <img
          src="${movie.cover_url || "../../Assets/images/default.jpg"}"
          style="width: 29px; height: 39px"
          alt="Movie Poster"
          onerror="this.onerror=null; this.src='../../Assets/images/default.jpg';"
        />
      </td>
      <td>${movie.title || "Unknown Title"}</td>
      <td>${movie.overview || "No overview available"}</td>
      <td>${categoryValue}</td>
      <td>${imdbValue}</td>
      <td>
        <img
          src="../../Assets/icons/categories/edit-icon.png"
          alt="edit-icon"
          style="width: 18px; height: 18px"
          class="img-icon"
          onclick="editMovie(${movie.id})"
        />
      </td>
      <td>
        <img
          src="../../Assets/icons/categories/remove-icon.png"
          alt="remove-icon"
          class="img-icon img-icon1"
          style="width: 18px; height: 18px"
          onclick="removeMovie(${movie.id})"
        />
      </td>
    `;

    tableBody.appendChild(newRow);
  });
}

function setupPagination(items, container, rowsPerPage) {
  container.innerHTML = "";
  const pageCount = Math.ceil(items.length / rowsPerPage);

  if (pageCount === 0) {
    container.innerHTML = `<p>No pages to display.</p>`;
    return;
  }

  for (let i = 1; i <= pageCount; i++) {
    const btn = createPaginationButton(i, items);
    container.appendChild(btn);
  }
}

function createPaginationButton(page, items) {
  const button = document.createElement("button");
  button.innerText = page;
  button.classList.add("pagination-btn");
  if (currentPage === page) button.classList.add("active");

  button.addEventListener("click", () => {
    currentPage = page;
    displayTable(items, tableBody, rowsPerPage, currentPage);

    if (currentBtn) currentBtn.classList.remove("active");
    button.classList.add("active");
  });

  return button;
}

fetchMovies();

// ------------------------------------------------------------------------------------------------
// Actors

document.addEventListener("DOMContentLoaded", () => {
  async function populateActors() {
    try {
      const response = await fetch(apiURLActors, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`API isteği başarısız: ${response.status}`);
      }

      const data = await response.json();

      const dropdownItemsDiv = document.getElementById("dropdown-items");

      if (!dropdownItemsDiv) {
        return;
      }

      const actors = data.data;

      if (!actors || !Array.isArray(actors)) {
        throw new Error("Aktör verisi bir dizi değil.");
      }

      dropdownItemsDiv.innerHTML = "";
      actors.forEach((actor) => {
        const div = document.createElement("div");
        div.className = "dropdown-item";
        div.textContent = `${actor.name} ${actor.surname}`;
        div.setAttribute("data-value", `${actor.name} ${actor.surname}`);
        div.setAttribute("data-id", actor.id);

        dropdownItemsDiv.appendChild(div);
      });
    } catch (error) {
      console.error("Aktörler yüklenirken hata oluştu:", error);
    }
  }

  populateActors();
});

// ------------------------------------------------------------------------------------------------
// Actors Section

dropdownToggle.addEventListener("click", (event) => {
  const isVisible = dropdownItems.classList.contains("visible");
  dropdownItems.classList.toggle("visible", !isVisible);
  event.stopPropagation();
});

document.addEventListener("click", () => {
  dropdownItems.classList.remove("visible");
});

dropdown.addEventListener("click", (event) => {
  event.stopPropagation();
});

dropdownItems.addEventListener("click", (event) => {
  const item = event.target;
  if (item.classList.contains("dropdown-item")) {
    const value = item.dataset.value;

    if (item.classList.contains("selected")) {
      item.classList.remove("selected");
      removeSelectedItem(value);
    } else {
      item.classList.add("selected");
      addSelectedItem(value);
    }
    updateDropdownToggleText();
  }
});

function updateDropdownToggleText() {
  const selectedItems = Array.from(
    dropdownItems.querySelectorAll(".dropdown-item.selected")
  ).map((item) => item.dataset.value);

  if (selectedItems.length === 0) {
    dropdownToggle.textContent = "actors";
  } else {
    dropdownToggle.textContent = selectedItems.join(", ");
  }
}

function addSelectedItem(value) {
  const correspondingDropdownItem = dropdownItems.querySelector(
    `.dropdown-item[data-value="${value}"]`
  );
  if (correspondingDropdownItem) {
    correspondingDropdownItem.classList.add("selected");
  }
}

function removeSelectedItem(value) {
  const correspondingDropdownItem = dropdownItems.querySelector(
    `.dropdown-item[data-value="${value}"]`
  );
  if (correspondingDropdownItem) {
    correspondingDropdownItem.classList.remove("selected");
  }
}

// ---------------------------------------------------------------------------------------------------------------------
// Category

document.addEventListener("DOMContentLoaded", () => {
  async function populateCategories() {
    try {
      const response = await fetch(apiURLCategories, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`API isteği başarısız: ${response.status}`);
      }

      const data = await response.json();

      const categoryItemsDiv = document.getElementById("category-items");
      const categorySpan = document.getElementById("category-span");

      if (!categoryItemsDiv || !categorySpan) {
        console.error("Gerekli DOM elemanları bulunamadı.");
        return;
      }

      const categories = data.data;

      if (!categories || !Array.isArray(categories)) {
        throw new Error("Kategoriler bir dizi değil.");
      }

      categoryItemsDiv.innerHTML = "";
      categories.forEach((category) => {
        if (!category.id || typeof category.id !== "number") {
          console.error("Kategori ID'si eksik veya geçersiz:", category);
          return;
        }

        const div = document.createElement("div");
        div.className = "category-item";
        div.textContent = category.name || "Unknown Category";
        div.setAttribute("data-value", category.name || "Unknown");
        div.setAttribute("data-id", category.id);

        div.addEventListener("click", () => {
          categorySpan.textContent = category.name || "Unknown Category";
          document
            .querySelectorAll(".category-item.selected")
            .forEach((selected) => selected.classList.remove("selected"));
          div.classList.add("selected");
        });

        categoryItemsDiv.appendChild(div);
      });
    } catch (error) {
      console.error("Kategoriler yüklenirken hata oluştu:", error);
    }
  }

  populateCategories();
});

// ---------------------------------------------------------------------------------
// Category Section

categoryToggle.addEventListener("click", (event) => {
  const isVisible = categoryItems.classList.contains("visible");
  categoryItems.classList.toggle("visible", !isVisible);
  dropdownItems.classList.remove("visible");
  event.stopPropagation();
});

document.addEventListener("click", () => {
  categoryItems.classList.remove("visible");
});

categoryItems.addEventListener("click", (event) => {
  const item = event.target;
  if (item.classList.contains("category-item")) {
    const value = item.dataset.value;
    categoryToggle.textContent = value;
    categoryItems.classList.remove("visible");
  }
});

// ------------------------------------------------------------------------------------------------
// Buttons

function setupPagination(items, container, rowsPerPage) {
  container.innerHTML = "";
  const pageCount = Math.ceil(items.length / rowsPerPage);

  const buttons = [];
  for (let i = 0; i < 3; i++) {
    const button = document.createElement("button");
    button.classList.add("pagination-btn");
    buttons.push(button);
    container.appendChild(button);
  }

  const updateButtons = () => {
    let startPage;

    if (currentPage === 1 || currentPage === 2) {
      startPage = 1;
    } else if (currentPage === pageCount) {
      startPage = Math.max(1, pageCount - 2);
    } else {
      startPage = currentPage - 1;
    }

    buttons.forEach((button, index) => {
      const pageNumber = startPage + index;
      button.innerText = pageNumber;
      button.classList.toggle("active", pageNumber === currentPage);

      if (pageNumber > pageCount) {
        button.disabled = true;
        button.classList.add("disabled");
      } else {
        button.disabled = false;
        button.classList.remove("disabled");
      }

      button.onclick = () => {
        if (pageNumber <= pageCount) {
          currentPage = pageNumber;
          displayTable(items, tableBody, rowsPerPage, currentPage);
          updateButtons();
        }
      };
    });
  };

  updateButtons();
}

// ----------------------------------------------------------------
// remove modal

function openRemoveModal() {
  const modal = document.getElementById("modal-remove");
  modal.style.display = "flex";
}

function closeRemoveModal() {
  const modal = document.getElementById("modal-remove");
  modal.style.display = "none";
}

let movieToRemoveId = null;

function removeMovie(movieId) {
  movieToRemoveId = movieId;
  openRemoveModal();
}

function openRemoveModal() {
  const modal = document.getElementById("modal-remove");
  modal.style.display = "flex";
}

function closeRemoveModal() {
  const modal = document.getElementById("modal-remove");
  modal.style.display = "none";
  movieToRemoveId = null;
}

document.getElementById("yes-btn").addEventListener("click", async function () {
  if (!movieToRemoveId) {
    console.error("Silinecek film ID'si bulunamadı!");
    closeRemoveModal();
    return;
  }

  try {
    const response = await fetch(
      `https://api.sarkhanrahimli.dev/api/filmalisa/admin/movie/${movieToRemoveId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Error Response:", errorResponse);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const rowToRemove = document.querySelector(
      `tr[data-id="${movieToRemoveId}"]`
    );
    if (rowToRemove) {
      rowToRemove.remove();
    } else {
      console.warn(
        `Film ID ${movieToRemoveId} için DOM'da bir satır bulunamadı.`
      );
    }
    document.getElementById("pop-p").textContent =
      "Movie deleted successfully!";
    showPopup();
    closeRemoveModal();
    fetchMovies();
  } catch (error) {
    console.error("Film silinirken hata oluştu:", error);

    closeRemoveModal();
  }
});

// ---------------------------------------------------------------------------------------------------------------------
// Create Modal

document.getElementById("create-btn").addEventListener("click", () => {
  openModalCreate();
});

function openModalCreate() {
  document.getElementById("modal").style.display = "flex";
  document.getElementById("submit-btn").textContent = "Submit";
  resetForm();
  document.addEventListener("click", closeModalOnOutsideClick);
}

function closeModalOnOutsideClick(event) {
  const modal = document.getElementById("modal");
  if (event.target === modal) {
    closeModal();
  }
}

function resetForm() {
  const inputs = document.querySelectorAll(
    "#myForm input, #myForm textarea, #myForm select"
  );

  inputs.forEach((input) => {
    if (input.type === "checkbox") {
      input.checked = false;
    } else {
      input.value = "";
      input.placeholder =
        input.getAttribute("placeholder-original") || input.placeholder;
    }
    input.classList.remove("error");
    input.classList.remove("error2");
  });

  document.querySelectorAll(".category-item.selected").forEach((item) => {
    item.classList.remove("selected");
  });

  document.querySelectorAll(".dropdown-item.selected").forEach((item) => {
    item.classList.remove("selected");
  });

  const dropdownToggle = document.querySelector(".dropdown-togglee");
  const categoryToggle = document.querySelector(".category-toggle");

  if (dropdownToggle) dropdownToggle.textContent = "actors";
  if (categoryToggle) categoryToggle.textContent = "category";

  dropdownToggle?.classList.remove("error");
  categoryToggle?.classList.remove("error");
}

function closeModal() {
  const modal = document.getElementById("modal");
  if (modal) {
    modal.style.display = "none";
  }
  resetForm();
}

async function createMovie() {
  let isValid = true;

  const inputs = document.querySelectorAll(
    "#myForm input, #myForm textarea, #myForm select"
  );

  inputs.forEach((input) => {
    if (input.type !== "checkbox" && input.value.trim() === "") {
      input.classList.add("error");
      isValid = false;
    } else {
      input.classList.remove("error");
    }

    input.addEventListener("input", () => {
      if (input.value.trim() !== "") {
        input.classList.remove("error");
      }
    });
  });

  if (
    isNaN(runtimeInput.value) ||
    runtimeInput.value.trim() === "" ||
    runtimeInput.value.length > 4 ||
    parseInt(runtimeInput.value) <= 0
  ) {
    runtimeInput.classList.add("error2");
    isValid = false;
  } else {
    runtimeInput.classList.remove("error2");
  }

  runtimeInput.addEventListener("input", () => {
    if (
      !isNaN(runtimeInput.value) &&
      runtimeInput.value.trim() !== "" &&
      runtimeInput.value.length <= 4 &&
      parseInt(runtimeInput.value) > 0
    ) {
      runtimeInput.classList.remove("error2");
    }
  });

  if (!/^\d{1,2}(\.\d{1})?$/.test(imdbInput.value)) {
    imdbInput.classList.add("error2");
    isValid = false;
  } else {
    imdbInput.classList.remove("error2");
  }

  imdbInput.addEventListener("input", () => {
    if (/^\d{1,2}(\.\d{1})?$/.test(imdbInput.value)) {
      imdbInput.classList.remove("error2");
    }
  });

  const selectedActors = Array.from(
    document.querySelectorAll("#dropdown-items .dropdown-item.selected")
  ).map((actor) => parseInt(actor.getAttribute("data-id")));

  const selectedCategory = parseInt(
    document
      .querySelector("#category-items .category-item.selected")
      ?.getAttribute("data-id")
  );

  const dropdownToggle = document.querySelector(".dropdown-togglee");
  const categoryToggle = document.querySelector(".category-toggle");

  if (!selectedCategory) {
    categoryToggle?.classList.add("error");
    isValid = false;
  } else {
    categoryToggle?.classList.remove("error");
  }

  if (selectedActors.length === 0) {
    dropdownToggle?.classList.add("error");
    isValid = false;
  } else {
    dropdownToggle?.classList.remove("error");
  }

  document
    .querySelectorAll("#category-items .category-item")
    .forEach((item) => {
      item.addEventListener("click", () => {
        categoryToggle?.classList.remove("error");
      });
    });

  document
    .querySelectorAll("#dropdown-items .dropdown-item")
    .forEach((item) => {
      item.addEventListener("click", () => {
        dropdownToggle?.classList.remove("error");
      });
    });

  if (!isValid) {
    return;
  }

  const movieData = {
    title: document.getElementById("title").value.trim(),
    cover_url: document.getElementById("cover-url").value.trim(),
    fragman: document.getElementById("fragman").value.trim(),
    watch_url: document.getElementById("watch-url").value.trim(),
    adult: document.getElementById("adult").checked,
    run_time_min: parseInt(runtimeInput.value, 10),
    imdb: parseFloat(imdbInput.value).toFixed(1),
    category: selectedCategory,
    actors: selectedActors,
    overview: document.getElementById("overview").value.trim(),
  };

  if (
    !movieData.title ||
    !movieData.cover_url ||
    !movieData.fragman ||
    !movieData.category ||
    !movieData.actors.length
  ) {
    console.error("Eksik veya hatalı alanlar mevcut:", movieData);
    return;
  }

  try {
    const response = await fetch(apiURLMovieCreate, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(movieData),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Error Response:", errorResponse);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();

    document.getElementById("pop-p").textContent =
      "Movie created successfully!";
    showPopup();

    fetchMovies();
    closeModal();
  } catch (error) {
    console.error("An error occurred while creating the movie:", error);
  }
}

// ----------------------------------------------------------------------------------------------------------------
// Create Edit buttons

document
  .getElementById("submit-btn")
  .addEventListener("click", async (event) => {
    event.preventDefault();
    const submitBtn = document.getElementById("submit-btn");

    if (submitBtn.textContent === "Submit") {
      await createMovie();
    } else if (submitBtn.textContent === "Edit") {
      await updateMovie();
    }
  });
// ---------------------------------------------------------------------------------------------------------------

let movieToEditId = null;

function editMovie(movieId) {
  if (!movieId) {
    console.error("Geçersiz film ID'si:", movieId);
    return;
  }

  movieToEditId = movieId;
  openEditModal();
  fetchMovieDetails(movieId);
}

function openEditModal() {
  const modal = document.getElementById("modal");
  const submitBtn = document.getElementById("submit-btn");

  if (modal) {
    modal.style.display = "flex";
  }

  if (submitBtn) {
    submitBtn.textContent = "Edit";
  }

  document.addEventListener("click", closeModalOnOutsideClick);
}

function closeModal() {
  const modal = document.getElementById("modal");
  const submitBtn = document.getElementById("submit-btn");

  if (modal) {
    modal.style.display = "none";
  }

  movieToEditId = null;
  resetForm();

  if (submitBtn) {
    submitBtn.textContent = "Submit";
  }
}

async function fetchMovieDetails(movieId) {
  try {
    const apiUrl = `${apiURLMovie}/${movieId}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("API Hata Yanıtı:", errorResponse);

      if (response.status === 404) {
        console.error("Seçilen ID'ye sahip film bulunamadı. ID:", movieId);

        closeEditModal();
      } else {
      }

      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const { data: movie } = await response.json();

    if (!movie) {
      console.error("Film detayları API'den boş geldi!");

      return;
    }

    fillFormWithMovieDetails(movie);
  } catch (error) {
    console.error("Film detayları yüklenirken hata oluştu:", error);
  }
}

function fillFormWithMovieDetails(movie) {
  document.getElementById("title").value = movie.title || "";
  document.getElementById("overview").value = movie.overview || "";
  document.getElementById("cover-url").value = movie.cover_url || "";
  document.getElementById("fragman").value = movie.fragman || "";
  document.getElementById("watch-url").value = movie.watch_url || "";
  document.getElementById("imdb").value = movie.imdb || "";
  document.getElementById("runtime").value = movie.run_time_min || "";
  document.getElementById("adult").checked = movie.adult || false;

  const categoryToggle = document.querySelector(".category-toggle");
  if (categoryToggle) {
    categoryToggle.textContent = movie.category
      ? movie.category.name
      : "Kategori seçilmedi";

    const categoryItems = document.querySelectorAll(
      "#category-items .category-item"
    );
    categoryItems.forEach((item) => {
      const categoryId = parseInt(item.getAttribute("data-id"));
      if (movie.category && movie.category.id === categoryId) {
        item.classList.add("selected");
      } else {
        item.classList.remove("selected");
      }
    });
  } else {
    console.error(".category-toggle elementi bulunamadı!");
  }

  const dropdownToggle = document.querySelector(".dropdown-togglee");
  if (dropdownToggle) {
    const selectedActors = movie.actors
      ? movie.actors.map((actor) => `${actor.name} ${actor.surname}`).join(", ")
      : "Aktörler seçilmedi";
    dropdownToggle.textContent = selectedActors;

    const dropdownItems = document.querySelectorAll(
      "#dropdown-items .dropdown-item"
    );
    dropdownItems.forEach((item) => {
      const actorId = parseInt(item.getAttribute("data-id"));
      if (
        Array.isArray(movie.actors) &&
        movie.actors.some((actor) => actor.id === actorId)
      ) {
        item.classList.add("selected");
      } else {
        item.classList.remove("selected");
      }
    });
  } else {
    console.error(".dropdown-togglee elementi bulunamadı!");
  }
}

async function updateMovie() {
  const apiURLMovieEdit = `https://api.sarkhanrahimli.dev/api/filmalisa/admin/movie/${movieToEditId}`;

  let isValid = true;

  const inputs = document.querySelectorAll(
    "#myForm input, #myForm textarea, #myForm select"
  );

  inputs.forEach((input) => {
    if (input.type !== "checkbox" && input.value.trim() === "") {
      input.classList.add("error");
      isValid = false;
    } else {
      input.classList.remove("error");
    }

    input.addEventListener("input", () => {
      if (input.value.trim() !== "") {
        input.classList.remove("error");
      }
    });
  });

  if (
    isNaN(runtimeInput.value) ||
    runtimeInput.value.trim() === "" ||
    runtimeInput.value.length > 4 ||
    parseInt(runtimeInput.value) <= 0
  ) {
    runtimeInput.classList.add("error2");
    isValid = false;
  } else {
    runtimeInput.classList.remove("error2");
  }

  runtimeInput.addEventListener("input", () => {
    if (
      !isNaN(runtimeInput.value) &&
      runtimeInput.value.trim() !== "" &&
      runtimeInput.value.length <= 4 &&
      parseInt(runtimeInput.value) > 0
    ) {
      runtimeInput.classList.remove("error2");
    }
  });

  if (!/^\d{1,2}(\.\d{1})?$/.test(imdbInput.value)) {
    imdbInput.classList.add("error2");
    isValid = false;
  } else {
    imdbInput.classList.remove("error2");
  }

  imdbInput.addEventListener("input", () => {
    if (/^\d{1,2}(\.\d{1})?$/.test(imdbInput.value)) {
      imdbInput.classList.remove("error2");
    }
  });

  const selectedActors = Array.from(
    document.querySelectorAll("#dropdown-items .dropdown-item.selected")
  ).map((actor) => parseInt(actor.getAttribute("data-id")));

  const selectedCategory = parseInt(
    document
      .querySelector("#category-items .category-item.selected")
      ?.getAttribute("data-id")
  );

  const dropdownToggle = document.querySelector(".dropdown-togglee");
  const categoryToggle = document.querySelector(".category-toggle");

  if (!selectedCategory) {
    categoryToggle?.classList.add("error");
    isValid = false;
  } else {
    categoryToggle?.classList.remove("error");
  }

  if (selectedActors.length === 0) {
    dropdownToggle?.classList.add("error");
    isValid = false;
  } else {
    dropdownToggle?.classList.remove("error");
  }

  document
    .querySelectorAll("#category-items .category-item")
    .forEach((item) => {
      item.addEventListener("click", () => {
        categoryToggle?.classList.remove("error");
      });
    });

  document
    .querySelectorAll("#dropdown-items .dropdown-item")
    .forEach((item) => {
      item.addEventListener("click", () => {
        dropdownToggle?.classList.remove("error");
      });
    });

  if (!isValid) {
    return;
  }

  const movieData = {
    title: document.getElementById("title").value.trim(),
    cover_url: document.getElementById("cover-url").value.trim(),
    fragman: document.getElementById("fragman").value.trim(),
    watch_url: document.getElementById("watch-url").value.trim(),
    adult: document.getElementById("adult").checked,
    run_time_min: parseInt(runtimeInput.value, 10),
    imdb: parseFloat(imdbInput.value).toFixed(1),
    category: selectedCategory,
    actors: selectedActors,
    overview: document.getElementById("overview").value.trim(),
  };

  if (
    !movieData.title ||
    !movieData.cover_url ||
    !movieData.fragman ||
    !movieData.category ||
    !movieData.actors.length
  ) {
    console.error("Eksik veya hatalı alanlar mevcut:", movieData);
    return;
  }

  try {
    const response = await fetch(apiURLMovieEdit, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(movieData),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("API Hata Yanıtı:", errorResponse);
      return;
    }
    document.getElementById("pop-p").textContent =
      "Movie updated successfully!";
    showPopup();
    fetchMovies();
    closeModal();
  } catch (error) {
    console.error("Güncelleme sırasında bir hata oluştu:", error);
  }
}

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
