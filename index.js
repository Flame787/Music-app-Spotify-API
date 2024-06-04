require ('dotenv').config();

(function () {
  function Todo() {
    const buttonAdd = document.querySelector(".input-button");
    const lista = document.querySelector("ul");

    let entry, recenzija, artist, vrijeme, item;

    // kreiranje nove stavke:

    function kreirajStavku(entry, artist, recenzija, vrijeme) {
      const item = document.createElement("li");

      item.innerHTML = `<p>Album: <span id="white">${entry}</span> <br> Artist: <span id="white">${artist}</span> <br> Rate: <span id="white">${recenzija}</span> <br> Rated on: <span id="white">${vrijeme}</span></p>`;
      dodajFavoriteButton(item);
      dodajRemoveButton(item);
      return item;
    }

    // dodavanje nove stavke na listu:

    function dodajStavku() {
      const entry = document.getElementById("album").value.trim();
      const artist = document.getElementById("artist").value.trim();
      const recenzija = document.getElementById("review").value;
      const vrijeme = new Date().toLocaleDateString();

      // test:
      //const vrijeme = new Date(2023, 11, 17).toLocaleDateString();

      const item = kreirajStavku(entry, artist, recenzija, vrijeme);
      lista.appendChild(item);
      document.getElementById("album").value = "";
      document.getElementById("artist").value = "";
      document.getElementById("review").value = "";
    }

    // nova stavka (item) se doda na klik add-buttona:

    this.init = function () {
      buttonAdd.addEventListener("click", dodajStavku);
    };

    // dodaj FavoriteButton:

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

    // funkcija setFavorite:

    function setFavorite(event) {
      const favoriteButton = event.target;
      favoriteButton.classList.toggle("favorite");
      //   parentNode.appendChild(favoriteButton);
    }

    // dodaj RemoveButton:

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

    // funkcija removeStavka:
    function removeStavka(event) {
      const removeButton = event.target;
      removeButton.parentNode.remove();
      // uklanja cijelu parent-stavku (u kojoj se našao kao child)
    }

  }
  // ovdje je završila funkcija Todo

  const todo = new Todo();

  window.addEventListener("load", todo.init);
})();


// API KEY:

// const apikey = process.env.API_KEY;
//
