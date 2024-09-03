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

    function changeTheme() {
      const themeColor = themeColorSelect.value;
      if (themeColor == "black") {
        document.body.style.backgroundImage =
          "url(./pictures/triangular-neon-laser.jpg)";
        option.forEach((element) => {
          element.style.backgroundColor = "black";
          element.style.color = "white";
          // element.style.opacity = "0.5";
        });
      } else if (themeColor == "blue") {
        document.body.style.backgroundImage = "url(./pictures/energy-blue.jpg)";
        option.forEach((element) => {
          element.style.backgroundColor = "teal";
          element.style.color = "white";
          // element.style.opacity = "0.5";
        });
      } else if (themeColor == "green") {
        document.body.style.backgroundImage =
          "url(./pictures/orange-green.jpg)";
        option.forEach((element) => {
          element.style.backgroundColor = "forestgreen";
          element.style.color = "white";
          // element.style.opacity = "0.5";
        });
      } else if (themeColor == "yellow") {
        document.body.style.backgroundImage =
          "url(./pictures/energy-yellow.jpg)";
        option.forEach((element) => {
          element.style.backgroundColor = "sandybrown";
          element.style.color = "black";
          // element.style.opacity = "0.5";
        });
      } else if (themeColor == "water") {
        document.body.style.backgroundImage =
          "url(./pictures/energy-water.jpg)";
        form.classList.remove("formViolet");
        form.classList.add("formBlue");
        console.log(button);
        themeColorSelect.classList.remove("button");
        themeColorSelect.classList.add("buttonWater");
        document.body.style.color = "#00224d";
        document.body.style.textShadow = "none";

        button.forEach((element) => {
          element.classList.remove("button");
          element.classList.add("buttonWater");
        });

        option.forEach((element) => {
          element.style.backgroundColor = "lightblue";
          element.style.color = "black";
        });
      } else if (themeColor == "red") {
        document.body.style.backgroundImage = "url(./pictures/energy-red.jpg)";
        option.forEach((element) => {
          element.style.backgroundColor = "firebrick";
          element.style.color = "black";
          // element.style.opacity = "0.5";
        });
      } else {
        document.body.style.backgroundImage =
          "url(./pictures/energy-violet.jpg)";
        option.forEach((element) => {
          element.style.backgroundColor = "darkslateblue";
          element.style.color = "white";
          // element.style.opacity = "0.5";

          // treba maknuti sve ostale prijašnje klase ili jednostavno dodijeliti nove. 
          // Inače ostanu uključene ranije klase za boje buttona (iako se background promijeni).
        });
      }
    }
    changeTheme();

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

    const paragraph = document.querySelectorAll(
      "whiteParagraph",
      "blackParagraph"
    );
   

    // creating new task:
    function createTask(entry, artist, rating, time) {
      const item = document.createElement("li");
      item.innerHTML = `<p class="whiteParagraph">Album: <span class="whiteText" class="entry">${entry}</span> <br> Artist: <span class="whiteText" class="artist">${artist}</span> <br> Rate: <span class="whiteText" class="rating">${rating}</span> <br> Rated on: <span class="whiteText" class="time">${time}</span></p>`;
      addFavoriteButton(item);
      addRemoveButton(item);

      // change paragraph style instantly during new item creation:
      const paragraph = item.querySelector("p");
      const span = item.querySelectorAll("span");

      themeColorSelect.addEventListener("change", changeParagraphStyle);
      function changeParagraphStyle() {
        paragraph.classList.remove("whiteParagraph", "blackParagraph");
        if (themeColorSelect.value == "black") {
          paragraph.classList.add("whiteParagraph");
        } else if (themeColorSelect.value == "blue") {
          paragraph.classList.add("whiteParagraph");
        } else if (themeColorSelect.value == "green") {
          paragraph.classList.add("whiteParagraph");
        } else if (themeColorSelect.value == "yellow") {
          paragraph.classList.add("blackParagraph");
        } else if (themeColorSelect.value == "water") {
          paragraph.classList.add("blackParagraph");
        } else if (themeColorSelect.value == "red") {
          paragraph.classList.add("blackParagraph");
        } else {
          paragraph.classList.add("whiteParagraph");
        }
      }
      changeParagraphStyle(paragraph);

      themeColorSelect.addEventListener("change", changeSpanStyle);
      function changeSpanStyle() {
        span.forEach((element) => {
          element.classList.remove("whiteText", "blackText");
        });

        if (themeColorSelect.value == "black") {
          span.forEach((element) => {
            element.classList.add("whiteText");
          });
        } else if (themeColorSelect.value == "blue") {
          span.forEach((element) => {
            element.classList.add("whiteText");
          });
        } else if (themeColorSelect.value == "green") {
          span.forEach((element) => {
            element.classList.add("whiteText");
          });
        } else if (themeColorSelect.value == "yellow") {
          span.forEach((element) => {
            element.classList.add("blackText");
          });
        } else if (themeColorSelect.value == "water") {
          span.forEach((element) => {
            element.classList.add("blackText");
          });
        } else if (themeColorSelect.value == "red") {
          span.forEach((element) => {
            element.classList.add("blackText");
          });
        } else {
          span.forEach((element) => {
            element.classList.add("whiteText");
          });
        }
      }
      changeSpanStyle(span);

      return item;
    }

    console.log(paragraph);

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

    // new task (item) added on the add-button click:
    this.init = function () {
      buttonAdd.addEventListener("click", addTask);
      loadLists();
    };

    // add button FavoriteButton:
    function addFavoriteButton(item) {
      const favoriteButton = document.createElement("button");
      favoriteButton.setAttribute("type", "button");
      favoriteButton.classList.add("favorite-button");
      favoriteButton.classList.add("button");
      favoriteButton.classList.add("flex-item");
      favoriteButton.addEventListener("click", setFavorite);
      favoriteButton.innerHTML = "Add to favorites";
      item.insertBefore(favoriteButton, item.firstChild);
      const listTitle = document.getElementById("new-title");
      listTitle.style.display = "block";

      themeColorSelect.addEventListener("change", changeFavButton);
      function changeFavButton() {
        favoriteButton.classList.remove("button");
        if (themeColorSelect.value == "black") {
          favoriteButton.classList.add("buttonBlack");
        } else if (themeColorSelect.value == "blue") {
          favoriteButton.classList.add("buttonBlue");
        } else if (themeColorSelect.value == "green") {
          favoriteButton.classList.add("buttonGreen");
        } else if (themeColorSelect.value == "yellow") {
          favoriteButton.classList.add("buttonYellow");
        } else if (themeColorSelect.value == "water") {
          favoriteButton.classList.add("buttonWater");
        } else if (themeColorSelect.value == "red") {
          favoriteButton.classList.add("buttonRed");
        } else {
          favoriteButton.classList.add("button");
        }
      }
      changeFavButton(favoriteButton);
    }

    // Function setFavorite:
    function setFavorite(event) {
      const item = event.target.parentNode;
      const entry = item.querySelector(".entry").textContent;
      const artist = item.querySelector(".artist").textContent;
      const rating = item.querySelector(".rating").textContent;
      const time = item.querySelector(".time").textContent;
      const favoriteItem = createFavorite(entry, artist, rating, time);

      if (!entryElement || !artistElement || !ratingElement || !timeElement) {
        console.error("Cannot find necessary elements in the item.");
        return;
      }

      function addIf(favoriteItem) {
        let found = false;
        favoritesList.querySelectorAll("li").forEach((element) => {
          if (element.textContent === favoriteItem.textContent) {
            found = true;
          }
        });
        if (!found) {
          favoritesList.appendChild(favoriteItem);
          console.log(`Added '${favoriteItem}' on the favorites list.`);
        } else {
          console.log(`'${favoriteItem}' is already on the list.`);
        }
      }

      addIf(favoriteItem);
      saveLists();

      // favoritesList.appendChild(favoriteItem);
    }

    // Function createFavorite:
    function createFavorite(entry, artist, rating, time) {
      const item = document.createElement("li");
      item.innerHTML = `<p>Album: <span id="white" class="entry">${entry}</span></p>
      <p>Artist: <span id="white" class="artist">${artist}</span></p>
      <p>Rate: <span id="white" class="rating">${rating}</span></p>
      <p>Rated on: <span id="white" class="time">${time}</span></p>`;
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

      themeColorSelect.addEventListener("change", changeRemoveButton);
      function changeRemoveButton() {
        if (themeColorSelect.value == "black") {
          removeButton.classList.add("removeButtonBlack");
        } else if (themeColorSelect.value == "blue") {
          removeButton.classList.add("removeButtonBlue");
        } else if (themeColorSelect.value == "green") {
          removeButton.classList.add("removeButtonGreen");
        } else if (themeColorSelect.value == "yellow") {
          removeButton.classList.add("removeButtonYellow");
        } else if (themeColorSelect.value == "water") {
          removeButton.classList.add("removeButtonWater");
        } else if (themeColorSelect.value == "red") {
          removeButton.classList.add("removeButtonRed");
        } else {
          removeButton.classList.add("remove-button");
        }
      }
      changeRemoveButton(removeButton);
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