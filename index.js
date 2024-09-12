// require("dotenv").config();

// alternativ:
// import dotenv from 'dotenv';
// dotenv.config();

(function () {
  function Todo() {
    const buttonAdd = document.querySelector(".input-button");
    const list = document.getElementById("added-list");
    const favoritesList = document.getElementById("fav_albums");

    const themeColorSelect = document.getElementById("theme_color");
    themeColorSelect.addEventListener("change", changeTheme);

    const form = document.getElementById("form");
    const button = document.querySelectorAll("button");

    const option = document.querySelectorAll("option");
    console.log(option);

    const themes = [
      "theme0",
      "theme1",
      "theme2",
      "theme3",
      "theme4",
      "theme5",
      "theme6",
      "theme7",
      "theme8",
      "theme9",
      "theme10",
      "theme11",
      "theme12",
    ];

    // Navbar behavior:

    let prevScrollPos = window.scrollY;
    const navbar = document.getElementById("navigation");

    window.onscroll = function () {
      let currentScrollPos = window.scrollY;

      if (prevScrollPos > currentScrollPos) {
        //  If scrolling up, show navbar:
        navbar.style.top = "0";
      } else {
        // If scrolling down, hide navbar:
        navbar.style.top = "-100px"; // Navbar height - adjustable
      }

      prevScrollPos = currentScrollPos;
    };

    // Showing navbar when hovered over with mouse:
    navbar.addEventListener("mouseenter", () => {
      navbar.style.top = "0";
    });

    // Hiding navbar when mouse leaves navbar area and user scrolls down:
    navbar.addEventListener("mouseleave", () => {
      let currentScrollPos = window.scrollY;
      if (prevScrollPos < currentScrollPos) {
        navbar.style.top = "-100px";
      }
    });

    // Theme changing:

    function changeTheme() {
      // get value of the selected theme

      const selectedTheme = themeColorSelect.value;

      // get main elements which should be stylized
      // (add buttons, body, navbar, inputs, form, text-blocks, add- and remove-buttons):

      const body = document.body;

      // all these classes have to have scss-code for switching between different themes ( @each $theme...):
      const buttonTh1 = document.querySelectorAll(
        ".nav-button, .favorite-button, #theme_color, option"
      );
      const buttonTh2 = document.querySelectorAll(".remove-button");

      // Results are nodelists of several elements, so we will use forEach-function to target each button:
      // 1. Remove all existing themes from this element:
      themes.forEach((theme) => {
        body.classList.remove(theme);

        buttonTh1.forEach((button) => {
          button.classList.remove(theme);
        });

        buttonTh2.forEach((button) => {
          button.classList.remove(theme);
        });
      });

      // 2. Add new theme to this element:
      body.classList.add(selectedTheme);

      buttonTh1.forEach((button) => {
        button.classList.add(selectedTheme);
      });

      buttonTh2.forEach((button) => {
        button.classList.add(selectedTheme);
      });

      console.log("Selected theme:", selectedTheme);
      console.log("Body classes:", body.classList);
    }

    let entry, rating, artist, time, item;

    // Load lists from localStorage on init:
    function loadLists() {
      const savedList = localStorage.getItem("addedList");
      const savedFavorites = localStorage.getItem("favoritesList");

      if (savedList) {
        const items = JSON.parse(savedList);
        items.forEach((item) =>
          list.appendChild(
            createTask(item.entry, item.artist, item.rating, item.time)
          )
        );
      }

      if (savedFavorites) {
        const items = JSON.parse(savedFavorites);
        items.forEach((item) =>
          favoritesList.appendChild(
            createFavorite(item.entry, item.artist, item.rating, item.time)
          )
        );
      }
    }

    // Save lists to localStorage:
    function saveLists() {
      const addedItems = [];
      list.querySelectorAll("li").forEach((item) => {
        addedItems.push({
          entry: item.querySelector(".entry").textContent,
          artist: item.querySelector(".artist").textContent,
          rating: item.querySelector(".rating").textContent,
          time: item.querySelector(".time").textContent,
        });
      });
      localStorage.setItem("addedList", JSON.stringify(addedItems));

      const favoriteItems = [];
      favoritesList.querySelectorAll("li").forEach((item) => {
        favoriteItems.push({
          entry: item.querySelector(".entry").textContent,
          artist: item.querySelector(".artist").textContent,
          rating: item.querySelector(".rating").textContent,
          time: item.querySelector(".time").textContent,
        });
      });
      localStorage.setItem("favoritesList", JSON.stringify(favoriteItems));
    }

    // creating new task:
    function createTask(entry, artist, rating, time) {
      const item = document.createElement("li");
      item.innerHTML = `<p class="whiteParagraph">Album: <span class="whiteText" class="entry">${entry}</span> 
      <br> Artist: <span class="whiteText" class="artist">${artist}</span> 
      <br> Rate: <span class="whiteText" class="rating">${rating}</span> 
      <br> Rated on: <span class="whiteText" class="time">${time}</span></p>`;
      addFavoriteButton(item);
      addRemoveButton(item);

      return item;
    }

    // console.log(paragraph);

    // adding new task on the list:
    function addTask(event) {
      event.preventDefault();
      const entry = document.getElementById("album").value.trim();
      const artist = document.getElementById("artist").value.trim();
      const rating = document.getElementById("review").value;
      const time = new Date().toLocaleDateString();

      // test:
      //const time = new Date(2023, 11, 17).toLocaleDateString();
      const item = createTask(entry, artist, rating, time);
      list.appendChild(item);
      document.getElementById("album").value = "";
      document.getElementById("artist").value = "";
      document.getElementById("review").value = "";
      saveLists();
    }

    this.init = function () {
      // body initially has a default theme:
      document.body.classList.add("theme0");
      // new task (item) added on the add-button click:
      buttonAdd.addEventListener("click", addTask);
      loadLists();
    };

    // add button FavoriteButton:
    function addFavoriteButton(item) {
      const favoriteButton = document.createElement("button");
      favoriteButton.setAttribute("type", "button");
      favoriteButton.classList.add("favorite-button");
      // favoriteButton.classList.add("buttonTh1");
      favoriteButton.classList.add("button");
      favoriteButton.classList.add("flex-item");
      favoriteButton.addEventListener("click", setFavorite);
      favoriteButton.innerHTML = "Add to favorites";
      item.insertBefore(favoriteButton, item.firstChild);
      const listTitle = document.getElementById("new-title");
      listTitle.style.display = "block";
    }

    // function that applies theme to all newly created fav-buttons:
    // function setThemeToFavButton(theme, selectedTheme) {
    //   const button = document.querySelectorAll(".favorite-button");

    //   button.forEach((button) => {
    //     button.classList.remove(theme);
    //   });
    //   button.forEach((button) => {
    //     button.classList.add(selectedTheme);
    //   });
    // }
    // setThemeToFavButton();

    // Function setFavorite:
    function setFavorite(event) {
      const item = event.target.parentNode;
      const entry = item.querySelector(".entry").textContent;
      const artist = item.querySelector(".artist").textContent;
      const rating = item.querySelector(".rating").textContent;
      const time = item.querySelector(".time").textContent;

      console.log("Extracted values:", { entry, artist, rating, time }); // Debugging

      if (!entry || !artist || !rating || !time) {
        console.error("Some elements are missing in the item:", {
          entry,
          artist,
          rating,
          time,
        });
        return;
      }

      // Create favorite item:
      const favoriteItem = createFavorite(entry, artist, rating, time);

      // if (!entryElement || !artistElement || !ratingElement || !timeElement) {
      //   console.error("Cannot find necessary elements in the item.");
      //   return;
      // }

      // Function to check if the item already exists in favorites, and if not, adds it to Favorites list:

      function addIf(favoriteItem) {
        let found = false;
        favoritesList.querySelectorAll("li").forEach((element) => {
          if (element.innerHTML === favoriteItem.innerHTML) {
            found = true;
          }
        });
        if (!found) {
          favoritesList.appendChild(favoriteItem);
          console.log(`Added '${entry}' on the favorites list.`);
        } else {
          console.log(`'${entry}' is already on the list.`);
        }
      }

      addIf(favoriteItem);
      saveLists();
    }

    // Function createFavorite:
    function createFavorite(entry, artist, rating, time) {
      const item = document.createElement("li");
      item.innerHTML = `<p class="entry">Album: <span id="white" >${entry}</span></p>
      <p class="artist">Artist: <span id="white" >${artist}</span></p>
      <p class="rating">Rate: <span id="white" >${rating}</span></p>
      <p class="time">Rated on: <span id="white" >${time}</span></p>`;

      console.log("Created item HTML:", item.innerHTML); // Debugging

      addRemoveButton(item);
      return item;
    }

    // Debugging to ensure favoritesList is found
    console.log("favoritesList:", favoritesList);

    // add button RemoveButton:
    function addRemoveButton(item) {
      const removeButton = document.createElement("button");
      const hr = document.createElement("hr");
      removeButton.classList.add("remove-button");
      removeButton.classList.add("flex-item");
      removeButton.addEventListener("click", removeTask);
      item.appendChild(removeButton);
      item.appendChild(hr);
      removeButton.innerHTML = "Remove album";
    }

    // function removeTask:
    function removeTask(event) {
      const removeButton = event.target;
      removeButton.parentNode.remove();
      // removes the whole parent-task (in which the removeButton was embedded as a child)
      saveLists();
    }
  }
  // here ends Todo function.

  const todo = new Todo();

  window.addEventListener("load", todo.init);
})();

// API KEY:

// const apikey = process.env.API_KEY;
//

// Error kod dodavanja novih itema na favorite listu:
// index.js:338 Uncaught TypeError: Cannot read properties of null (reading 'textContent')
//     at HTMLButtonElement.setFavorite (index.js:338:49)

// index.js:287 Uncaught TypeError: Cannot read properties of null (reading 'textContent')
//     at HTMLButtonElement.setFavorite (index.js:287:49)

// također se ne može ni removati iteme s 1. liste:
// index.js:124 Uncaught TypeError: Cannot read properties of null (reading 'textContent')
//     at index.js:124:46
//     at NodeList.forEach (<anonymous>)
//     at saveLists (index.js:122:35)
//     at HTMLButtonElement.removeTask (index.js:370:7)
// Kasnije je removanje s osnovne liste ipak proradilo.

// I removanje itema s favorite liste radi normalno, ali dodavanje s osnovne liste ne radi.

// Give your stylesheet link an id..

// <link rel=stylesheet href=mycss.css id=shtylesheet>
// Then you can change it with javascript

// function changeStylesheet(newstylesheet){
//     document.getElementById('shtylesheet').setAttribute('href', newstylesheet);
// }
// Then if you wanna do buttons or something

// <button onclick="changeStylesheet('light.css')">Lights on</button>
// <button onclick="changeStylesheet('dark.css')">Lights off</button>
