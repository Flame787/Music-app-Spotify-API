// require("dotenv").config();

// alternativ:
// import dotenv from 'dotenv';
// dotenv.config();

(function () {
  function Todo() {
    const buttonAdd = document.querySelector(".input-button");
    const lista = document.querySelector("ul");

    let entry, rating, artist, time, item;

    // creating new task:

    function kreirajStavku(entry, artist, rating, time) {
      const item = document.createElement("li");

      item.innerHTML = `<p>Album: <span id="white">${entry}</span> <br> Artist: <span id="white">${artist}</span> <br> Rate: <span id="white">${rating}</span> <br> Rated on: <span id="white">${time}</span></p>`;
      dodajFavoriteButton(item);
      dodajRemoveButton(item);
      return item;
    }

    // adding new task on the list:

    function dodajStavku() {
      const entry = document.getElementById("album").value.trim();
      const artist = document.getElementById("artist").value.trim();
      const rating = document.getElementById("review").value;
      const time = new Date().toLocaleDateString();

      // test:
      //const time = new Date(2023, 11, 17).toLocaleDateString();

      const item = kreirajStavku(entry, artist, rating, time);
      lista.appendChild(item);
      document.getElementById("album").value = "";
      document.getElementById("artist").value = "";
      document.getElementById("review").value = "";
    }

    // new task (item) added on the add-button click:

    this.init = function () {
      buttonAdd.addEventListener("click", dodajStavku);
    };

    // add button FavoriteButton:

    function dodajFavoriteButton(item) {
      const favoriteButton = document.createElement("button");
      favoriteButton.setAttribute("type", "checkbox");
      favoriteButton.classList.toggle("favorite-button");
      favoriteButton.classList.add("flex-item");
      favoriteButton.addEventListener("click", setFavorite);
      favoriteButton.innerHTML = "Add to favorites";
      item.insertBefore(favoriteButton, item.firstChild);

      const listTitle = document.getElementById("new-title");
      listTitle.style.display = "block";
    }

    // funkcion setFavorite:

    function setFavorite(event) {
      const favoriteButton = event.target;
      favoriteButton.classList.toggle("favorite");
      //   parentNode.appendChild(favoriteButton);
    }

    // add button RemoveButton:

    function dodajRemoveButton(item) {
      const removeButton = document.createElement("button");
      const hr = document.createElement("hr");
      removeButton.classList.add("remove-button");
      removeButton.classList.add("flex-item");
      removeButton.addEventListener("click", removeStavka);
      item.appendChild(removeButton);
      item.appendChild(hr);
      removeButton.innerHTML = "Remove album";
    }

    // function removeStavka:
    function removeStavka(event) {
      const removeButton = event.target;
      removeButton.parentNode.remove();
      // removes the whole parent-task (in which the removeButton was embedded as a child)
    }
  }
  // here ends Todo function

  const todo = new Todo();

  window.addEventListener("load", todo.init);
})();

// API KEY:

// const apikey = process.env.API_KEY;
//
