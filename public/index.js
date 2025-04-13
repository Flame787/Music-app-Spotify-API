(function () {
  function Todo() {
    const list = document.getElementById("added-list"); // first list (ul) that gets tasks appended
    const favoritesList = document.getElementById("fav_albums"); // second list (ul) with favorite songs
    const searchInput = document.getElementById("search-all-input");
    const resultsContainer = document.getElementById("results-container"); // container for results
    const searchAllButton = document.getElementById("search-all-button");
    const formContainer = document.getElementById("zero-input");
    const formResultsContainerTracks = document.getElementById(
      "form-results-container"
    );

    const audioPlayer = document.getElementById("audio-player");

    let narrowForm = false;

    function createDiv() {
      return document.createElement("div");
    }

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

    // Show navbar when hovered over with mouse:
    navbar.addEventListener("mouseenter", () => {
      navbar.style.top = "0";
    });

    // Hide navbar when mouse leaves navbar area and user scrolls down:
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

    // Function for changing the theme:
    function changeTheme(themeName) {
      const body = document.body;

      // Remove existing (previous) themes:
      themes.forEach((theme) => {
        body.classList.remove(theme);
        document
          .querySelectorAll(
            ".nav-button, .favorite-button, #theme_color, option"
          )
          .forEach((element) => {
            element.classList.remove(theme);
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
    }

    // Dropdown for theme-picking (instead of select-element):
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

    function saveTheme(themeName) {
      localStorage.setItem("selectedTheme", themeName);
      console.log("Theme saved:", themeName);
    }

    function loadTheme() {
      const savedTheme = localStorage.getItem("selectedTheme");
      if (savedTheme) {
        changeTheme(savedTheme); // calls the function for theme-change
        console.log("Saved theme loaded:", savedTheme);

        // When a theme is chosen, show it's name in dropdown-button:
        const selectedOption = document.querySelector(
          `.dropdown-menu li[data-value="${savedTheme}"]`
        );
        if (selectedOption) {
          document.querySelector(".dropdown-toggle").textContent =
            selectedOption.textContent;
        }
      } else {
        const defaultTheme = themes[0];
        changeTheme(defaultTheme);
        // console.log("Saved theme missing.");
        console.log("Default theme applied:", defaultTheme);
      }
    }

    document.addEventListener("DOMContentLoaded", () => {
      loadTheme(); // Automatically applies/loads saved theme
    });

    // Add functionality to choose options/themes:
    document.querySelectorAll(".dropdown-menu li").forEach(function (option) {
      option.addEventListener("click", function () {
        const themeName = option.getAttribute("data-value");
        document.querySelector(".dropdown-toggle").textContent =
          option.textContent;
        document.querySelector(".dropdown-menu").classList.remove("show");
        changeTheme(themeName);
        saveTheme(themeName);
      });
    });

    /////////////////////////////   CODE FOR FETCHING ARTISTS, ALBUMS AND SONGS:   /////////////////////////////

    // ---------------------- FUNCTIONS FOR HANDLING SEARCH INPUT ------------------------------------- //

    searchAllButton.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent the default form submission
      handleSearch(); // call handleSearch() instead of displaySearchResults
    });

    // Key press on 'Enter' kbd key is also calling the handleSearch() function:
    searchInput.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault(); // Prevent form submission on Enter
        handleSearch(); // call handleSearch() instead of displaySearchResults
      }
    });

    // Function for warning if the input-field is empty:
    function displayMessage(container, text) {
      const message = document.createElement("p");
      message.textContent = text;
      message.classList.add("warning-message");
      container.appendChild(message); // ("Please enter your query" - in red letters)
    }

    // Function for informing that the song was added to Favorites-playlist:
    function displayFavoriteInfo(container, text) {
      const message = document.createElement("p");
      message.textContent = text;
      message.classList.add("favorite-message");
      container.appendChild(message);
    }

    // helper-function 'handleSearch' used to FETCH and DISPLAY results, and to focus on the Search results
    // 'handleSearch'-function CALLS other important functions: checkCategories(query) -> fetchSearchResults -> await displaySearchResults(query):

    async function handleSearch() {
      const query = searchInput.value.trim(); // fetch the input value
      // container near the input field

      // remove earlier warning messages (if any):
      formContainer.querySelector(".warning-message")?.remove();

      // show the initially hidden form with all results:
      formResultsContainerTracks.style.display = "block";

      if (query.length >= 1) {
        console.log("Form submitted");
        console.log("Query:", query);

        // function which expands the result-form width back to 80% if user presses Search button again:
        if (narrowForm === true) {
          formResultsContainerTracks.style.width = "80%";
          // formResultsContainerTracks.style.margin = "4% auto";
          narrowForm = false;
        }

        // calls the 1. function which handles INPUT:

        // 'checkCategories'-function sends different API fetch calls, depending on chosen type/category of results
        checkCategories(query); // Get the selected type
        console.log("handleSearch called");

        // Put focus on the results-container:
        document
          .getElementById("search-results")
          .scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        displayMessage(formContainer, "Please enter your query.");
      }
    }

    // function which handles different Search categories (artist, album, song) and their combinations:

    let selectedType;

    function checkCategories(query) {
      const selectedOptions = Array.from(
        document.querySelectorAll('input[name="category"]:checked')
      ).map((checkbox) => checkbox.value);

      console.log("Selected options:", selectedOptions);

      switch (JSON.stringify(selectedOptions)) {
        case JSON.stringify(["artist"]):
          selectedType = "artist";
          break;
        case JSON.stringify(["song"]):
          selectedType = "track";
          break;
        case JSON.stringify(["album"]):
          selectedType = "album";
          break;
        case JSON.stringify(["artist", "album"]):
          selectedType = "artist,album";
          break;
        case JSON.stringify(["album", "song"]):
          selectedType = "album,track";
          break;
        case JSON.stringify(["artist", "song"]):
          selectedType = "artist,track";
          break;
        case JSON.stringify([]): // option if user didn't select any category, just pressed Search (all)
        default:
          selectedType = "artist,album,track"; // showing results for all 3 categories
          break;
      }

      console.log("Selected type:", selectedType);

      // Call 2nd function: 'fetchSearchResults', and hand over argumets, which are here available: query & selectedType
      // Call fetchSearchResults and return its value
      fetchSearchResults(query, selectedType);
      //  catch (error) {
      //   console.error("Error fetching search results:", error);
      //   }
      // );
    }

    //////////// Function to send Api-request for Search results - from Frontend to Backend: //////////////////////

    // Function fetchSearchResults = dynamically implements selected search-categories ('types') into the API-link:
    // (if the 'type' is not set, it will be a default value: 'artist,album,track')
    // --> this function is called inside of the function checkCategories():
    async function fetchSearchResults(query, type) {
      try {
        const response = await fetch(`/api/search?q=${query}&type=${type}`);
        console.log("Fetching results...");
        if (!response.ok) {
          throw new Error("Failed to fetch results");
        }
        const data = await response.json();
        console.log("Data received:", data); // Log the fetched data
        // 2. function which handles OUTPUT:
        displaySearchResults(data, type); // Pass the data directly, so they can be displayed on screen
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    }

    ///// Function to show/display all fetched Search-results on the page:

    function displaySearchResults(data, type) {
      resultsContainer.innerHTML = ""; // Clear previous results

      console.log("Function displaSearchResults received this type:", type);
      console.log("Data received:", data);

      // Check if the result is empty:
      if (!data) {
        displayMessage(resultsContainer, "No results found.");
        return; // Exit if all 3 results categories are undefined or empty
      }

      // conditionally displaying results, based on selectedType:
      if (type.includes("artist")) {
        showArtists(data);
        console.log("Found artists:", data.artists.items);
      }
      if (type.includes("album")) {
        showAlbums(data);
        console.log("Found albums:", data.albums.items);
      }
      if (type.includes("track")) {
        showTracks(data);
        console.log("Found tracks:", data.tracks.items);
      }
    }

    // Displaying results, depending on API-data structure and selectedType:

    // - - - - - - Check and display ARTISTS: - - - - - - - - - - - - -

    function showArtists(results) {
      // if (results && results.length > 0) {
      //   console.log("showArtist function:", results); // test

      const ulArtists = document.createElement("ul"); // create an unordered list for artists
      const titleArtists = document.createElement("h3"); // visible titles for each of the 3 result-sub-containers
      ulArtists.classList.add("flex-container-ol");

      ulArtists.appendChild(titleArtists);
      titleArtists.innerHTML = "Artists:";

      if (results.artists && results.artists.items.length > 0) {
        results.artists.items.forEach((item) => {
          const li = document.createElement("li");
          const div = createDiv();
          const img = document.createElement("img");

          // Check if artist has a picture and if first picture is available (if one is missing, doesn't matter, then others will show up)
          if (item.images && item.images.length > 0) {
            img.src = item.images[0].url; // set the image url as source
          } else {
            // If no picture available, show a generic placeholder image:
            img.src = "./pictures/image-placeholder3.png";
          }
          img.alt = `${item.name} Artist`;
          img.classList.add("result-image");

          // Insert the div-image before the text content:
          li.insertBefore(div, li.firstChild);
          div.appendChild(img);
          div.classList.add("image-container-artist");

          // Event listener for showing Discography on Click on the artist-image-div:
          div.addEventListener("click", (event) => {
            event.preventDefault();
            handleDiscographyButtonClick(item.id, item.name); // Calls the function to fetch albums and passes the artist-id & name to the function
            // we are using this API: const response = await fetch(`/api/albums/${albumId}/tracks`);
            console.log(
              "Discography fetched via picture for:",
              item.id,
              item.name
            );
          });

          // Create a <div> for text and append it:
          const textDivArtist1 = createDiv();
          const textDivArtist2 = createDiv();

          const showMoreButton = document.createElement("button");
          // button for more info, depending on context - it shows Discography (for artists), or Track list (for albums)

          textDivArtist1.textContent = `${item.name}`;
          li.appendChild(textDivArtist1);
          textDivArtist2.textContent = `${item.genres.join(", ")}`; // lists all genres and puts a comma between them
          li.appendChild(textDivArtist2);
          li.appendChild(showMoreButton);
          showMoreButton.textContent = `Discography`;
          showMoreButton.classList.add("show-more-button");
          showMoreButton.setAttribute("id", "discography-button");

          // Event listener for showing Discography on Click on the 'Discography'-button:
          showMoreButton.addEventListener("click", (event) => {
            event.preventDefault();
            handleDiscographyButtonClick(item.id, item.name); // Calls the function to fetch albums and passes the artist-id & name to the function
            // same API: const response = await fetch(`/api/albums/${albumId}/tracks`);
            console.log(
              "Discography fetched via button for:",
              item.id,
              item.name
            );
          });

          li.classList.add("li-item-style", "result-flex-item");
          titleArtists.classList.add("result-category"); // centered title "Artists:"
          textDivArtist1.classList.add("result-item-name"); // bold and bigger font

          ulArtists.appendChild(li);
          resultsContainer.appendChild(ulArtists);
        });
      } else {
        const errorMessage = createDiv();
        resultsContainer.appendChild(errorMessage);
        errorMessage.textContent = `No artists found.`;
      }
    }

    //  - - - - - Check and display ALBUMS:  - - - - - - - - - - - - - - - -

    function showAlbums(results) {
      const ulAlbums = document.createElement("ul"); // create an unordered list for artists
      const titleAlbums = document.createElement("h3"); // visible titles of each of the 3 result-sub-containers
      ulAlbums.classList.add("flex-container-ol");

      ulAlbums.appendChild(titleAlbums);
      titleAlbums.innerHTML = "Albums:";

      if (results.albums && results.albums.items.length > 0) {
        results.albums.items.forEach((item) => {
          const li = document.createElement("li");
          const div = createDiv();
          const img = document.createElement("img");

          // Check if album has a cover picture and if first cover is available:
          if (item.images && item.images.length > 0) {
            img.src = item.images[0].url; // Set the image source
            img.alt = `${item.name} Album Cover`;
            img.classList.add("result-image");
            // Insert the div-image before the text content:
            li.insertBefore(div, li.firstChild);

            div.appendChild(img);
            div.classList.add("image-container");
          }

          // Event listener for showing Track list on click on the Album-image-div:
          div.addEventListener("click", (event) => {
            event.preventDefault();
            handleTrackListButtonClick(
              item.id, // passes album-id to this function (we use album-id later to fetch individual tracks - Track list)
              item.name, // passes album name
              item.artists[0].name, // passes artist name
              item.images[0].url // passes album cover image url
            );
            console.log("Track list fetched via image.");
          });

          // Create a <div> for the text and append it:
          const textDivAlbum1 = createDiv();
          const textDivAlbum2 = createDiv();
          const textDivAlbum3 = createDiv();
          const textDivAlbum4 = createDiv();

          textDivAlbum1.textContent = `${item.name}`; // album name
          textDivAlbum2.textContent = `By: ${item.artists[0].name}`; // album author
          textDivAlbum3.textContent = `Release date: ${item.release_date}`;
          textDivAlbum4.textContent = `Album tracks number: ${item.total_tracks}`;

          const showMoreButton = document.createElement("button");

          li.append(textDivAlbum1, textDivAlbum2, textDivAlbum3, textDivAlbum4);
          li.appendChild(showMoreButton);
          showMoreButton.textContent = `Track list`;
          showMoreButton.classList.add("show-more-button");
          showMoreButton.setAttribute("id", "tracklist-button");

          li.classList.add("li-item-style", "result-flex-item");
          titleAlbums.classList.add("result-category"); // centered title "Albums:"
          textDivAlbum1.classList.add("result-item-name"); //bold, bigger font

          // Event listener for the button 'Track list':
          showMoreButton.addEventListener("click", (event) => {
            event.preventDefault();
            // Calls the function to fetch albums:
            handleTrackListButtonClick(
              item.id, // passes album-id to this function (we use album-id later to fetch individual tracks - Track list)
              item.name, // passes album name
              item.artists[0].name, // passes artist name
              item.images[0].url // passes album cover image url
            );

            console.log("Track list fetched via button.");
          });

          ulAlbums.appendChild(li);
          resultsContainer.appendChild(ulAlbums);
        });
      } else {
        const errorMessage = createDiv();
        resultsContainer.appendChild(errorMessage);
        errorMessage.textContent = `No albums found.`;
      }
    }

    //  - - - - - Check and display TRACKS / SONGS:  - - - - - - - - - - -

    function updateSongPlayingInfo(song, artist, album, image) {
      // Showing the cover of currently playing track's album:
      const musicWrapper = document.getElementById("music-wrapper");
      // Checking if there is already an album cover (from the previous track) and removing it:
      const existingAlbumCover =
        musicWrapper.querySelector(".album-cover-image");
      if (existingAlbumCover) {
        existingAlbumCover.remove();
      }

      const currentlyPlayingCover = document.createElement("div");
      currentlyPlayingCover.classList.add("album-cover-image");
      const img = document.createElement("img");
      const div = document.createElement("div");

      // Displaying album cover picture (if existing):
      if (image) {
        img.src = image;
      } else {
        img.src = "./pictures/image-placeholder3.png"; // Placeholder if no image
      }
      img.alt = `${album} Album Cover`;
      img.classList.add("result-image-playing");
      // div.classList.add("image-container");  // play-icon and pointer not needed on currently playing song cover
      div.appendChild(img);
      currentlyPlayingCover.appendChild(div);

      musicWrapper.insertBefore(currentlyPlayingCover, musicWrapper.firstChild);

      const currentTrackData = document.getElementById("current-play");
      currentTrackData.innerHTML = "";

      const currentTrackInfo = createDiv();
      const currentTrackInfoDiv1 = createDiv();
      const currentTrackInfoDiv2 = createDiv();
      const currentTrackInfoDiv3 = createDiv();
      const currentTrackInfoDiv4 = createDiv();
      const currentTrackInfoDiv5 = createDiv();

      currentTrackInfoDiv1.textContent = `${song}`;
      currentTrackInfoDiv2.textContent = `By:`;
      currentTrackInfoDiv3.textContent = `${artist}`;
      currentTrackInfoDiv4.textContent = `Album:`;
      currentTrackInfoDiv5.textContent = `${album}`;

      currentTrackInfoDiv1.classList.add("result-item-name");
      currentTrackInfoDiv3.classList.add("result-item-name");
      currentTrackInfoDiv5.classList.add("result-item-name");

      currentTrackInfo.appendChild(currentTrackInfoDiv1);
      currentTrackInfo.appendChild(currentTrackInfoDiv2);
      currentTrackInfo.appendChild(currentTrackInfoDiv3);
      currentTrackInfo.appendChild(currentTrackInfoDiv4);
      currentTrackInfo.appendChild(currentTrackInfoDiv5);

      currentTrackInfo.classList.add("current-track");
      currentTrackData.appendChild(currentTrackInfo);
    }

    // showing list of individual tracks/songs associated with the query:
    function showTracks(results) {
      const ulSongs = document.createElement("ul"); // create an unordered list for artists
      const titleSongs = document.createElement("h3"); // visible titles of each of the 3 result-sub-containers
      ulSongs.classList.add("flex-container-ol");

      ulSongs.appendChild(titleSongs);
      titleSongs.innerHTML = "Songs:";

      if (results.tracks && results.tracks.items.length > 0) {
        results.tracks.items.forEach((item) => {
          const li = document.createElement("li");
          const div = createDiv();
          const img = document.createElement("img");

          // Check if track's album has a cover picture and if first cover is available:
          if (item.album && item.album.images && item.album.images.length > 0) {
            img.src = item.album.images[0].url;
          } else {
            img.src = "./pictures/image-placeholder3.png"; // placeholder, if no image available
          }

          img.alt = `${item.name} Album Cover`;
          img.classList.add("result-image");

          // Insert the div-image before the text content:
          li.insertBefore(div, li.firstChild);
          div.appendChild(img);
          div.classList.add("image-container");

          div.addEventListener("click", (event) => {
            // if the icon of an individual song was clicked, playing starts.
            event.preventDefault();
            document
              .getElementById("currently-playing")
              .scrollIntoView({ behavior: "smooth", block: "start" });

            if (item.id) {
              currentTrackIndex = 0; // set tracks index to the 1st song: [0]
              playTrack(item.id); // calling the basic function to play current song index // changed to 'item.id'

              updateSongPlayingInfo(
                item.name,
                item.artists[0].name,
                item.album.name,
                item.album.images[0].url
              );
              // info on currently playing track

              document.getElementById("sound-pic").style.display = "none"; // static animation-picture is removed
              document.getElementById("sound-bars").style.display = "block"; // dynamic animation starts to move
            } else {
              console - log("Cannot fetch id:", item.id);
              audioPlayer.pause();
              updateSongPlayingInfo(
                // show track info, even if the song preview cannot be played.
                item.name,
                item.artists[0].name,
                item.album.name,
                item.album.images[0].url
              );
            }
          });

          // Create a <div> for the text and append it
          const textDivSong1 = createDiv();
          const textDivSong2 = createDiv();
          textDivSong1.textContent = `${item.name}`; // song name
          textDivSong2.textContent = `By: ${item.artists[0].name}`; // song performing artist

          const showMoreButton = document.createElement("button");

          li.append(textDivSong1, textDivSong2);

          li.appendChild(showMoreButton);
          showMoreButton.textContent = `Add to favorites`;
          showMoreButton.classList.add("show-more-button");
          showMoreButton.setAttribute("id", "add-to-playlist-button");

          li.classList.add("li-item-style", "result-flex-item");

          titleSongs.classList.add("result-category"); // centered title "Songs:"
          textDivSong1.classList.add("result-item-name"); // bold and bigger font

          [
            "track-id", // Attach track ID (dynamic value) to the play-button
            "preview-url", // Attach track URL (dynamic value) to the play-button
            "preview-trackname",
            "preview-artist",
            "preview-album",
            "preview-cover",
          ].forEach((attr, i) => {
            showMoreButton.setAttribute(
              // function transfers dynamic values to the attributes
              `data-${attr}`, // creates name of the attribute, f.e. 'data-track-id'...
              [
                item.id,
                item.preview_url,
                item.name,
                item.artists[0].name,
                item.album.name,
                item.album.images[0].url,
              ][i]
            );
          });

          const previewName = item.name;
          const previewArtist = item.artists[0].name;
          const previewAlbum = item.album.name;
          const previewUrl = item.preview_url;
          const previewImage = item.album.images[0].url;
          const trackId = item.id;
          const time = new Date().toLocaleDateString();

          showMoreButton.addEventListener("click", (event) => {
            event.preventDefault();

            addTask(
              previewArtist,
              previewName,
              previewAlbum,
              previewUrl,
              previewImage,
              time,
              trackId
            ); // individual buttons on each track card, can add item to favorites

            const listItem = showMoreButton.closest("li");
            displayFavoriteInfo(listItem, "🤍");

            showMoreButton.classList.add("hidden-element");
            // displayFavoriteInfo(listItem, "Track added.");
          });

          const savedList = localStorage.getItem("addedList");

          function checkIfFavorized(savedList) {
            let found = false;

            if (savedList) {
              const items = JSON.parse(savedList);
              items.forEach((item) => {
                if (
                  item.artist === previewArtist &&
                  item.song === previewName &&
                  item.album === previewAlbum
                ) {
                  found = true;
                  // showMoreButton.textContent = `🤍`;
                  const listItem = showMoreButton.closest("li");
                  displayFavoriteInfo(listItem, "🤍");
                  showMoreButton.classList.add("hidden-element");
                }
              });
              if (!found) {
                // showMoreButton.textContent = `Add to favorites`;
                console.log(`'${song}' not yet on the favorites list.`);
              }
            }
          }
          checkIfFavorized(savedList);

          ulSongs.appendChild(li);
          resultsContainer.appendChild(ulSongs);
        });
      } else {
        const errorMessage = createDiv();
        resultsContainer.appendChild(errorMessage);
        errorMessage.textContent = `No tracks found.`;
      }
    }

    // ------ Additional function to fetch albums (discography) by artist name: (linked by button Discography) ------
    // (not the same as usual search results, neither uses the same API):

    // Function showing all albums of an artist (as many as they exist):

    async function handleDiscographyButtonClick(artistId, artistName) {
      console.log("Artist ID & name:", artistId, artistName); // test

      try {
        // Fetch albums for the selected artist:
        const response = await fetch(`/api/artists/${artistId}/albums`);
        const results = await response.json();
        console.log("Fetched discography:", results);

        // Clear the previous results from the results-container:
        resultsContainer.innerHTML = "";

        // Create an unordered list for the artist's albums:
        const ulAlbums = document.createElement("ul");
        ulAlbums.classList.add("flex-container-ol");

        const titleAlbums = document.createElement("h3");
        titleAlbums.textContent = `Albums by ${artistName}:`;
        titleAlbums.classList.add("result-category");
        ulAlbums.appendChild(titleAlbums);

        if (results.items && results.items.length > 0) {
          results.items.forEach((album) => {
            const li = document.createElement("li");
            const div = createDiv();
            const img = document.createElement("img");

            const showMoreButton = document.createElement("button");

            if (album.images && album.images.length > 0) {
              img.src = album.images[0].url;
            } else {
              img.src = "./pictures/image-placeholder3.png"; // Placeholder if no image
            }
            img.alt = `${album.name} Album Cover`;
            img.classList.add("result-image");

            div.classList.add("image-container");
            div.appendChild(img);
            li.appendChild(div);

            // Event listener for showing 'Track list' on click on the Album-image-div:
            div.addEventListener("click", (event) => {
              event.preventDefault();
              handleTrackListButtonClick(
                album.id, // passes album-id to this function (we use album-id later to fetch individual tracks - Track list)
                album.name, // passes album name
                album.artists[0].name, // passes artist name
                album.images[0].url // passes album cover image url
              );
              console.log("Track list fetched via image.");
            });

            // Create a <div> for the text and append it:
            // const textDivAlbum1 = createDiv();
            // const textDivAlbum2 = createDiv();
            // const textDivAlbum3 = createDiv();
            // const textDivAlbum4 = createDiv();
            // --> short:
            const [textDivAlbum1, textDivAlbum2, textDivAlbum3, textDivAlbum4] =
              Array(4)
                .fill()
                .map(() => document.createElement("div"));

            textDivAlbum1.textContent = `${album.name}`;
            textDivAlbum2.textContent = `By: ${album.artists[0].name}`;
            textDivAlbum3.textContent = `Release date: ${album.release_date}`;
            textDivAlbum4.textContent = `Album tracks number: ${album.total_tracks}`;

            li.append(
              textDivAlbum1,
              textDivAlbum2,
              textDivAlbum3,
              textDivAlbum4
            );

            li.appendChild(showMoreButton);
            showMoreButton.textContent = `Track list`;
            showMoreButton.classList.add("show-more-button");
            showMoreButton.setAttribute("id", "tracklist-button");

            // add event-listener to the button 'Track list' under each album:
            showMoreButton.addEventListener("click", (event) => {
              event.preventDefault();
              // Calls the function to fetch albums:
              handleTrackListButtonClick(
                album.id, // passes album-id to this function (we use album-id later to fetch individual tracks - Track list)
                album.name, // passes album name
                album.artists[0].name, // passes artist name
                album.images[0].url // passes album cover image url
              );

              console.log(album);
            });

            li.classList.add("li-item-style", "result-flex-item");
            textDivAlbum1.classList.add("result-item-name"); // bold and bigger font
            ulAlbums.appendChild(li);
          });

          // Append the list to the results container:
          resultsContainer.appendChild(ulAlbums);
          // focus on the results-field:
          document
            .getElementById("search-results")
            .scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          // Show a message if no albums are found:
          displayMessage(
            resultsContainer,
            "Cannot display albums for this artist."
          );
        }
      } catch (error) {
        console.error("Error fetching discography:", error);
        displayMessage(resultsContainer, "Error fetching discography.");
      }
    }

    // ------------- Additional function to display Album's Track list based on Album-id: ---------------------------

    async function handleTrackListButtonClick(
      albumId,
      albumName,
      albumArtist,
      albumImageUrl
    ) {
      console.log("Album ID:", albumId);

      // // after the Track-list button was clicked, narrowing the form with Tracks (to avoid empty space on each side):

      if (narrowForm === false) {
        formResultsContainerTracks.style.width = "50%";
        formResultsContainerTracks.style.margin = "4% auto";
        narrowForm = true;
      }

      try {
        // Fetch tracks from selected album:
        const tracksResponse = await fetch(`/api/albums/${albumId}/tracks`);
        const tracksData = await tracksResponse.json();

        console.log(tracksData);

        // Clear the previous results from the results-container:
        resultsContainer.innerHTML = "";

        // Create an unordered list to show all album's tracks:
        const ulTracks = document.createElement("ul");
        ulTracks.classList.add("flex-container-tracks");

        // const titleTracks1 = document.createElement("h3");
        // const titleTracks2 = document.createElement("h3");
        // const titleSmall = document.createElement("h4");
        // const img = document.createElement("img");
        // const div = createDiv();
        // --> short:
        const [titleTracks1, titleTracks2, titleSmall, img, imgContainer] = [
          "h3",
          "h3",
          "h4",
          "img",
          "div",
        ].map((tag) => document.createElement(tag));

        // separate album name and artist name into 2 rows:
        titleTracks1.textContent = `${albumName}`;
        titleTracks1.classList.add("result-category");
        titleTracks2.textContent = `Album by: ${albumArtist}`;
        titleTracks2.classList.add("result-category");
        titleSmall.textContent = `Track list:`;

        // displaying album cover picture before all tracks:
        if (albumImageUrl) {
          img.src = albumImageUrl;
        } else {
          img.src = "./pictures/image-placeholder3.png"; // placeholder, if no image available
        }
        img.alt = `${albumName} Album Cover`;
        img.classList.add("result-image");

        // imgContainer.classList.add("image-container");  // removing play-icon from the album cover, as we cannot play full album.
        imgContainer.setAttribute("id", "img-div");
        imgContainer.appendChild(img);

        // *functions playPrev i playNext deleted - not used in this version

        // Continue with the main function - handleTrackListButtonClick:

        // adding child-elements to the ulTracks:
        // short:
        [titleTracks1, titleTracks2, imgContainer, titleSmall].forEach((el) =>
          ulTracks.appendChild(el)
        );

        // Loop through each track, and add each track as list item to the displayed list:
        tracksData.items.forEach((track) => {
          const li = document.createElement("li");
          const div = createDiv();
          div.textContent = `${track.track_number}. ${track.name}`;
          li.classList.add("li-item-style", "form-theme", "item-card3");

          li.classList.add("result-item-name", "result-flex-item");

          const playButton = document.createElement("button");
          playButton.textContent = `Play  ▶`;
          playButton.classList.add("play-button", "play-starter", "button50");

          // Save important data about playing track via playButton attributes:
          // (so they can be fetched later from the clicked button (playbutton / playSymbol): track URL, name, artist, album, cover):
          // short:
          [
            "track-id", // arbitrary attribute names in which we save values ("data-track-id") - f.e. Attach track ID to play-button
            "preview-url", // Attach track URL to play-button...
            "preview-trackname",
            "preview-artist",
            "preview-album",
            "preview-cover",
          ].forEach((attr, i) => {
            playButton.setAttribute(
              `data-${attr}`,
              [
                track.id, // fetched values that we save into attributes
                track.preview_url,
                track.name,
                albumArtist,
                albumName,
                albumImageUrl,
              ][i]
            );
          });

          const showMoreButton = document.createElement("button");

          showMoreButton.textContent = `Add to favorites`;
          showMoreButton.classList.add(
            "show-more-button",
            "add-button",
            "button50"
          ); // add-button for adding a track to the favorites list (and later to playlists)
          showMoreButton.setAttribute("id", "add-to-playlist-button");

          // adding properties/attributes to the Add-to-playlist-button:
          // const trackId = playSymbol.getAttribute("data-track-id");  -> short:
          [
            "track-id", // Attach track ID (dynamic value) to the play-button
            "preview-url", // Attach track URL (dynamic value) to the play-button
            "preview-trackname",
            "preview-artist",
            "preview-album",
            "preview-cover",
          ].forEach((attr, i) => {
            showMoreButton.setAttribute(
              // function transfers dynamic values to the attributes
              `data-${attr}`, // creates name of the attribute, f.e. 'data-track-id'...
              [
                track.id,
                track.preview_url,
                track.name,
                albumArtist,
                albumName,
                albumImageUrl,
              ][i]
            );
          });

          const previewName = track.name;
          const previewArtist = albumArtist;
          const previewAlbum = albumName;
          const previewUrl = track.preview_url;
          const previewImage = albumImageUrl;
          const trackId = track.id;

          showMoreButton.addEventListener("click", (event) => {
            event.preventDefault();

            const time = new Date().toLocaleDateString();

            addTask(
              previewArtist,
              previewName,
              previewAlbum,
              previewUrl,
              previewImage,
              time,
              trackId
            ); // item can be added to Favorites by clicking on buttons in individual track's cards

            const listItem = showMoreButton.closest("li");
            displayFavoriteInfo(listItem, "🤍");

            showMoreButton.classList.add("hidden-element");
          });

          // li.appendChild(div);
          // li.appendChild(playButton); // NEW! PLAYBUTTON for individual tracks - enables playing preview of the track (30 sec)
          // li.appendChild(showMoreButton);
          // short:
          [div, playButton, showMoreButton].forEach((element) =>
            li.appendChild(element)
          );

          const savedList = localStorage.getItem("addedList");

          function checkIfFavorized(savedList) {
            let found = false;

            if (savedList) {
              const items = JSON.parse(savedList);
              items.forEach((item) => {
                if (
                  item.artist === previewArtist &&
                  item.song === previewName &&
                  item.album === previewAlbum
                ) {
                  found = true;

                  const listItem = showMoreButton.closest("li");
                  displayFavoriteInfo(listItem, "🤍");
                  showMoreButton.classList.add("hidden-element");
                }
              });
              if (!found) {
                console.log(`'${song}' not yet on the favorites list.`);
              }
            }
          }
          checkIfFavorized(savedList);

          ulTracks.appendChild(li);
        });

        // Append the list to the results container:
        resultsContainer.appendChild(ulTracks);

        let index = 0;

        const trackList = document.querySelectorAll(".play-button"); // Assuming that every play-button in each <li> has this class

        trackList.forEach((button) => {
          button.addEventListener("click", (event) => {
            // playing individual song by pressing song's play-button
            // find <li> parent
            const listItem = button.closest("li");
            // find index
            // Filtriraj samo <li> elemente unutar roditelja
            const listItems = Array.from(
              listItem.parentElement.children
            ).filter((child) => child.tagName === "LI");

            index = listItems.indexOf(listItem); // we are changing index, according to the real index of the currently play-clicked song

            // For test- show index of the current <li>, whose play-button was clicked:
            console.log("index:", index); // index is shown correctly for each song on the list (0, 1, 2, 3...)
            playTrack(tracksData.items[index].id); // MODIFIED 29.11. after API DEPRICATION
            console.log("tracksData: ", tracksData);
            updateCurrentlyPlayingInfo(index);
            // return index;
          });
        });

        let currentTrackIndex = 0;

        // function to update info on currently playing track (when playing the whole album):
        function updateCurrentlyPlayingInfo(trackIndex) {
          // Showing the cover of currently playing track's album:
          const musicWrapper = document.getElementById("music-wrapper");

          if (document.getElementById("review").value !== "") {
            document.getElementById("review").value = "";
          }

          // Cheking if there is already an album cover (from the previous track) and removing it:
          const existingAlbumCover =
            musicWrapper.querySelector(".album-cover-image");
          if (existingAlbumCover) {
            existingAlbumCover.remove();
          }

          const currentlyPlayingCover = document.createElement("div");
          currentlyPlayingCover.classList.add("album-cover-image");
          const img = document.createElement("img");
          const div = document.createElement("div");

          // Displaying album cover picture (if existing):
          if (albumImageUrl) {
            img.src = albumImageUrl;
          } else {
            img.src = "./pictures/image-placeholder3.png"; // Placeholder if no image
          }

          img.alt = `${albumName} Album Cover`;
          img.classList.add("result-image-playing");
          // div.classList.add("image-container");

          div.appendChild(img);
          currentlyPlayingCover.appendChild(div);

          musicWrapper.insertBefore(
            currentlyPlayingCover,
            musicWrapper.firstChild
          );

          const currentTrackData = document.getElementById("current-play");
          currentTrackData.innerHTML = "";

          const currentTrackInfo = createDiv();

          const currentTrackInfoDiv1 = createDiv();
          const currentTrackInfoDiv2 = createDiv();
          const currentTrackInfoDiv3 = createDiv();
          const currentTrackInfoDiv4 = createDiv();
          const currentTrackInfoDiv5 = createDiv();

          currentTrackInfoDiv1.textContent = `${tracksData.items[trackIndex].name}`;
          currentTrackInfoDiv2.textContent = `By:`;
          currentTrackInfoDiv3.textContent = `${tracksData.items[trackIndex].artists[0].name}`;
          currentTrackInfoDiv4.textContent = `Album:`;
          currentTrackInfoDiv5.textContent = `${albumName}`;

          currentTrackInfoDiv1.classList.add("result-item-name");
          currentTrackInfoDiv3.classList.add("result-item-name");
          currentTrackInfoDiv5.classList.add("result-item-name");

          currentTrackInfo.appendChild(currentTrackInfoDiv1);
          currentTrackInfo.appendChild(currentTrackInfoDiv2);
          currentTrackInfo.appendChild(currentTrackInfoDiv3);
          currentTrackInfo.appendChild(currentTrackInfoDiv4);
          currentTrackInfo.appendChild(currentTrackInfoDiv5);

          currentTrackInfo.classList.add("current-track");
          currentTrackData.appendChild(currentTrackInfo);

          // ***
          // NEW 03.11. ADDED FUNCTION WHICH PASSES VALUES TO THE mainAddToPlaylist-button (in audio-player):
          const previewName = tracksData.items[trackIndex].name;
          const previewArtist = tracksData.items[trackIndex].artists[0].name;
          const previewAlbum = albumName;
          // const time = new Date().toLocaleDateString();
        }

        /* Adding event-listeners on all Play-buttona & icons: */
        // give eventlistener to each play-button and each play-icone wich has a class "play-starter":
        const playStarters = document.querySelectorAll(".play-starter");

        playStarters.forEach((playSymbol) => {
          playSymbol.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent default button behavior

            // focus on audio-player:
            document
              .getElementById("currently-playing")
              .scrollIntoView({ behavior: "smooth", block: "start" });

            // Fetch the preview-URL from the clicked button (playbutton / playSymbol) + other data about playing track (artist, album, cover):

            // const trackId = playSymbol.getAttribute("data-track-id");      // Attach track ID to button -> will be used for track URI in SDK player
            // const previewUrl = playSymbol.getAttribute("data-preview-url");       // Attach track preview url to button
            // const previewName = playSymbol.getAttribute("data-preview-trackname");    // Attach track name to button
            // const previewArtist = playSymbol.getAttribute("data-preview-artist");    // Attach artist to button
            // const previewAlbum = playSymbol.getAttribute("data-preview-album");    // Attach album to button
            // const previewCover = playSymbol.getAttribute("data-preview-cover");    // Attach track cover to button
            // short:
            const [
              trackId,
              previewUrl,
              previewName,
              previewArtist,
              previewAlbum,
              previewCover,
            ] = [
              "track-id", // data-track-id
              "preview-url", // data-preview-url
              "preview-trackname", // data-preview-...
              "preview-artist",
              "preview-album",
              "preview-cover",
            ].map((attr) => playSymbol.getAttribute(`data-${attr}`));

            // if there is a previewUrl, we play this url in audio-player ( -> function playTrack(previewUrl) ):
            if (previewUrl) {
              console.log("Playing track preview from URL:", previewUrl);
              // Call playTrack with the preview URL:
              playTrack(trackId); // 29.11. changed
              console.log("Playing track:", previewName);
              console.log("Artist:", previewArtist);
              console.log("Album:", previewAlbum);
              console.log("Cover:", previewCover);
            } else {
              console.error("No preview URL available for this track.");
            }

            // ** Logic for showing info on currently playing song(-preview) (info was transferred via Play-button):

            // Show the cover of currently playing track's album:
            const musicWrapper = document.getElementById("music-wrapper");

            // Check if there is already an album cover (from the previous track) and removing it:
            const existingAlbumCover =
              musicWrapper.querySelector(".album-cover-image");
            if (existingAlbumCover) {
              existingAlbumCover.remove();
            }

            const currentlyPlayingCover = document.createElement("div");
            currentlyPlayingCover.classList.add("album-cover-image");
            const img = document.createElement("img");
            const div = document.createElement("div");

            // Show album cover picture (if existing):
            if (previewCover) {
              img.src = previewCover;
            } else {
              img.src = "./pictures/image-placeholder3.png"; // Placeholder if no image
            }

            img.alt = `${previewAlbum} Album Cover`;
            img.classList.add("result-image-playing");
            // div.classList.add("image-container");  // play-icon and pointer not needed on currently playing song cover

            div.appendChild(img);
            currentlyPlayingCover.appendChild(div);

            musicWrapper.insertBefore(
              currentlyPlayingCover,
              musicWrapper.firstChild
            );

            // Add info about currently playing song into audio-player:
            const currentTrackData = document.getElementById("current-play");

            // REMOVE all info about previous song:
            currentTrackData.innerHTML = "";

            const currentTrackInfo = createDiv();

            const currentTrackInfoDiv1 = createDiv();
            const currentTrackInfoDiv2 = createDiv();
            const currentTrackInfoDiv3 = createDiv();
            const currentTrackInfoDiv4 = createDiv();
            const currentTrackInfoDiv5 = createDiv();

            currentTrackInfoDiv1.textContent = `${previewName}`;
            currentTrackInfoDiv2.textContent = `By:`;
            currentTrackInfoDiv3.textContent = `${previewArtist}`;
            currentTrackInfoDiv4.textContent = `Album:`;
            currentTrackInfoDiv5.textContent = `${previewAlbum}`;

            currentTrackInfoDiv1.classList.add("result-item-name"); // bold and bigger font for the song name
            currentTrackInfoDiv3.classList.add("result-item-name");
            currentTrackInfoDiv5.classList.add("result-item-name");

            currentTrackInfo.appendChild(currentTrackInfoDiv1);
            currentTrackInfo.appendChild(currentTrackInfoDiv2);
            currentTrackInfo.appendChild(currentTrackInfoDiv3);
            currentTrackInfo.appendChild(currentTrackInfoDiv4);
            currentTrackInfo.appendChild(currentTrackInfoDiv5);

            currentTrackInfo.classList.add("current-track");
            currentTrackData.appendChild(currentTrackInfo);
          }); //  -> here ends inside function:  playSymbol.addEventListener("click", event)
        }); // -> here ends outer function:  playStarters.forEach(playSymbol)

        // Scroll to the results container to focus on the tracklist:
        document
          .getElementById("search-results")
          .scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (error) {
        console.error("Error fetching tracks:", error);
        displayMessage(resultsContainer, "Error fetching track list.");
      }
    } // -> here ends outer function: async handleTrackListButtonClick()

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // 29.11. NEW za embed-function:

    async function generateEmbed(trackId) {
      // Dinamically creating embed-code:
      const embedCode = `<iframe src="https://open.spotify.com/embed/track/${trackId}" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;

      // + add SCSS code for embed-element - modify width & height responsively via % or rem - in media queries

      // Show song preview in embed-element on the page:
      const container = document.getElementById("spotify-embed-container");
      container.innerHTML = embedCode;
    }

    // Function to play selected track preview in html-audio-player:
    async function playTrack(trackId) {
      console.log("trackId: ", trackId);

      if (!audioPlayer.paused) {
        audioPlayer.pause(); // pause if something is already playing before the playTrack-function (this should prevent 'abort'-errors in console)
      }

      generateEmbed(trackId);
    }
    // here ends the function playTrack(previewUrl) – which is inside of the bigger function Todo()

    // ____________________________________________________________

    // Load lists from localStorage on init:
    function loadLists() {
      list.innerHTML = "";
      const savedList = localStorage.getItem("addedList");
      // const savedFavorites = localStorage.getItem("favoritesList");

      if (savedList) {
        const items = JSON.parse(savedList);
        items.forEach((item) =>
          list.appendChild(
            createTask(
              item.artist,
              item.song,
              item.album,
              item.url,
              item.image,
              item.time,
              item.id
            )
          )
        );
      }
      console.log("savedList:", savedList);
      // return savedList;
    }

    // Save lists to localStorage:
    function saveLists() {
      const addedItems = [];
      list.querySelectorAll("li").forEach((item) => {
        // for each 'li', this function creates an object with keys and values (artist, song, rating etc.)
        addedItems.push({
          // & adds the object to the (initially empty) list:  []
          artist: item.querySelector(".artist").textContent, // uses text-content found under the class '.artist'
          song: item.querySelector(".song").textContent, // uses text-content found under the class '.song', etc.
          album: item.querySelector(".album").textContent,
          url: item.querySelector(".url").textContent, //  CANNOT READ PROPERTIES OF NULL
          image: item.querySelector(".image").textContent, //  CANNOT READ PROPERTIES OF NULL
          // rating: item.querySelector(".rating").textContent,
          time: item.querySelector(".time").textContent,
          id: item.querySelector(".id").textContent,
        });
      });

      localStorage.setItem("addedList", JSON.stringify(addedItems)); // saves the list as key, and it's value in local storage
      // console.log("addedItems:", addedItems);
    }

    // ______________________________________________________________________________

    // Creating new task / new item on a submit/play-list:

    function createTask(artist, song, album, url, image, time, id) {
      const item = document.createElement("li"); // list-element is only created and returned, but not yet added to the list
      console.log("Preview URL:", url);
      console.log("Preview time:", time);
      console.log("Preview image:", image);
      console.log("Preview id:", id);
      // const div = document.createElement("div");
      // div.classList.add("form-theme", "item-card");

      // values are fetched via the function 'addTask' and then saved into the card:
      item.innerHTML = `<div class="form-theme item-card2" > 
      <p class="item-fill3">  
      <span class="thin"> Song: </span> <span class="song">${song}</span> <br> 
      <span class="thin"> Artist:  </span> <span  class="artist">${artist}</span> <br> 
      <span class="thin"> Album:  </span> <span class="album">${album}</span> <br> 
      <span class="hidden-element url">${url}</span> <!-- Adding classes for url & image, but leaving them hidden -->
     <span class="hidden-element image">${image}</span> 
     <span class="hidden-element id">${id}</span> 
      <span class="thin"> Added on:  </span>   <span class="time">${time}</span><br> 
      </p>  </div>`;

      const itemCardDiv = item.querySelector(".item-card2"); // inside 'item', there is an item-card-div, & here we save this div into a variable

      // 18.11. new:
      const playButton = document.createElement("button");
      playButton.textContent = `Play  ▶`;
      playButton.classList.add(
        "play-button",
        "play-starter",
        "my-playlist-play", // play-button for items on 'My playlist'
        "item-fill3"
      );
      itemCardDiv.appendChild(playButton);

      function addRemoveButton(itemCardDiv) {
        const removeButton = document.createElement("button");

        removeButton.classList.add(
          "remove-button",
          "item-fill3",
          "remove-button-playlist"
        );
        removeButton.textContent = "Remove from list";
        removeButton.addEventListener("click", removeTask);

        itemCardDiv.insertBefore(removeButton, itemCardDiv.firstChild);
      }

      // adding remove-button into the item-card-div
      addRemoveButton(itemCardDiv);

      // NEW 24.11.:
      playAndUpdateFavTrack(); // function which adds event-listener to play-buttons

      // console.log("Here executes the createTask function.");
      return item;
    }

    function playAndUpdateFavTrack() {
      let index = 0; // order-number of the song on the album
      const trackList = document.querySelectorAll(".my-playlist-play");
      //  Targeting all play-buttons in all list-items on 'My playlist'

      trackList.forEach((playbutton) => {
        // each button (on each list-item)
        // console.log(`Adding event listener to button ${index + 1}:`, button);
        playbutton.addEventListener("click", (event) => {
          event.preventDefault();
          document
            .getElementById("currently-playing")
            .scrollIntoView({ behavior: "smooth", block: "start" });
          // find <li> parent:
          const listItem = playbutton.closest("li");

          // Fetch needed data from <li> (list-item):
          const song = listItem.querySelector(".song").textContent;
          const artist = listItem.querySelector(".artist").textContent;
          const album = listItem.querySelector(".album").textContent;
          const image = listItem.querySelector(
            ".hidden-element.image"
          ).textContent;
          const url = listItem.querySelector(".hidden-element.url").textContent;
          const id = listItem.querySelector(".hidden-element.id").textContent;

          console.log("Extracted data:", {
            song,
            artist,
            album,
            image,
            url,
            id,
          });

          // find index: filter only <li>-elements inside parent:
          const listItems = Array.from(listItem.parentElement.children).filter(
            (child) => child.tagName === "LI"
          );
          index = listItems.indexOf(listItem); // we are changing index, according to the real index of the currently play-clicked song
          // For test- show index of the current <li>, whose play-button was clicked:
          console.log("index:", index); // index is shown correctly for each song on the list (0, 1, 2, 3...)
          console.log("listItems:", listItems);
          console.log("Song data:", { song, artist, album, image, url, id });

          if (!url) {
            console.error("URL for selected song was not found:", {
              song,
              artist,
              album,
            });
            return; // exit the function if URL is missing
          }
          playTrack(id); // tracksData – list of items  // 29.11. changed from (url) to (id)

          // updateCurrentlyPlayingInfo(index);
          updateSongPlayingInfo(song, artist, album, image);
          // return listItems;
          // audioPlayer.addEventListener("ended", playNextTrack);

          let currentTrackIndex = 0; // entering new variable, another different  ‘index’
        });
      }); // here ends the tracklist.forEach(button)-function
    }

    // Adding new task on the list - this function just fetches values (and then, they will be added to card in next function 'createTask'):
    function addTask(artist, song, album, url, image, time, id) {
      // const time = new Date().toLocaleDateString();

      const item = createTask(artist, song, album, url, image, time, id); // here the item is already created - not yet! added into html-Node-list

      console.log(
        "Fetched data about new favorized song:",
        artist,
        song,
        album,
        url,
        image,
        time
      );

      function addIf(item) {
        let found = false;
        list.querySelectorAll("li").forEach((element) => {
          if (
            element.querySelector(".artist").textContent === artist &&
            element.querySelector(".song").textContent === song &&
            element.querySelector(".album").textContent === album
          ) {
            found = true;
            console.log(
              `'${song}' is already on the list. Function addTask wanted to add it 2nd time, but not allowed.`
            );
          }
        });
        if (!found) {
          list.appendChild(item); // this function is adding the 'list-item' on the list
          console.log(`Added '${song}' on the favorites list.`);
        }
      }

      addIf(item);

      // list.appendChild(item);
      // console.log("Here was executed the addTask function.");

      saveLists();
      console.log(
        "Saved data about new favorized song:",
        artist,
        song,
        album,
        url,
        image,
        time
      );
    }

    this.init = function () {
      loadLists();
    };

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

      removeButton.closest("li").remove(); // removes html-element from the DOM
      console.log("Removed a list item from the list.");
      saveLists();
    }
  }
  // here ends Todo function.

  const todo = new Todo();

  window.addEventListener("load", todo.init);
})();

// IN ADDITION AFTER THE MAIN FUNCTION, global functions:

// if page reloaded, scroll back to the first element:
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("first-container")
    .scrollIntoView({ behavior: "smooth", block: "start" });
});

// If backspace pressed when not focused on Input field,
document.addEventListener("keydown", function (event) {
  const activeElement = document.activeElement;
  if (
    event.key === "Backspace" &&
    !(activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA")
  ) {
    event.preventDefault(); // prevent usual Backspace-key task (for deleting)
    document
      .getElementById("first-container")
      .scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

// -> here ends index.js code (Immediately Invoked Function Expression - it uses encapsulation).

// -------------------------------------------------------------------------------------------------------

/* Spotify’s Player API - https://developer.spotify.com/documentation/web-api/tutorials/getting-started

*/
