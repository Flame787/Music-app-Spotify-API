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
    // const favoriteButton = document.querySelectorAll("favorite-button");
    // const favoriteButton = document.getElementsByClassName("favorite-button");
    // const buttonAdd = document.querySelector(".input-button");

    function changeTheme() {
      const themeColor = themeColorSelect.value;
      if (themeColor == "black") {
        document.body.style.backgroundImage =
          "url(./pictures/energy-black.jpg)";
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
          "url(./pictures/energy-green.jpg)";
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

        // favoriteButton.classList.remove("button");
        // favoriteButton.classList.add("buttonWater");
        button.forEach((element) => {
          element.classList.remove("button");
          element.classList.add("buttonWater");
        });

        // console.log(favoriteButton);
        // favoriteButton.forEach((element) => {
        //   element.classList.remove("button");
        //   element.classList.add("buttonWater");
        // });
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

    // creating new task:
    function createTask(entry, artist, rating, time) {
      const item = document.createElement("li");
      item.innerHTML = `<p>Album: <span id="white" class="entry">${entry}</span> <br> Artist: <span id="white" class="artist">${artist}</span> <br> Rate: <span id="white" class="rating">${rating}</span> <br> Rated on: <span id="white" class="time">${time}</span></p>`;
      addFavoriteButton(item);
      addRemoveButton(item);
      return item;
    }

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

    // function changeFavButton(favoriteButton){
    //   const themeColor = themeColorSelect.value;
    //   if (themeColor.value == "black") {

    //   } else if (themeColor == "blue") {
    //   } else if (themeColor == "green") {
    //   } else if (themeColor == "yellow") {
    //   } else if (themeColor == "water") {
    //     favoriteButton.classList.remove("button");
    //     favoriteButton.classList.add("buttonWater");
    //   } else if (themeColor == "red") {
    //   } else {
    //   }

    // }

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
        if (themeColorSelect.value == "black") {
          favoriteButton.classList.add("buttunBlack");
        } else if (themeColorSelect.value == "blue") {
          favoriteButton.classList.add("buttunBlue");
        } else if (themeColorSelect.value == "green") {
          favoriteButton.classList.add("buttunGreen");
        } else if (themeColorSelect.value == "yellow") {
          favoriteButton.classList.add("buttunYellow");
        } else if (themeColorSelect.value == "water") {
          favoriteButton.classList.add("buttonWater");
        } else if (themeColorSelect.value == "red") {
          favoriteButton.classList.add("buttunRed");
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
