(function () {
  function Todo() {
    const buttonAdd = document.querySelector(".input-button");
    const list = document.getElementById("added-list");
    const favoritesList = document.getElementById("fav_albums");

    let entry, rating, artist, time, item;

    // Load lists from localStorage on init
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

    // Save lists to localStorage
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

    // const entry = document.getElementById("album").value.trim();
    // const artist = document.getElementById("artist").value.trim();

    // - result1: Search - for artist base search
    // - result2: Get Artist’s albums
    // - additional (maybe for an elaborate form, not now): Get Album Tracks
    // - additional (maybe for a elaborate form, not now): Player: Start/Resume Playback

    // API call:

    // možda bolje importati cijelu listu artist-ID-jeva iz nekog drugog zasebnog filea:

    // za artiste je endpoint value njihov id (šifra svakog artista) - treba nabaviti cijelu listu tih id-jeva
    // ili hard-kodirati samo neki uži izbor artista

    // dodati funkciju koja u pozadini dodaje spremljeni ID uz neki artistEntry.
    // {id} je value koji se prosljeđuje API-requestu

    // dohvaćamo objekte koji su elementi liste.

    // FUNKCIJA ZA HENDLANJE PODATAKA:

    const handleData = function (data) {
      // inicijaliziranje varijabli:
      var resultArtist = "",
        resultAlbum = "",
        artistName,
        albumName;

      //   for (let i = 0; i < data.length; i++) {
      //     artistName = data[i].artistName;
      //     albumName = data[i].albumName;

      const artistEntries = [
        {
          name: "metallica",
          id: "2ye2Wgw4gimLv2eAKyk1NB",
        },
        {
          name: "iron maiden",
          id: "6mdiAmATAx73kdxrNrnlao",
        },
      ];

      artistEntries.forEach((item) => {
        const artistItem = item.name;
        const idItem = item.id;
      });

      if (data.length > 0) {
        resultArtist += artistName;
        resultAlbum += albumName;
      } else {
        resultArtist = "";
        resultAlbum = "";
      }
      entry.innerHTML = resultAlbum;
      artist.innerHTML = resultArtist;
    };

    // FUNKCIJA ZA HENDLANJE ERRORA:

    const handleError = function (error) {
      entry.innerHTML = "enter album";
      artist.innerHTML = "enter artist";
    };

    // FUNKCIJA ZA SLANJE API-REQUESTOVA:

    document.getElementById("artist").addEventListener("change", function () {
      const artistEntry = artist.value.trim;

      // za albume je endpoint (koristi id artista): https://api.spotify.com/v1/artists/{id}/albums
      // ili kad se stavi u browser: https://api.spotify.com/v1/artists/%7Bid%7D/albums

      // za kasnije dodavanje pjesama na albumima: svaki album ima svoji id koji možemo dohvatiti:
      //  "items": [
      // {
      //   "album_type": "compilation",
      //   "total_tracks": 9,
      //  "id": "2up3OPMp9Tb4dAKM2erWXQ", ... } ]

      if (artistEntry != "") {
        fetch(`https://api.spotify.com/v1/artists/{id}`, {
          headers: {
            Authorization: "Bearer YOUR_ACCESS_TOKEN",
          },
        })
          .then((response) => response.json())
          .then((data) => handleData(data))
          .catch((error) => handleError());
      } else {
        artist.innerHTML = "enter artist";
      }
    });

    document.getElementById("artist").addEventListener("change", function () {
      const artistEntry = artist.value.trim;
      const albumEntry = entry.value.trim;

      if (artistEntry != "" && albumEntry != "") {
        fetch(`https://api.spotify.com/v1/artists/{id}/albums`, {
          headers: {
            Authorization: "Bearer YOUR_ACCESS_TOKEN",
          },
        })
          .then((response) => response.json())
          .then((data) => handleData(data))
          .catch((error) => handleError());
      } else {
        entry.innerHTML = "enter album";
      }
    });

    // adding new task on the list:
    function addTask(event) {
      event.preventDefault();
      const artistInput = document.getElementById("artist").value.trim();
      const albumInput = document.getElementById("album").value.trim();
      const rating = document.getElementById("review").value;
      const time = new Date().toLocaleDateString();

      // Spotify API endpoint for searching albums
      const searchUrl = `https://api.spotify.com/v1/search?q=album:${encodeURIComponent(
        albumInput
      )}%20artist:${encodeURIComponent(artistInput)}&type=album`;

      fetch(searchUrl, {
        headers: {
          Authorization: "Bearer YOUR_ACCESS_TOKEN", // Replace with actual access token
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // Extract album information from API response
          const spotifyAlbum = data.albums.items[0]; // Assuming the first result is what we want

          if (spotifyAlbum) {
            const entry = spotifyAlbum.name;
            const artist = spotifyAlbum.artists
              .map((artist) => artist.name)
              .join(", ");
            const item = createTask(entry, artist, rating, time);
            list.appendChild(item);
            saveLists();
          } else {
            alert("Album not found on Spotify.");
          }
        })
        .catch((error) => {
          console.error("Error fetching album from Spotify:", error);
          alert("Error fetching album from Spotify. Please try again later.");
        });

      document.getElementById("album").value = "";
      document.getElementById("artist").value = "";
      document.getElementById("review").value = "";
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
      favoriteButton.classList.add("flex-item");
      favoriteButton.addEventListener("click", setFavorite);
      favoriteButton.innerHTML = "Add to favorites";
      item.insertBefore(favoriteButton, item.firstChild);

      const listTitle = document.getElementById("new-title");
      listTitle.style.display = "block";
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
