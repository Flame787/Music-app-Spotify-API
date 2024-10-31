// NEW BRANCH "PLAYLIST" - for playlist functionalities
// 27.10. changes merged from the latest branch "SEARCH_TYPES" into the "master" branch.
// After that, based on newly updated 'master' branch, here continues the new 'PLAYLIST' branch.

(function () {
  function Todo() {
    const buttonPlay = document.querySelector(".play-button");
    const submitToListButton = document.querySelector(".add-button");
    const list = document.getElementById("added-list"); // first list (ul) that gets tasks appended
    const favoritesList = document.getElementById("fav_albums"); // second list (ul) with favorite songs
    const searchInput = document.getElementById("search-all-input");
    // const searchButton = document.getElementById("submit-button");
    const resultsContainer = document.getElementById("results-container"); // container for results
    const searchAllButton = document.getElementById("search-all-button");
    // const searchForm = document.getElementById("search-form");
    const formContainer = document.getElementById("zero-input");
    const formResultsContainerTracks = document.getElementById(
      "form-results-container"
    );

    const audioPlayer = document.getElementById("audio-player");
    const prevButton = document.getElementById("prev-button");
    const nextButton = document.getElementById("next-button");

    let narrowForm = false;

    function createDiv() {
      return document.createElement("div");
    }
    // function createLine() {
    //   return document.createElement("hr");
    // }

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
    // OVO SE BAŠ NE KORISTI, VEZANO UZ ČUDNU funkciju fetchSuggestions2 ??:
    const artistInput = document.getElementById("artist");
    const songInput = document.getElementById("song");
    const albumInput = document.getElementById("album");
    const resultsList = document.getElementById("results");

    // ---------------------- FUNCTIONS FOR HANDLING SEARCH INPUT ------------------------------------- //

    searchAllButton.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent the default form submission
      handleSearch(); // call handleSearch() instead of displaySearchResults
    });

    // Key press on Enter kbd key is also calling the handleSearch() function:
    searchInput.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault(); // Prevent form submission on Enter
        handleSearch(); // call handleSearch() instead of displaySearchResults
      }
    });

    // Funcion for warning if the input-field is empty:
    function displayMessage(container, text) {
      const message = document.createElement("p");
      message.textContent = text;
      message.classList.add("warning-message");
      container.appendChild(message); // ("Please enter your query" - in red letters)
    } // OVA FUNKCIJA RADI OK 25.10.

    // 25.10.: helper (middleman) function in order to FETCH and DISPLAY results, and to focus on the Search results
    // this function CALLS other important functions: checkCategories(query) -> fetchSearchResults -> await displaySearchResults(query):

    async function handleSearch() {
      const query = searchInput.value.trim(); // fetch the input value
      // container near the input field

      // remove earlier warning messages (if any):
      formContainer.querySelector(".warning-message")?.remove();

      // show the initially hidden form with all results:
      formResultsContainerTracks.style.display = "block";

      if (query.length >= 1) {
        console.log("Form submitted");
        console.log("Query:", query); // 25.10. - THIS WORKS IN CONSOLE-LOG

        // function which expands the result-form back to 80% if user presses Search button again:
        if (narrowForm === true) {
          formResultsContainerTracks.style.width = "80%";
          // formResultsContainerTracks.style.margin = "4% auto";
          narrowForm = false;
        }

        // calls the 1. function which handles INPUT:
        // checkCategories(query);
        // NOVO 25.10. - here we are calling the NEW FUNCTION checkCategories,
        // which sends different API fetch calls, depending on chosen type/category of results
        checkCategories(query); // Get the selected type
        console.log("handleSearch called"); // poziva se jednom, to je ok, ali nakon toga krene beskonačna petlja :(

        // Put focus on the results-container:
        document
          .getElementById("search-results")
          .scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        displayMessage(formContainer, "Please enter your query.");
      }
    }

    // preuzeto od 23-10. i dorađeno - funkcija koja RASPISUJE RAZLIČITE SLUČAJEVE ODABIRA TYPES (kategorija rezultata):

    let selectedType;

    function checkCategories(query) {
      // searchAllButton.addEventListener("click", async(event) => {
      //   event.preventDefault();

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

      console.log("Selected type:", selectedType); // ovo se isto samo jednom ispiše na početku

      // Call 2. function: 'fetchSearchResults', and hand over to her argumets, which are here available: query & selectedType
      // Call fetchSearchResults and return its value
      // fetchSearchResults(query, selectedType);
      fetchSearchResults(query, selectedType);
      //  catch (error) {
      //   console.error("Error fetching search results:", error);
      //   }
      // );
    }

    // 25.10. - PRIKAZUJU SE SAMO artistInput, IAKO SE NE ODABERE NIJEDAN POSEBAN TYPE (TREBALO BI SE PRIKAZATI SVE 3)
    // KAD JE ODABRAN NEKI OD 3 WebTransportBidirectionalStream, UOPĆE SE NE PRIKAŽU REZULTATI (MOŽDA SE DOGODI default, TO BI TREBALO SPRIJEČITI?)
    // I DISKOGRAPHY BUTTON NE RADI -> prikaže se Fetched discography u konzoli, ali ne na stranici

    ///////_______________ Function to send Api-request for Search results - from Frontend to Backend: __________________//////////////////////

    // Function fetchSearchResults = dynamically implements selected search-categories ('types') into the API-link:
    // (if the 'type' is not set, it will be a default value: 'artist,album,track)
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
        displaySearchResults(data, type); // Pass the data directly to the display function
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
      // 2. function which handles OUTPUT:
      // await displaySearchResults(query, selectedType); // CALLS the 'displaySearchResults' function
      // --> which will handle and show results, depending on chosen type/category of results
    }

    ///// Function to show/display all fetched Search-results on the page:
    // POPRAVITI OVU FUNKCIJU, TAKO DA PRIKAŽE DOHVAĆENE REZULTATE NA STRANICI:

    function displaySearchResults(data, type) {
      resultsContainer.innerHTML = ""; // Clear previous results

      console.log("Function displaSearchResults received this type:", type);
      console.log("Data received:", data); // Log the results   ---> 25.10. rezultati se prikažu u konzoli, ali ne i na displayu

      // Check if the result is empty:
      if (
        !data
        // !data ||
        // (!data.artists.items.length &&
        //   !data.albums.items.length &&
        //   !data.tracks.items.length)
      ) {
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

    // Results displaying, depending on API-data structure:

    // - - - - - - Check and display ARTISTS: - - - - - - - - - - - - -

    // --> ovisno koji je odabrani selectedType:

    // 25.10. NEW function - odvojeno prikazuje samo ARTISTE:

    function showArtists(results) {
      // if (results && results.length > 0) {
      //   console.log("showArtist function:", results); // ovo je ok, pojavi se u konzoli, znači da se funkcija showArtist poziva i dobije podatke.

      const ulArtists = document.createElement("ul"); // create an unordered list for artists
      const titleArtists = document.createElement("h3"); // visible titles of each of the 3 result-sub-containers
      ulArtists.classList.add("flex-container-ol");

      ulArtists.appendChild(titleArtists);
      titleArtists.innerHTML = "Artists:"; // staviti nakon uvjeta za ARTISTS

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
            img.src = "./pictures/image-placeholder.jpg"; // path to my placeholder image
          }
          img.alt = `${item.name} Artist`;
          img.classList.add("result-image");

          // Insert the div-image before the text content:
          li.insertBefore(div, li.firstChild);
          div.appendChild(img);
          div.classList.add("image-container-artist");

          // Event listener for showing Discography on click on the artist-image-div:
          div.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent default button behavior
            handleDiscographyButtonClick(item.id, item.name); // Calls the function to fetch albums and passes the artist-id & name to the function
            // koristit ćemo ovaj API: const response = await fetch(`/api/albums/${albumId}/tracks`);
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

          // Event listener for the Discography button:
          showMoreButton.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent default button behavior
            handleDiscographyButtonClick(item.id, item.name); // Calls the function to fetch albums and passes the artist-id & name to the function
            // koristit ćemo ovaj API: const response = await fetch(`/api/albums/${albumId}/tracks`);
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
          resultsContainer.appendChild(ulArtists); // -> ovo je ok, događa se kako treba.
        });
      } else {
        const errorMessage = createDiv();
        resultsContainer.appendChild(errorMessage);
        errorMessage.textContent = `No artists found.`;
      }
    }

    //  - - - - - Check and display ALBUMS:  - - - - - - - - - - - - - - - -
    // DODATI UVJET DA SE PRIKAŽE SAMO AKO SU ALBUMI BILI TRAŽENI (ILI SVE 3):

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
            event.preventDefault(); // Prevent default button behavior
            handleTrackListButtonClick(
              item.id, // passes album-id to this function (we use album-id later to fetch individual tracks - Track list)
              item.name, // passes album name
              item.artists[0].name, // passes artist name
              item.images[0].url // passes album cover image url
            );
            console.log("Track list fetched via image.");
            // OVDJE JOŠ DODATI I NOVU FUNKCIJU DA ODMAH SVIRA PRVU PJESMU S ODABRANOG ALBUMA!

            // -> CIJELU OVU FUNKCIJU DODATI I U FUNKCIJU handleDiscography, JER SE I TAMO POZIVA
          });

          // Create a <div> for the text and append it:
          const textDivAlbum1 = createDiv();
          const textDivAlbum2 = createDiv();
          const textDivAlbum3 = createDiv();
          const textDivAlbum4 = createDiv();

          textDivAlbum1.textContent = `${item.name}`; // NAZIV ALBUMA
          textDivAlbum2.textContent = `By: ${item.artists[0].name}`;
          textDivAlbum3.textContent = `Release date: ${item.release_date}`;
          textDivAlbum4.textContent = `Album tracks number: ${item.total_tracks}`;
          // li.appendChild(textDivAlbum);

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
            event.preventDefault(); // Prevent default button behavior
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
    // DODATI UVJET DA SE PRIKAŽE SAMO AKO SU TRACKSI BILI TRAŽENI (ILI SVE 3):

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
            img.alt = `${item.name} Album Cover`;
            img.classList.add("result-image");

            // Insert the div-image before the text content:
            li.insertBefore(div, li.firstChild);

            // li.insertBefore(img, li.firstChild);
            div.appendChild(img);
            div.classList.add("image-container");
          }

          // Create a <div> for the text and append it
          const textDivSong1 = createDiv();
          const textDivSong2 = createDiv();
          textDivSong1.textContent = `${item.name}`; // NAZIV PJESME
          textDivSong2.textContent = `By: ${item.artists[0].name}`;

          const showMoreButton = document.createElement("button");

          li.append(textDivSong1, textDivSong2);

          li.appendChild(showMoreButton);
          showMoreButton.textContent = `Add to playlist`;
          showMoreButton.classList.add("show-more-button");
          showMoreButton.setAttribute("id", "add-to-playlist-button");

          li.classList.add("li-item-style", "result-flex-item");

          titleSongs.classList.add("result-category"); // centered title "Songs:"
          textDivSong1.classList.add("result-item-name"); // bold and bigger font

          ulSongs.appendChild(li);
          resultsContainer.appendChild(ulSongs);
        });
      } else {
        const errorMessage = createDiv();
        resultsContainer.appendChild(errorMessage);
        errorMessage.textContent = `No tracks found.`;
      }

      // --> ovo doraditi za Tracks, dodati Playsymbol/Playbutton i ostale opcije koje su kasnije definirane
    }

    // ------------ Additional function to fetch albums (discography) by artist name: (linked by button Discography) --------------------------------
    // 25.10. - ovo je ok, može ostati, jer je zasebna funkcija za prikaz samo izbora albuma od pojedinog autora
    // (nije isto kao obični search rezultati, niti koristi isti API):

    // FUNKCIJA RADI I PRIKAŽE SVE ALBUME ZA ODABRANOG ARTISTA, KOLIKO GOD ALBUMA POSTOJI:

    async function handleDiscographyButtonClick(artistId, artistName) {
      console.log("Artist ID & name:", artistId, artistName); // - ovo se prikazuje u konzoli, znači da su values dobro prenesene ovamo:

      try {
        // Fetch albums for the selected artist
        // const results = await fetchSearchResults(artistName, type);
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
              img.src = "./pictures/image-placeholder.jpg"; // Placeholder if no image
            }
            img.alt = `${album.name} Album Cover`;
            img.classList.add("result-image");

            div.classList.add("image-container");
            div.appendChild(img);
            li.appendChild(div);

            // Event listener for showing Track list on click on the Album-image-div:
            div.addEventListener("click", (event) => {
              event.preventDefault(); // Prevent default button behavior
              handleTrackListButtonClick(
                album.id, // passes album-id to this function (we use album-id later to fetch individual tracks - Track list)
                album.name, // passes album name
                album.artists[0].name, // passes artist name
                album.images[0].url // passes album cover image url
              );
              console.log("Track list fetched via image.");
              // OVDJE JOŠ DODATI I NOVU FUNKCIJU DA ODMAH SVIRA PRVU PJESMU S ODABRANOG ALBUMA!
            });

            // Create a <div> for the text and append it:
            // const textDivAlbum1 = createDiv();
            // const textDivAlbum2 = createDiv();
            // const textDivAlbum3 = createDiv();
            // const textDivAlbum4 = createDiv();
            // skraćeno:
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

            // new: add event-listener to the button 'Track list' under each album:
            showMoreButton.addEventListener("click", (event) => {
              event.preventDefault(); // Prevent default button behavior
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
          // 25.10. - OVO SE PRIKAZUJE na samoj stranici, NEKA GREŠKA U handleDiscography funkciji
        }
      } catch (error) {
        console.error("Error fetching discography:", error);
        displayMessage(resultsContainer, "Error fetching discography.");
      }
    }

    // ------------- Additional function to display album's Track list based on album-id: ---------------------------
    // 25.10. - ovo je isto ok, može ostati, jer je zasebna funkcija za prikaz samo Tracklista s odabranog albuma
    // (nije isto kao obični search rezultati, niti koristi isti API):

    async function handleTrackListButtonClick( // OVA FUNKCIJA RADI NA PRITISAK BUTTONA, I U NJOJ PLAY BUTTON -> PREVIEW PLAYER RADI :D :)
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
        // Fetch tracks ffrom selected album:
        // const results = await fetchSearchResults(artistName, "album");
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
        // skraćeno:
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
          img.src = "./pictures/image-placeholder.jpg"; // placeholder, if no image available
        }
        img.alt = `${albumName} Album Cover`;
        img.classList.add("result-image");

        imgContainer.classList.add("image-container");
        imgContainer.setAttribute("id", "img-div");
        imgContainer.appendChild(img);

        // tu su bile funkcije playPrev i playNext

        // ADDING EVENT-LISTENER TO THE IMG-CONTAINER - ON CLICK, IT SHOULD START PLAYING THE FULL ALBUM FROM THE 1ST SONG:
        imgContainer.addEventListener("click", (event) => {
          event.preventDefault();
          document
            .getElementById("currently-playing")
            .scrollIntoView({ behavior: "smooth", block: "start" });

          if (tracksData.items[currentTrackIndex].preview_url) {
            currentTrackIndex = 0; // When album cover image was clicked, set tracks index to the 1st song: [0]
            playFullAlbum(tracksData.items[currentTrackIndex].preview_url);
            updateCurrentlyPlayingInfo(currentTrackIndex);
          } else {
            console.error(
              "Nema dostupnog track URL-a za prvu pjesmu:",
              tracksData.items[currentTrackIndex].name
            );
          }
        });

        // Continue with the main function - handleTrackListButtonClick:

        // adding child-elements to the ulTracks:
        // skraćeno:
        [titleTracks1, titleTracks2, imgContainer, titleSmall].forEach((el) =>
          ulTracks.appendChild(el)
        );

        // Loop through each track, and add each track as list item to the displayed list:
        tracksData.items.forEach((track) => {
          const li = document.createElement("li");
          const div = createDiv();
          div.textContent = `${track.track_number}. ${track.name}`;
          li.classList.add("li-item-style");
          li.classList.add("result-item-name", "result-flex-item");

          const playButton = document.createElement("button");
          playButton.textContent = `Play  ▶`; // NEW - PLAY-button
          playButton.classList.add("play-button", "play-starter");

          // Save important data about playing track via playButton attributes:
          // (so they can be fetched later from the clicked button (playbutton / playSymbol): track URL, name, artist, album, cover):
          // skraćeno:
          [
            "track-id", // Attach track ID to play-button
            "preview-url", // Attach track URL to play-button
            "preview-trackname",
            "preview-artist",
            "preview-album",
            "preview-cover",
          ].forEach((attr, i) => {
            playButton.setAttribute(
              `data-${attr}`,
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

          const showMoreButton = document.createElement("button");
          showMoreButton.textContent = `Add to playlist`;
          showMoreButton.classList.add("show-more-button");
          showMoreButton.setAttribute("id", "add-to-playlist-button");

          // NEW 31.10. - adding properties/attributes to the Add-to-playlist-button:
          [
            "track-id", // Attach track ID to play-button
            "preview-url", // Attach track URL to play-button
            "preview-trackname",
            "preview-artist",
            "preview-album",
            "preview-cover",
          ].forEach((attr, i) => {
            showMoreButton.setAttribute(
              `data-${attr}`,
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

          // li.appendChild(div);
          // li.appendChild(playButton); // NEW! PLAYBUTTON for individual tracks - enables playing preview of the track (30 sec)
          // li.appendChild(showMoreButton);
          // skraćeno:
          [div, playButton, showMoreButton].forEach((element) =>
            li.appendChild(element)
          );

          // ** LATER ADD EVENT LISTENER FOR THE 3RD FUNCTION - ADD TO LIST!
          // (define which multiple variables it passes to the function Add to playlist)
          // - f.e. track.name, albumName, albumArtist, albumImageUrl, track.duration_ms, track.is_playable (true / false)

          ulTracks.appendChild(li);
        });

        // Append the list to the results container:
        resultsContainer.appendChild(ulTracks);

        // 31.10. - dodavanje buttona za Preview/Next song:
        prevButton.addEventListener("click", (event) => {
          event.preventDefault(); // Prevent default button behavior
          playPreviousTrack();
        });
        nextButton.addEventListener("click", playNextTrack); // 30.10. next-button works!

        // NEW 31.10. - getting real index of each song on the track list (fetching single list-items via play-buttons):

        let index = 0;

        const trackList = document.querySelectorAll(".play-button"); // Assuming that every play-button in each <li> has this class

        trackList.forEach((button) => {
          button.addEventListener("click", (event) => {
            // find <li> parent
            const listItem = button.closest("li");
            // find index
            // Filtriraj samo <li> elemente unutar roditelja
            const listItems = Array.from(
              listItem.parentElement.children
            ).filter((child) => child.tagName === "LI");

            index = listItems.indexOf(listItem); // we are changin index, according to the real index of the currently play-clicked song

            // For test- show index of the current <li>, whose play-button was clicked:
            console.log("index:", index); // index is shown correctly for each song on the list (0, 1, 2, 3...)
            playTrack(tracksData.items[index].preview_url);
            updateCurrentlyPlayingInfo(index);
            // return index;
          });
        });

        // let currentTrackIndex = 0; // first song on the album

        audioPlayer.addEventListener("ended", playNextTrack);

        function playNextTrack() {
          // (only the 1st song is played by the basic function playTrack, but each next song is started by this function: playNextTrack)
          // Increase the song index, in order to play the 2. song on the album, then the 3., and so on...
          index++;

          // Check if the currentTrackIndex is smaller, than the total number of items on the track-list:
          if (index < tracksData.items.length) {
            const currentTrack = tracksData.items[index]; // save current song index into a shorter expression

            // Check if the current song has a playable preview_url:
            if (currentTrack.preview_url) {
              playTrack(currentTrack.preview_url); // calling the basic function to play current song index in audio-player
              updateCurrentlyPlayingInfo(index); // update info on currently playing track
              //new:
              document.getElementById("sound-pic").style.display = "none";
              document.getElementById("sound-bars").style.display = "block";

              console.log("Next song started:", currentTrack.name);
            } else {
              console.log(
                "Preview URL for the next song is missing. Skipping to next song."
              );
              playNextTrack(); // Try all over again with the next song
            }
          } else {
            console.log("Reproduction is finished.");
            index = 0;
            // Sets index back to 0, so if the album cover image is clicked again, the whole album reproduction starts over.
          }
        }

        let currentTrackIndex = 0;

        function playFullAlbum() {
          // (only the 1st song is played by the basic function playTrack, but each next song is started by this function: playNextTrack)
          // Increase the song index, in order to play the 2. song on the album, then the 3., and so on...
          // As we are starting from the 1st song on the album, index also has to come down to 0 (so if we later use playNext-function, it will work ok):
          index = 0;
          // Check if the currentTrackIndex is smaller, than the total number of items on the track-list:
          if (currentTrackIndex < tracksData.items.length) {
            const currentTrack = tracksData.items[currentTrackIndex]; // save current song index into a shorter expression

            // Check if the current song has a playable preview_url:
            if (currentTrack.preview_url) {
              playTrack(currentTrack.preview_url); // calling the basic function to play current song index in audio-player
              updateCurrentlyPlayingInfo(currentTrackIndex); // update info on currently playing track
              //new:
              document.getElementById("sound-pic").style.display = "none";
              document.getElementById("sound-bars").style.display = "block";
              console.log(
                "Reproducing album track:",
                currentTrack.name,
                " - currentTrackIndex:",
                currentTrackIndex,
                "index:",
                index
              );
              currentTrackIndex++;
            } else {
              console.log(
                "Preview URL for the next song is missing. Skipping to next song."
              );
              playNextTrack(); // Try all over again with the next song
            }
          } else {
            console.log("Reproduction is finished.");
            currentTrackIndex = 0;
            // Sets index back to 0, so if the album cover image is clicked again, the whole album reproduction starts over.
          }
        }

        function playPreviousTrack() {
          // Decrease the song index, in order to play previous song...
          currentTrackIndex--;

          // Check if the currentTrackIndex is bigger, than the total number of items on the track-list:
          if (currentTrackIndex >= 0) {
            const currentTrack = tracksData.items[currentTrackIndex]; // save current song index into a shorter expression

            // Check if the current song has a playable preview_url:
            if (currentTrack.preview_url) {
              playTrack(currentTrack.preview_url); // calling the basic function to play current song index in audio-player
              updateCurrentlyPlayingInfo(currentTrackIndex); // update info on currently playing track
              console.log("Previous song started:", currentTrack.name);
            } else {
              console.log(
                "Preview URL for the previous song is missing. Skipping to next song."
              );
              playPreviousTrack(); // Try all over again with the next song
            }
          } else {
            console.log("Reproduction is finished.");
            // currentTrackIndex = 0;
            // Sets index back to 0, so if the album cover image is clicked again, the whole album reporoduction starts over.
          }
        }

        // function to update info on currently playing track (when playing the whole album):
        function updateCurrentlyPlayingInfo(trackIndex) {
          // Showing the cover of currently playing track's album:
          const musicWrapper = document.getElementById("music-wrapper");

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
            img.src = "./pictures/image-placeholder.jpg"; // Placeholder if no image
          }

          img.alt = `${albumName} Album Cover`;
          img.classList.add("result-image");
          div.classList.add("image-container");

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
          currentTrackInfoDiv5.textContent = `${tracksData.name}`;

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
            // skraćeno:
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
              // Call playTrack with the preview URL
              playTrack(previewUrl);
              console.log("Playing track:", previewName);
              console.log("Artist:", previewArtist);
              console.log("Album:", previewAlbum);
              console.log("Cover:", previewCover);
            } else {
              console.error("No preview URL available for this track.");
            }

            // ** Logic for showing info on currently playing song(-preview) (info was transferred via Play-button):

            // Showing the cover of currently playing track's album:
            const musicWrapper = document.getElementById("music-wrapper");

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
            if (previewCover) {
              img.src = previewCover;
            } else {
              img.src = "./pictures/image-placeholder.jpg"; // Placeholder if no image
            }

            img.alt = `${previewAlbum} Album Cover`;
            img.classList.add("result-image");
            div.classList.add("image-container");

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

    // Function to play selected track preview in html-audio-player:
    function playTrack(previewUrl) {
      if (!audioPlayer.paused) {
        audioPlayer.pause(); // pasue if something is already playing before the playTrack-function (this should prevent 'abort'-errors in console)
      }
      // audio source is the selected track's URL:
      audioPlayer.src = previewUrl;

      // Load the new track (*needed if the source is changing dynamically):
      audioPlayer.load();

      // Automatically play the track after loading:
      setTimeout(() => {
        audioPlayer
          .play()
          .then(() => {
            console.log("Track is playing");
            document.getElementById("sound-pic").style.display = "none";
            document.getElementById("sound-bars").style.display = "block";
          })
          .catch((error) => {
            const noPreview = createDiv();
            currentPlay = document.getElementById("current-play");
            noPreview.textContent = `No preview available for this track.`;
            noPreview.classList.add("warning-message");
            currentPlay.appendChild(noPreview);
            console.error("Error playing track:", error);
          });
      }, 50);
    }
    // here ends the function playTrack(previewUrl) – which is inside of the bigger function Todo()

    // Event listener to show gif when audio starts playing again after pause
    audioPlayer.addEventListener("playing", () => {
      document.getElementById("sound-pic").style.display = "none";
      document.getElementById("sound-bars").style.display = "block";
    });

    // Event listener for pausing to switch back to the static image
    audioPlayer.addEventListener("pause", () => {
      document.getElementById("sound-pic").style.display = "block";
      document.getElementById("sound-bars").style.display = "none";
    });

    // ____________________________________________________________

    // Event-listener for tracking entry in all 3 fields with these categories:
    // [artistInput, songInput, albumInput].forEach((input) => {
    //   input.addEventListener("input", () => {
    //     const query = input.value.trim();
    //     if (query.length > 0)
    //       // fetchSuggestions2(query);  // OVA FUNKCIJA SE BAŠ NE KORISTI?
    //     } else {
    //       resultsList.innerHTML = ""; // clean results if entry is empty
    //     }
    //   });
    // });

    // ------------------------------------------------------------------------
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

    // ______________________________________________________________________________

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
      // buttonPlay.addEventListener("click", playSong);
      loadLists();
    };

    // ***** Call init function when the DOM is fully loaded
    // document.addEventListener("DOMContentLoaded", this.init.bind(this));

    // Set initial theme when the page loads
    document.addEventListener("DOMContentLoaded", function () {
      const defaultTheme = "theme0"; // Set your default theme here
      changeTheme(defaultTheme);
    });

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

// -> here ends index.js code! (it is an Immediately Invoked Function Expression - it uses encapsulation).

// __________________________________________________________________________________________________________________________________________________________________

// 13.10.2024. RADI PREVIEW, svira na audio-playeru - npr.   Judas Priest - Album: Screaming for Vengeance / Led Zeppelin - Album: Led Zeppelin

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

// ------------------------ NEXT STEPS TO DO: ----------------------------------------------------------------------------------

// + dodati button play (IKONA preko slike, na HOVER) - DONE
// + dodati button 'discography' za artiste, 'tracks' za albume i 'add to list' za songse - DONE
// -> ovi buttoni kod rezultata izvršavaju daljnje radnje ili otvaraju novi sadržaj - dodati im funkcije
// -> jedino artist nema te buttone, nego ima button za "explore music" ili slično, čime se otvaraju 10 njegovih albuma i pjesama.
// + dodati funkciju da se nakon pritiska na search button ili Enter tipku odmah fokusira na dobivene rezultate (pomak fokusa) - DONE
// + brojke staviti uz same list-iteme, a ne na početak retka (smanjiti width list-itema?) - bez brojki!
// + tamo gdje se ne pojavljuju slike (jer ih nema) staviti neku placeholder-sliku ili obavijest da slika nedostaje. - DONE

// - list iteme na manjim rezolucijama poredati prvo 2 u redak, pa tek onda 1 u redak - NOT YET WORKING!
// + list-itemi bi trebali imati donju marginu veću na manjim rezolucijama, da se vertikalno više razdvoje međusobno - DONE

// + buttonići - boja u nekim temama nije dovoljno kontrastna od pozadine - treba biti svjetlija ili tamnija nijansa da se buttonići istaknu više - DONE

// + u Copper temi i Night temi i Frost tema staviti kontrastno: staviti bijela slova unutar formsa, a ne crna jer se ne vide - DONE
// + Energy tema - crna su slova, ali treba ih malo podebljati - DONE, povećan h3 font-size za cijeli app

// možda (nice to have): dodati "expended search"?? - button kojim se pretraga po nekoj kategoriji može povećati, pa prikaže gradijalno na svaki click još 10 rezultata.

// + dodijeli zasebne IDs buttonima Discography / Track list / Add to playlist - DONE

/* NOVI TASKS (06.10.2024.):

+ dati dodatni id buttonu Discography (za Artist-rezultate) - DONE -> id: "discography-button"
+ prevent default
+ dodati event listener
+ novi Api call kad se klikne na button Discography:
+ dohvaća albume i pjesme samo od odabranog artista (q = artist, a parametri su slično kao i dosad za albume i pjesme)
+ umjesto rezultata, u tom formu se prikažu albumi dohvaćeni s apija, 
+ dohvaćeni albumi imaju sve parametre kao i u Results, i imaju button Track list (i isto ih se može svirati) - DONE
- dodati da se prikažu i pjesme tog artista, dohvaćene s apija, i imaju buttone Add to playlist
** trenutno postoje 2x event-listener za Discography button, svaki unutar jedne funkcije - provjeriti koji je dovoljan (+ prilagoditi), a koji brišemo

+ dati dodatni id buttonu Track list (za Tracks-rezultate) - DONE -> id: "tracklist-button"
+ prevent default
+ dodati event listener
+ novi Api call kad se klikne na button Track list:
+ dohvaća pjesme samo sa odabranog albuma i prikaže ih redom 
+ umjesto rezultata, u tom formu se prikažu redom pjesme sa odabranog albuma dohvaćene s apija, 
+ pjesme s play-buttonom da se mogu odmah pojedinačno svirati
+ dodatni button koji pokreće Play all - cijeli album
+ pjesme imaju i buttone Add to playlist 
- dodati funkcionalnost svim Add to playlist buttonima:
(3. funkcija, ona preuzima neke podatke o pjesmi, poslane putem show-more-button-event-handlera, i prikazuje odabrane pjesme na novoj playlisti)
- kod ispisa Track list, img s coverom albuma još nema mogućnost play-ikone preko slike na hover, vidjeti zašto se to nije prenijelo (fali neka klasa ili sl.)?

+ dati dodatni id buttonu Add to playlist (za Songs-rezultate) - DONE -> id: "tracklist-button"
- prevent default
- dodati event listener
- pjesme se dodaju na donju trenutno aktivnu Playlistu koju se može dalje obrađivati, te na 2. stranicu: My playlists (i kasnije možda čak spremaju u bazu)

- na 2. stranici (Favorites) pjesma iz aktualne playliste se može dodati u bilo koju već postojeću playlistu, ili se može kreirati nova playlista:

"NEW SONG" 
- 1. ADD TO AN EXISTING PLAYLIST -> 2. CHOOSE... (DROPDOWN OF ALL PLAYLIST NAMES) - 3. ADD TRACK -> 4. info se pojavi (običan tekst): TRACK ADDED.
/ - 1. ADD TO A NEW PLAYLIST -> 2. NAME: _____________ - 3. SAVE PLAYLIST -> 4. info se pojavi (običan tekst): TRACK ADDED.



+ Play button transparent image preko slike - podesiti da se pojavi kad se hovera preko bilo kojeg dijela li (list itema), 
tako da cijeli list item ima opciju hover, a ne samo img - DONE

Spotify’s Player API - https://engineering.atspotify.com/2022/04/spotifys-player-api/

Get Playback State: https://developer.spotify.com/documentation/web-api/reference/get-information-about-the-users-current-playback

Get Playback State
Transfer Playback
Get Available Devices
Get Currently Playing Track
Start/Resume Playback
Pause Playback
Skip To Next
Skip To Previous
Seek To Position
Set Repeat Mode
Set Playback Volume
Toggle Playback Shuffle
Get Recently Played Tracks
Get the User's Queue
Add Item to Playback Queue


+ napravi funkciju playSong() koja ima ove podfunkcije:
+ event-listener kad se klikne na bilo koji dio cijelog li (list itema), pokrene se player
+ automatski se fokus prebaci u donji form gdje je Audio player i pjesma počne svirati
- volume je automatski set na 50% ili manje
+ pjesma se može zaustaviti na play/pause
+ u prozoru Playera se pojavi slika covera albuma s kojeg je pjesma
- opcije premotavanja? Vidjeti jel ih Player ima
- opcije Next / Back (iduća ili ranija pjesma)? (onda dohvaća sljedeći ili prethodni item s liste tog albuma) - moguće da postoji api-endpoint za to, ili preko petlje koja prolazi kroz cijelu listu na tom albumu
+ ispod Playera piše dinamički artist, album i song koji svira
+ Rate i Add to playlist buttoni su isto unutar Playera, blizu tog ispisa pjesme, i imaju svoje funkcije kao i prije (za dodavanje na listu) - samo podesiti da sad dohvaćaju podatke poslane s Api-ja

+ maknuti iz Search-forma opcije Artist, Album, Song i njihov kod preobličiti, tako da pod tim id-evima označava i sprema stvari dohvaćene s api-callova
+ umjesto njih, staviti opciju Search by: Artist, Album, Song kao neki checkbox-form, gdje korisnik može označiti jednu ili više stvari i dobiva samo djelomične api-rezultate ovisno o kategorijama koje je označio (modifikacija već postojećeg Searcha)
+ napraviti da Results nije stalno vidljiv na stranici, nego tek nakon što je korisnik kliknuo na Search i bio je unesen bar 1 znak

- preobličiti funkciju Add to favorites, osmisliti logiku gdje se spremaju i bilježe playliste (možda na 2. podstranici)
- i koja je razlika između Favorites i obične playliste? Ocjene? Samo da bi se zabilježilo najbolje stvari ikad na jednu veliku posebnu listu?
- playliste - i dalje bi imale button Add to favorites i Remove, ali sad se prikazuje i slika album covera, s ikonom Play koja radi
- na koji način sortirati pjesme na listi? Možda dodati neke decentne buttone samo sa strelicama za Up/Down kod svake pjesme?
- Favorites pjesme -  dodati na vrh liste button koji služi kao filter:
       Order by: A to Z, Z to A, Rate
- da li napraviti da je Rate promjenjiv na listi Favorites???
- podstranice s My playlists i Favorites imaju također Audio Player u donjem dijelu i radi na isti princip kao i na prvoj stranici (fokusira se na njega i on svira pjesme redom kojim su na toj playlisti, a ne više redom po trackovima dohvaćenim s apija)
- može biti spremljeno više playlist i možemo svakoj playlisti dati ime
dok uređujemo playlistu prvi put, ona se sprema dolje na prvoj stranici i vidljiva je dok traje cookie (često i nakon nekoliko sessiona),
na 1. stranici kod playliste je button 'See all playlists' koji vodi na 2. podstranicu, i na njoj se također sprema dinamički ova playlista, i spremljene su prethodne liste
playlista ostaje spremljena (možda u bazi - trajno?) na 2. stranici (My playlists) i tu se može dalje uvijek slušati i modificirati 

+ suziti širinu prvog forma u kojem je Search (nema potrebe da je tako širok i glomazan, dok ostali mogu biti kako jesu široki)
+ suziti širinu Search-input polja i Search-buttona, te prilagoditi za nekoliko media queriesa

+ Results container/form je trenutno stalno vidljiv jer je hardkodiran na idex.html-u - učiniti da je nevidljiv, i da se prikazuje samo kad se dohvate neki rezultati

26./27.10. - radi Discography button i implementirano do kraja pretraga po kategorijama - sve radi.

Next steps:

Add to playlist
Favorite playlist
- funkcije obraditi

srediti stranicu Playlists
spremanje listi tamo

nice to have:
Filtriranje i search po spremljenim listama
premještanje itema na listi
ocjenjivanje i editiranje ocjena

dodati:
+ klik na artista (ime) baca na Discography
+ play ikona na slikama još ne radi, dodati istu funkciju kao i play button

Što ako kliknemo na Play na slici banda ii artista? -> otvara se njegova Diskografija.

Što ako kliknemo na Play na slici albuma? Trebalo bi otvoriti album (Tracklist) i odmah početi svirati prvu pjesmu s albuma, i nastaviti svirati ostale pjesme.

Što ako kliknemo na Play na slici Track lista? odmah početi svirati prvu pjesmu s albuma, i nastaviti svirati ostale pjesme.

SCSS THEMES ZA DODATI / MIJENJATI:

1conical dark green with abstract-green theme - to bi bila najmračnija tema, prilagoditi buttone da budu malo tamniji isto

1gradient radial blue black with theme3 - isto jako tamna plava

fern wood with theme9 green

(i već su zamijenjene crvena i azure tema)

IZBACITI: 

theme8 teal orange

*/
