(function () {
  function Todo() {
    const buttonPlay = document.querySelector(".play-button");
    const submitToListButton = document.querySelector(".add-button");
    const list = document.getElementById("added-list"); // first list (ul) that gets tasks appended
    const favoritesList = document.getElementById("fav_albums"); // second list (ul) with favorite songs

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

    ///////////////////////////////////   Themes   ///////////////////////////////////////////

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
      "theme13",
      "theme14",
      "theme15",
    ];

    // Function for changing a theme:
    function changeTheme(themeName) {
      const body = document.body;

      // Remove existing (previous) themes:
      themes.forEach((theme) => {
        body.classList.remove(theme);
        document
          .querySelectorAll(
            ".nav-button, .favorite-button, #theme_color, option"
          )
          .forEach((button) => {
            button.classList.remove(theme);
          });
        document.querySelectorAll(".remove-button").forEach((button) => {
          button.classList.remove(theme);
        });
        document.querySelectorAll(".form-theme").forEach((form) => {
          form.classList.remove(theme);
        });
        document.querySelectorAll(".title-theme").forEach((title) => {
          title.classList.remove(theme);
        });
        document.querySelectorAll(".input-color").forEach((input) => {
          input.classList.remove(theme);
        });
        document.querySelectorAll(".header-style").forEach((input) => {
          input.classList.remove(theme);
        });
        document.querySelectorAll(".thin").forEach((text) => {
          text.classList.remove(theme);
        });
      });

      // Add newly selected theme style:
      body.classList.add(themeName);
      document
        .querySelectorAll(".nav-button, .favorite-button, #theme_color, option")
        .forEach((button) => {
          button.classList.add(themeName);
        });
      document.querySelectorAll(".remove-button").forEach((button) => {
        button.classList.add(themeName);
      });
      document.querySelectorAll(".form-theme").forEach((form) => {
        form.classList.add(themeName);
      });
      document.querySelectorAll(".title-theme").forEach((title) => {
        title.classList.add(themeName);
      });
      document.querySelectorAll(".input-color").forEach((input) => {
        input.classList.add(themeName);
      });
      document.querySelectorAll(".header-style").forEach((input) => {
        input.classList.add(themeName);
      });
      document.querySelectorAll(".thin").forEach((text) => {
        text.classList.add(themeName);
      });

      console.log("Selected theme:", themeName);
      console.log("Body classes:", body.classList);
    }

    // Dropdown (instead of select-element):
    document
      .querySelector(".dropdown-toggle")
      .addEventListener("click", function () {
        const menu = document.querySelector(".dropdown-menu");
        menu.classList.toggle("show");
      });

    // Hide dropdown on click outside of it:
    document.addEventListener("click", function (event) {
      if (
        !document.querySelector(".dropdown-toggle").contains(event.target) &&
        !document.querySelector(".dropdown-menu").contains(event.target)
      ) {
        document.querySelector(".dropdown-menu").classList.remove("show");
      }
    });

    // Add functionality to choose options:
    document.querySelectorAll(".dropdown-menu li").forEach(function (option) {
      option.addEventListener("click", function () {
        const themeName = option.getAttribute("data-value");
        document.querySelector(".dropdown-toggle").textContent =
          option.textContent;
        document.querySelector(".dropdown-menu").classList.remove("show");
        changeTheme(themeName);
      });
    });

    /////////////////////////////////   CODE FOR FETCHING ARTISTS, ALBUMS AND SONGS:   ////////////////////////////////////////

    // const form = document.getElementById("form");
    // const button = document.querySelectorAll("button");

    let album, rating, artist, song, time, item;

    const artistInput = document.getElementById("artist");
    const songInput = document.getElementById("song");
    const albumInput = document.getElementById("album");
    const resultsList = document.getElementById("results");

    // Function to get access token from the server
    async function getAccessToken() {
      const response = await fetch("/api/token"); // API call to your server to get the access token / Fetch token from the server
      if (!response.ok) {
        throw new Error("Failed to fetch token");
      }
      const data = await response.json(); // Parse JSON response
      return data.accessToken;
    }

    artistInput.addEventListener("input", function () {
      let query = this.value;
      if (query.length > 2) {
        // Start searching after 3 characters
        searchSpotify(query, "artist", "artistSuggestions");
      }
    });

    songInput.addEventListener("input", function () {
      let query = this.value;
      if (query.length > 2) {
        searchSpotify(query, "track", "songSuggestions");
      }
    });

    albumInput.addEventListener("input", function () {
      let query = this.value;
      if (query.length > 2) {
        searchSpotify(query, "album", "albumSuggestions");
      }
    });

    // Function to perform API call to Spotify
    async function searchSpotify(query, type, suggestionListId, accessToken) {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      };

      fetch(
        `https://api.spotify.com/v1/search?q=${query}&type=${type}&limit=5`,
        {
          method: "GET",
          headers: headers,
        }
      )
        .then((response) => response.json())
        .then((data) => {
          displaySuggestions(data, type, suggestionListId);
        })
        .catch((error) => console.error("Error:", error));
    }

    // Function to display suggestions in a dropdown
    function displaySuggestions(data, type, suggestionListId) {
      const suggestionList = document.getElementById(suggestionListId);
      suggestionList.innerHTML = ""; // Clear previous suggestions

      let items = [];
      if (type === "artist" && data.artists) {
        items = data.artists.items;
      } else if (type === "track" && data.tracks) {
        items = data.tracks.items;
      } else if (type === "album" && data.albums) {
        items = data.albums.items;
      }

      items.forEach((item) => {
        let li = document.createElement("li");
        li.textContent = item.name;
        li.addEventListener("click", () =>
          selectSuggestion(item, type, suggestionListId)
        );
        suggestionList.appendChild(li);
      });
    }

    // Function to handle user selection of a suggestion
    function selectSuggestion(item, type, suggestionListId) {
      const selectedResults = document.getElementById("selectedResults");
      let li = document.createElement("li");
      li.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)}: ${
        item.name
      }`;
      selectedResults.appendChild(li);

      document.getElementById(suggestionListId).innerHTML = ""; // Clear suggestions after selection
    }

    /////// Primjer funkcije za slanje API poziva  //////////////////////

    // Kada implementiraš rutu /api/suggestions, možeš je testirati direktno putem preglednika ili Postmana da vidiš vraća li ispravan JSON odgovor.

    // ako type nije postavljen, zadaje se defaultna vrijednost 'artist,album,track':
    async function fetchSuggestions(query, type = 'artist,album,track') {
      try {
        const response = await fetch(`/api/suggestions?q=${query}&type=${type}`);
        if (!response.ok) {
          throw new Error('Failed to fetch suggestions');
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    }

    /////// ovo doraditi - što uopće radi, što je query??   //////////////////////

    // function fetchSuggestions(query, type) {
    //   fetch(
    //     `http://localhost:3000/api/suggestions?q=${encodeURIComponent(query)}`
    //   )
    //     .then((response) => response.json())
    //     .then((data) => {
    //       // Očisti prethodne rezultate
    //       resultsList.innerHTML = "";

    //       // Prikaži do 5 rezultata
    //       data.results.slice(0, 5).forEach((result) => {
    //         const listItem = document.createElement("li");
    //         listItem.textContent = `${result.artist} - ${result.song} (${result.album})`;
    //         resultsList.appendChild(listItem);
    //       });
    //     })
    //     .catch((error) => {
    //       console.error("Error:", error);
    //     });
    // }

    // Event listener za praćenje unosa u sva tri polja
    [artistInput, songInput, albumInput].forEach((input) => {
      input.addEventListener("input", () => {
        const query = input.value.trim();
        if (query.length > 0) {
          fetchSuggestions(query);
        } else {
          resultsList.innerHTML = ""; // Očisti rezultate ako je unos prazan
        }
      });
    });

    //   function searchSongs() {
    //     const query = songSearchInput.value.trim();
    //     if (!query) {
    //         alert("Please enter a song name.");
    //         return;
    //     }

    //     fetch(`http://localhost:3000/api/search?q=${encodeURIComponent(query)}`)
    //         .then(response => {
    //             if (!response.ok) {
    //                 throw new Error('Network response was not ok');
    //             }
    //             return response.json();
    //         })
    //         .then(data => {
    //             resultsList.innerHTML = '';
    //             data.songs.forEach(song => {
    //                 const listItem = document.createElement('li');
    //                 listItem.textContent = `${song.artist} - ${song.title}`;
    //                 resultsList.appendChild(listItem);
    //             });
    //         })
    //         .catch(error => {
    //             console.error('Error:', error);
    //         });
    // }

    // Load lists from localStorage on init:
    function loadLists() {
      const savedList = localStorage.getItem("addedList");
      const savedFavorites = localStorage.getItem("favoritesList");

      if (savedList) {
        const items = JSON.parse(savedList);
        items.forEach((item) =>
          list.appendChild(
            createTask(
              item.artist,
              item.song,
              item.album,
              item.rating,
              item.time
            )
          )
        );
      }

      if (savedFavorites) {
        const items = JSON.parse(savedFavorites);
        items.forEach((item) =>
          favoritesList.appendChild(
            createFavorite(
              item.artist,
              item.song,
              item.album,
              item.rating,
              item.time
            )
          )
        );
      }
    }

    // Save lists to localStorage:
    function saveLists() {
      const addedItems = [];
      list.querySelectorAll("li").forEach((item) => {
        addedItems.push({
          artist: item.querySelector(".artist").textContent,
          song: item.querySelector(".song").textContent,
          album: item.querySelector(".album").textContent,
          rating: item.querySelector(".rating").textContent,
          time: item.querySelector(".time").textContent,
        });
      });
      localStorage.setItem("addedList", JSON.stringify(addedItems));

      const favoriteItems = [];
      favoritesList.querySelectorAll("li").forEach((item) => {
        favoriteItems.push({
          artist: item.querySelector(".artist").textContent,
          song: item.querySelector(".song").textContent,
          album: item.querySelector(".album").textContent,
          rating: item.querySelector(".rating").textContent,
          time: item.querySelector(".time").textContent,
        });
      });
      localStorage.setItem("favoritesList", JSON.stringify(favoriteItems));
    }

    // doraditi logiku Search funkcije !!! - što se dohvaća pomoću API-ja i kako se prikazuje

    // doraditi Play-funkciju:

    function playSong(event) {
      event.preventDefault();
    }

    // Creating new task / new item on a submit/play-list:
    function createTask(artist, song, album, rating, time) {
      const item = document.createElement("li");

      // const div = document.createElement("div");
      // div.classList.add("form-theme", "item-card");

      item.innerHTML = `<div class="form-theme item-card" > 
      <p class="item-fill flex-item">  
      <span class="thin"> Artist:  </span> <span  class="artist">${artist}</span> <br> 
      <span class="thin"> Song: </span> <span class="song">${song}</span> <br> 
      <span class="thin"> Album:  </span> <span class="album">${album}</span> <br> 
      <span class="thin"> Rate:  </span>   <span  class="rating">${rating}</span> <br> 
      <span class="thin"> Rated on:  </span>   <span class="time">${time}</span>
      </p>  </div>`;

      const itemCardDiv = item.querySelector(".item-card");

      addFavoriteButton(itemCardDiv);
      addRemoveButton(itemCardDiv);

      return item;
    }

    // console.log(paragraph);

    // Adding new task on the list:
    function addTask(event) {
      event.preventDefault();
      const artist = document.getElementById("artist").value.trim();
      const song = document.getElementById("song").value.trim();
      const album = document.getElementById("album").value.trim();
      const rating = document.getElementById("review").value;
      const time = new Date().toLocaleDateString();

      // test:
      //const time = new Date(2023, 11, 17).toLocaleDateString();

      const item = createTask(artist, song, album, rating, time);
      list.appendChild(item);
      document.getElementById("artist").value = "";
      document.getElementById("song").value = "";
      document.getElementById("album").value = "";
      document.getElementById("review").value = "";
      saveLists();
    }

    this.init = function () {
      // body initially has a default theme0:
      document.body.classList.add("theme0");
      // new task (item) added on the add-button click:
      submitToListButton.addEventListener("click", addTask);
      buttonPlay.addEventListener("click", playSong);
      loadLists();
    };

    // add button FavoriteButton:
    function addFavoriteButton(itemCardDiv) {
      const favoriteButton = document.createElement("button");
      favoriteButton.setAttribute("type", "button");
      favoriteButton.classList.add("favorite-button", "button", "flex-item");
      favoriteButton.addEventListener("click", setFavorite);
      favoriteButton.innerHTML = "Add to favorites";
      itemCardDiv.insertBefore(favoriteButton, itemCardDiv.firstChild);

      const listTitle = document.getElementById("new-title");
      listTitle.style.display = "block";
    }

    // Function setFavorite:
    function setFavorite(event) {
      const item = event.target.parentNode;
      const artist = item.querySelector(".artist").textContent;
      const song = item.querySelector(".song").textContent;
      const album = item.querySelector(".album").textContent;
      const rating = item.querySelector(".rating").textContent;
      const time = item.querySelector(".time").textContent;

      // Debugging:
      console.log("Extracted values:", { song, album, artist, rating, time });

      if (!artist || !song || !album || !rating || !time) {
        console.error("Some elements are missing in the item:", {
          artist,
          song,
          album,
          rating,
          time,
        });
        return;
      }

      // Create favorite item:
      const favoriteItem = createFavorite(artist, song, album, rating, time);

      // if (!songElement || !albumElement || !artistElement || !ratingElement || !timeElement) {
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
          console.log(`Added '${song}' on the favorites list.`);
        } else {
          console.log(`'${song}' is already on the list.`);
        }
      }

      addIf(favoriteItem);
      saveLists();
    }

    // Function createFavorite:
    function createFavorite(artist, song, album, rating, time) {
      const item = document.createElement("li");
      item.innerHTML = `<div class="form-theme item-card item-card2"> <p class="item-fill2 flex-item">
      <span class="thin2">Artist: </span><span class="artist2" id="white" >${artist}</span><br>
      <span class="thin2">Song: </span><span class="song2" id="white" > ${song} </span><br>
      <span class="thin2">Album: </span><span class="album2" id="white" >${album}</span><br>
      <span class="thin2">Rate: </span><span class="rating2" id="white" >${rating}</span><br>
      <span class="thin2">Rated on: </span><span class="time2" id="white" >${time}</span></p>  </div>`;

      console.log("Created item HTML:", item.innerHTML); // Debugging

      const itemCardDiv = item.querySelector(".item-card");

      addRemoveButton(itemCardDiv);

      return item;
    }

    // Debugging to ensure favoritesList is found
    console.log("favoritesList:", favoritesList);

    // add button RemoveButton:
    function addRemoveButton(item) {
      const removeButton = document.createElement("button");

      const divElement = document.querySelectorAll(".item-card");
      // const hr = document.createElement("hr");

      removeButton.classList.add("remove-button");
      removeButton.classList.add("flex-item");
      removeButton.addEventListener("click", removeTask);
      item.appendChild(removeButton);
      // item.appendChild(hr);

      divElement.innerHTML += removeButton.outerHTML;

      removeButton.innerHTML = "Remove from list";
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
