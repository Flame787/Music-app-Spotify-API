(function () { 

  function Todo() { 

    const buttonPlay = document.querySelector(".play-button"); 

    const submitToListButton = document.querySelector(".add-button"); 

    const list = document.getElementById("added-list"); // first list (ul) that gets tasks appended 

    const favoritesList = document.getElementById("fav_albums"); // second list (ul) with favorite songs 

    const searchInput = document.getElementById("search-all-input"); 

    const searchButton = document.getElementById("submit-button"); 

    // const searchForm = document.getElementById("search-form"); 

 

    // NOVO 20.10.: 

 

    this.device_id = null; // Globalna varijabla za device ID 

    this.player = null; // Globalna varijabla za Spotify Player 

 

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

 

    const artistInput = document.getElementById("artist"); 

    const songInput = document.getElementById("song"); 

    const albumInput = document.getElementById("album"); 

    const resultsList = document.getElementById("results"); 

 

    // NOVO: 

 

    // Add event listener to the search form 

    // document.getElementById('search-form').addEventListener('submit', function (e) { 

    //   console.log("Event listener triggered"); // Ovdje dodajte 

    //   e.preventDefault(); // Prevent form submission 

    //   const query = document.getElementById('search-all-input').value; // Get query from input 

    //   console.log("Query from input:", query); // Provjera vrijednosti 

    //   displaySearchResults(query); // Call the search results function 

    // }); 

 

    ///////_______________ Function to send Api-request for Search results - from Frontend to Backend: __________________////////////////////// 

 

    // if the 'type' is not set, it will be a default value: 'artist,album,track': 

    async function fetchSearchResults(query, type = "artist,album,track") { 

      try { 

        const response = await fetch(`/api/search?q=${query}&type=${type}`); 

        if (!response.ok) { 

          throw new Error("Failed to fetch results"); 

        } 

        const data = await response.json(); 

        return data; 

      } catch (error) { 

        console.error("Error fetching suggestions:", error); 

      } 

    } 

 

    // Funkcija za prikaz upozorenja ako je input-polje prazno: 

    function displayMessage(container, text) { 

      const message = document.createElement("p"); 

      message.textContent = text; 

      message.classList.add("warning-message"); // Optional: Add a class for styling 

      container.appendChild(message); // Append message to the container 

    } 

 

    ///////_______________  Function to display all fetched Search-results on the page: __________________////////////////////// 

 

    async function displaySearchResults(query) { 

      const resultsContainer = document.getElementById("results-container"); // Your container element 

      resultsContainer.innerHTML = ""; // Clear previous results 

 

      const results = await fetchSearchResults(query); 

      console.log(results); // Log the results to see what you get 

 

      // Provjera je li dobiveni rezultat prazan 

      if ( 

        !results || 

        (results.artists.items.length === 0 && 

          results.albums.items.length === 0 && 

          results.tracks.items.length === 0) 

      ) { 

        displayMessage(resultsContainer, "No results found."); 

        return; // Exit if all 3 results categories are undefined or empty 

      } 

 

      const ulArtists = document.createElement("ul"); // Create an unordered list for artists 

      const ulAlbums = document.createElement("ul"); // Create an ordered list for albums 

      const ulSongs = document.createElement("ul"); // Create an ordered list for songs 

      const titleArtists = document.createElement("h3"); 

      const titleAlbums = document.createElement("h3"); 

      const titleSongs = document.createElement("h3"); 

      // [titleArtists, titleAlbums, titleSongs].forEach(element => element.createElement("h4")); 

      // ulArtists.classList.add("flex-container"); 

      // ulAlbums.classList.add("flex-container"); 

      // ulSongs.classList.add("flex-container"); 

      [ulArtists, ulAlbums, ulSongs].forEach((element) => 

        element.classList.add("flex-container-ol") 

      ); 

 

      // show subtitle inside results: 

      ulArtists.appendChild(titleArtists); 

      titleArtists.innerHTML = "Artists:"; 

 

      // Results displaying, depending on API-data structure (...to be modified): 

 

      // Check and display ARTISTS: 

 

      if (results.artists && results.artists.items.length > 0) { 

        results.artists.items.forEach((item) => { 

          const li = document.createElement("li"); 

          const div = document.createElement("div"); //new 

          const img = document.createElement("img"); 

 

          // Provjera da li artist ima slike i da li je prva slika dostupna (if some is missing, doesn't matter, others will show up) 

          if (item.images && item.images.length > 0) { 

            img.src = item.images[0].url; // Set the image source 

          } else { 

            // Ako nema slika, postavi placeholder sliku: 

            img.src = "./pictures/image-placeholder.jpg"; // Put the path to your placeholder image here 

          } 

          img.alt = `${item.name} Artist`; 

          img.classList.add("result-image"); 

 

          // Insert the div-image before the text content: 

          li.insertBefore(div, li.firstChild); //new 

          div.appendChild(img); //new 

          div.classList.add("image-container"); //new 

 

          // Create a <div> for the text and append it: 

          const textDivArtist1 = document.createElement("div"); 

          const textDivArtist2 = document.createElement("div"); 

          // textDivArtist.textContent = `${item.name} - ${item.genres.join( 

          //   ", " 

          // )}`; 

          const showMoreButton = document.createElement("button"); // NEW - SHOW-MORE BUTTON 

 

          textDivArtist1.textContent = `${item.name}`; 

          li.appendChild(textDivArtist1); 

          textDivArtist2.textContent = `${item.genres.join(", ")}`; 

          li.appendChild(textDivArtist2); 

 

          li.appendChild(showMoreButton); // NEW - SHOW-MORE BUTTON 

          showMoreButton.textContent = `Discography`; // NEW - SHOW-MORE BUTTON 

          showMoreButton.classList.add("show-more-button"); // NEW - SHOW-MORE BUTTON 

          showMoreButton.setAttribute("id", "discography-button"); 

 

          // Event listener for the Discography button: 

          showMoreButton.addEventListener("click", (event) => { 

            event.preventDefault(); // Prevent default button behavior 

            handleDiscographyButtonClick(item.name); // Calls the function to fetch albums and passes artist-name to the function 

            console.log("discography fetched"); 

          }); 

 

          li.classList.add("li-item-style", "result-flex-item"); 

          titleArtists.classList.add("result-category"); // centered title "Artists:" 

          textDivArtist1.classList.add("result-item-name"); // bold and bigger font 

 

          ulArtists.appendChild(li); 

          resultsContainer.appendChild(ulArtists); 

        }); 

      } 

 

      ulAlbums.appendChild(titleAlbums); 

      titleAlbums.innerHTML = "Albums:"; 

 

      //  - - - - - Check and display ALBUMS:  - - - - - - - - - - - - - - - - - - - - - - 

 

      if (results.albums && results.albums.items.length > 0) { 

        results.albums.items.forEach((item) => { 

          const li = document.createElement("li"); 

          const div = document.createElement("div"); //new 

          const img = document.createElement("img"); 

 

          // Provjera da li artist ima slike i da li je prva slika dostupna (id some is missing, doesn't matter, others will show up) 

          if (item.images && item.images.length > 0) { 

            img.src = item.images[0].url; // Set the image source 

            img.alt = `${item.name} Album Cover`; 

            img.classList.add("result-image"); 

 

            // Insert the div-image before the text content: 

            li.insertBefore(div, li.firstChild); //new 

 

            // li.insertBefore(img, li.firstChild); 

            div.appendChild(img); //new 

            div.classList.add("image-container"); //new 

          } 

 

          // Create a <div> for the text and append it 

 

          const textDivAlbum1 = document.createElement("div"); 

          const textDivAlbum2 = document.createElement("div"); 

          const textDivAlbum3 = document.createElement("div"); 

          const textDivAlbum4 = document.createElement("div"); 

          // const [textDivAlbum1, textDivAlbum2, textDivAlbum3, textDivAlbum4] = Array.from({ length: 4 }, () => document.createElement("div")); 

          // li.textContent = `${item.name} - by: ${item.artists[0].name} - release date: ${item.release_date} - album tracks nr: ${item.total_tracks}`; 

          // li.appendChild(document.createTextNode(`${item.name} - by: ${item.artists[0].name} - release date: ${item.release_date} - album tracks nr: ${item.total_tracks}`)); 

          textDivAlbum1.textContent = `${item.name}`; 

          textDivAlbum2.textContent = `By: ${item.artists[0].name}`; 

          textDivAlbum3.textContent = `Release date: ${item.release_date}`; 

          textDivAlbum4.textContent = `Album tracks number: ${item.total_tracks}`; 

          // li.appendChild(textDivAlbum); 

 

          const showMoreButton = document.createElement("button"); // NEW - SHOW-MORE BUTTON 

 

          li.append(textDivAlbum1, textDivAlbum2, textDivAlbum3, textDivAlbum4); 

 

          li.appendChild(showMoreButton); // NEW - SHOW-MORE BUTTON 

          showMoreButton.textContent = `Track list`; // NEW - SHOW-MORE BUTTON 

          showMoreButton.classList.add("show-more-button"); // NEW - SHOW-MORE BUTTON 

          showMoreButton.setAttribute("id", "tracklist-button"); 

 

          li.classList.add("li-item-style", "result-flex-item"); 

          titleAlbums.classList.add("result-category"); // centered title "Albums:" 

          textDivAlbum1.classList.add("result-item-name"); // bold and bigger font 

 

          // Event listener for the 'Track list' button: 

          showMoreButton.addEventListener("click", (event) => { 

            event.preventDefault(); // Prevent default button behavior 

            // Calls the function to fetch albums: 

            handleTrackListButtonClick( 

              item.id, // passes album-id to this function (we use album-id later to fetch individual tracks - Track list) 

              item.name, // passes album name 

              item.artists[0].name, // passes artist name 

              item.images[0].url // passes album cover image url 

            ); 

 

            console.log("discography fetched"); 

          }); 

 

          ulAlbums.appendChild(li); 

          resultsContainer.appendChild(ulAlbums); 

        }); 

      } 

 

      ulSongs.appendChild(titleSongs); 

      titleSongs.innerHTML = "Songs:"; 

 

      //  - - - - - Check and display TRACKS / SONGS:  - - - - - - - - - - - - - - - - - - - - - - 

 

      if (results.tracks && results.tracks.items.length > 0) { 

        results.tracks.items.forEach((item) => { 

          const li = document.createElement("li"); 

          const div = document.createElement("div"); //new 

          const img = document.createElement("img"); 

 

          // Provjera da li artist ima slike i da li je prva slika dostupna (id some is missing, doesn't matter, others will show up) 

          if (item.album && item.album.images && item.album.images.length > 0) { 

            img.src = item.album.images[0].url; // Set the image source 

            img.alt = `${item.name} Album Cover`; 

            img.classList.add("result-image"); 

 

            // Insert the div-image before the text content: 

            li.insertBefore(div, li.firstChild); //new 

 

            // li.insertBefore(img, li.firstChild); 

            div.appendChild(img); //new 

            div.classList.add("image-container"); //new 

          } 

 

          // Create a <div> for the text and append it 

          const textDivSong1 = document.createElement("div"); 

          const textDivSong2 = document.createElement("div"); 

          textDivSong1.textContent = `${item.name}`; 

          textDivSong2.textContent = `By: ${item.artists[0].name}`; 

 

          const showMoreButton = document.createElement("button"); // NEW - SHOW-MORE BUTTON 

 

          li.append(textDivSong1, textDivSong2); 

 

          li.appendChild(showMoreButton); // NEW - SHOW-MORE BUTTON 

          showMoreButton.textContent = `Add to playlist`; // NEW - SHOW-MORE BUTTON 

          showMoreButton.classList.add("show-more-button"); // NEW - SHOW-MORE BUTTON 

          showMoreButton.setAttribute("id", "add-to-playlist-button"); 

 

          li.classList.add("li-item-style", "result-flex-item"); 

 

          titleSongs.classList.add("result-category"); // centered title "Songs:" 

          textDivSong1.classList.add("result-item-name"); // bold and bigger font 

 

          ulSongs.appendChild(li); 

          resultsContainer.appendChild(ulSongs); 

        }); 

      } 

    } 

 

    // ------------ New function to fetch albums (discography) by artist name: --------------------------------- 

    // (dodatno proširivanje rezultata -> klikom na Discography button – prikažu se albumi (diskografija) selectanog autora 

 

    async function handleDiscographyButtonClick(artistName) { 

      const resultsContainer = document.getElementById("results-container"); 

      try { 

        // Fetch albums for the selected artist 

        // const results = await fetchSearchResults(artistName, "album"); 

        const results = await fetchSearchResults(artistName); 

 

        // Clear the previous results from the results-container: 

        resultsContainer.innerHTML = ""; 

 

        // Create an unordered list for the artist's albums: 

        const ulAlbums = document.createElement("ul"); 

        ulAlbums.classList.add("flex-container-ol"); 

 

        const titleAlbums = document.createElement("h3"); 

        titleAlbums.textContent = `Albums by ${artistName}:`; 

        titleAlbums.classList.add("result-category"); 

        ulAlbums.appendChild(titleAlbums); 

 

        if (results.albums && results.albums.items.length > 0) { 

          results.albums.items.forEach((album) => { 

            const li = document.createElement("li"); 

            const div = document.createElement("div"); // For the image 

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

 

            // Create a <div> for the text and append it 

 

            // const textDivAlbum1 = document.createElement("div"); 

            // const textDivAlbum2 = document.createElement("div"); 

            // const textDivAlbum3 = document.createElement("div"); 

            // const textDivAlbum4 = document.createElement("div"); 

            // skraćeno: 

            const [textDivAlbum1, textDivAlbum2, textDivAlbum3, textDivAlbum4] = 

              Array(4) 

                .fill() 

                .map(() => document.createElement("div")); 

 

            textDivAlbum1.textContent = `${album.name}`; 

            textDivAlbum2.textContent = `By: ${album.artists[0].name}`; 

            textDivAlbum3.textContent = `Release date: ${album.release_date}`; 

            textDivAlbum4.textContent = `Album tracks number: ${album.total_tracks}`; 

 

            // const textDiv = document.createElement("div"); 

            // textDiv.textContent = `${album.name} - Released: ${album.release_date}`; 

            // textDiv.classList.add("result-item-name"); 

            // li.appendChild(textDiv); 

 

            li.append( 

              textDivAlbum1, 

              textDivAlbum2, 

              textDivAlbum3, 

              textDivAlbum4 

            ); 

 

            li.appendChild(showMoreButton); // NEW - SHOW-MORE BUTTON 

            showMoreButton.textContent = `Track list`; // NEW - SHOW-MORE BUTTON 

            showMoreButton.classList.add("show-more-button"); // NEW - SHOW-MORE BUTTON 

            showMoreButton.setAttribute("id", "tracklist-button"); 

            // new: add event-listener to the button 'Track list' under each album: 

 

            // ***COPY SAME showMoreButton.addEventListener FROM PREVIOUS PLACE WHERE IT WAS CALLED (IT SHOULD HAVE SAME FUNCTIONS ON ALL PLACES): 

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

        } else { 

          // Show a message if no albums are found: 

          displayMessage(resultsContainer, "No albums found for this artist."); 

        } 

      } catch (error) { 

        console.error("Error fetching discography:", error); 

        displayMessage(resultsContainer, "Error fetching discography."); 

      } 

    } 

 

    // ------------- New function to display album's Track list based on album-id: --------------------------- 

    // (dodatno proširivanje rezultata -> klikom na 'Track list' button nekog albuma – prikažu se pjesme s tog albuma) 

 

    let currentTrackUri = null; // Globalna varijanta za trackUri, definirana izvan funkcije 

 

    async function handleTrackListButtonClick( 

      albumId, 

      albumName, 

      albumArtist, 

      albumImageUrl 

    ) { 

      console.log("Album ID:", albumId); 

      const resultsContainer = document.getElementById("results-container"); 

      try { 

        // Fetch albums for the selected artist 

        // const results = await fetchSearchResults(artistName, "album"); 

        const tracksResponse = await fetch(`/api/albums/${albumId}/tracks`); 

        const tracksData = await tracksResponse.json(); 

 

        console.log(tracksData); 

 

        // Clear the previous results from the results-container: 

        resultsContainer.innerHTML = ""; 

 

        // Create an unordered list for the artist's albums: 

        const ulTracks = document.createElement("ul"); 

        ulTracks.classList.add("flex-container-tracks"); 

 

        // const titleTracks1 = document.createElement("h3"); 

        // const titleTracks2 = document.createElement("h3"); 

        // const titleSmall = document.createElement("h4"); 

        // const img = document.createElement("img"); 

        // const div = document.createElement("div"); 

 

        // skraćeno: 

        const [titleTracks1, titleTracks2, titleSmall, img, div] = [ 

          "h3", 

          "h3", 

          "h4", 

          "img", 

          "div", 

        ].map((tag) => document.createElement(tag)); 

 

        // razdvoji naslov: ime albuma i ime autora u 2 retka (jer su imena albuma često dugačka): 

        titleTracks1.textContent = `${albumName}`; 

        titleTracks1.classList.add("result-category"); 

        titleTracks2.textContent = `Album by: ${albumArtist}`; 

        titleTracks2.classList.add("result-category"); 

        titleSmall.textContent = `Track list:`; 

 

        // ?? trebamo li drugačiji (kraći, općenitiji) endpoint?? - https://api.spotify.com/v1/albums/{id} - možda da to uzmemo kao generalni 2. endpoint i za tracks? 

 

        // displaying album cover picture before all tracks: 

        if (albumImageUrl) { 

          img.src = albumImageUrl; 

        } else { 

          img.src = "./pictures/image-placeholder.jpg"; // Placeholder if no image 

        } 

        img.alt = `${albumName} Album Cover`; 

        img.classList.add("result-image"); 

 

        div.classList.add("image-container"); 

        div.appendChild(img); 

 

        // ulTracks.appendChild(titleTracks1); 

        // ulTracks.appendChild(titleTracks2); 

        // ulTracks.appendChild(div); // appenda se div sa slikom covera albuma 

        // ulTracks.appendChild(titleSmall); 

        // skraćeno: 

        [titleTracks1, titleTracks2, div, titleSmall].forEach((el) => 

          ulTracks.appendChild(el) 

        ); 

 

        // Loop through each track and add it to the displayed list: 

        tracksData.items.forEach((track) => { 

          const li = document.createElement("li"); 

          const div = document.createElement("div"); 

          div.textContent = `${track.track_number}. ${track.name}`; 

          li.classList.add("li-item-style"); 

          li.classList.add("result-item-name", "result-flex-item"); 

 

          const playButton = document.createElement("button"); 

          playButton.textContent = `Play  ▶`; // NEW - PLAY-BUTTON beneath each Track 

          playButton.classList.add("play-button", "play-starter"); 

 

          // Save important data about playing track via playButton attributes: 

          // (so they can be fetched later from the clicked button (playbutton / playSymbol): track URL, name, artist, album, cover): 

 

          // playButton.setAttribute("data-track-id", track.id); // Attach track ID to button 

          // playButton.setAttribute("data-preview-url", track.preview_url); // Attach track URL to button 

          // playButton.setAttribute("data-preview-trackname", track.name); // Attach track name to button 

          // playButton.setAttribute("data-preview-artist", albumArtist); // Attach artist to button 

          // playButton.setAttribute("data-preview-album", albumName); // Attach album to button 

          // playButton.setAttribute("data-preview-cover", albumImageUrl); // Attach track cover to button 

          // skraćeno: 

          [ 

            "track-id", 

            "preview-url", 

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

          showMoreButton.textContent = `Add to playlist`; // NEW - SHOW-MORE BUTTON 

          showMoreButton.classList.add("show-more-button"); // NEW - SHOW-MORE BUTTON 

          showMoreButton.setAttribute("id", "add-to-playlist-button"); 

 

          li.appendChild(div); 

          li.appendChild(playButton); // NEW! PLAYBUTTON ON INDIVIDUAL TRACKS! 

          li.appendChild(showMoreButton); // NEW - SHOW-MORE BUTTON 

 

          // ** LATER ADD EVENT LISTENER FOR THE 3RD FUNCTION - ADD TO LIST! 

          // (define which multiple variables it passes to the function Add to playlist) 

          // - f.e. track.name, albumName, albumArtist, albumImageUrl, track.duration_ms, track.is_playable (true / false) 

 

          ulTracks.appendChild(li); 

        }); 

 

        // Append the list to the results container: 

        resultsContainer.appendChild(ulTracks); 

 

        /* Dodavanje event-listenera na sve Play-buttone i ikone: */ 

 

        // Event-listener dati play-buttonu i svakoj play-ikoni putem klase "play-starter": 

        const playStarters = document.querySelectorAll(".play-starter"); 

 

        playStarters.forEach((playSymbol) => { 

          playSymbol.addEventListener("click", (event) => { 

            event.preventDefault(); // Prevent default button behavior 

 

            // focus on audio-player (title above the audio-player): 

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

              "track-id", 

              "preview-url", 

              "preview-trackname", 

              "preview-artist", 

              "preview-album", 

              "preview-cover", 

            ].map((attr) => playSymbol.getAttribute(`data-${attr}`)); 

 

            // Ako postoji previewUrl, sviramo taj link u audio-playeru: 

            // if (previewUrl) { 

            //   console.log("Playing track preview from URL:", previewUrl); 

            //   // Call playPreview with the preview URL 

            //   playPreview(previewUrl); 

 

            // Ako postoji cjelovit audiozapis odabrane pjesme, sviraj je: 

            // ** dodajemo formulu za trackUri: 

            const trackUri = `spotify:track:${trackId}`; // Kreiraš Spotify URI za pjesmu 

            console.log("Track URI:", trackUri); 

 

            // ovaj dio se dohvaća i prikazuje u konzoli 

            if (trackUri) { 

              console.log( 

                "Fetched track URI (to be played via SDK Player):", 

                trackUri 

              ); 

 

              // ove stvari ostaju iste, i dalje možemo na isti način dohvatiti podatke o tracku koji je izabran da svira (vrijedi isto kao i za preview): 

              console.log("Playing track:", previewName); 

              console.log("Artist:", previewArtist); 

              console.log("Album:", previewAlbum); 

              console.log("Cover:", previewCover); 

 

              // ** Logika prikaza informacija o trenutnoj pjesmi je i dalje ista (podaci su se prenijeli preko Play-buttona): 

 

              // Showing cover of currently playing track's album: 

              const musicWrapper = document.getElementById("music-wrapper"); 

 

              // Provjerava postoji li već slika albuma i uklanja je ako postoji: 

              const existingAlbumCover = 

                musicWrapper.querySelector(".album-cover-image"); 

              if (existingAlbumCover) { 

                existingAlbumCover.remove(); // Ukloni postojeću sliku albuma 

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

              // currentlyPlayingCover.innerHTML = ""; 

              currentlyPlayingCover.appendChild(div); 

              musicWrapper.insertBefore( 

                currentlyPlayingCover, 

                musicWrapper.firstChild 

              ); 

 

              // Add info about currently playing song into audio-player: 

              const currentTrackData = document.getElementById("current-play"); 

              // OČISTI prethodne podatke o pjesmi: 

              currentTrackData.innerHTML = ""; 

 

              const currentTrackInfo = document.createElement("div"); 

              // urediti taj div, dati mu neke bordere ili tamniju pozadinu 

              // smanjiti širinu playera na stranici (i svih formsa - preširoki su) 

 

              const currentTrackInfoDiv1 = document.createElement("div"); 

              const currentTrackInfoDiv2 = document.createElement("div"); 

              const currentTrackInfoDiv3 = document.createElement("div"); 

              const currentTrackInfoDiv4 = document.createElement("div"); 

              const currentTrackInfoDiv5 = document.createElement("div"); 

 

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

 

              currentTrackUri = trackUri; 

 

              // Call function playTrack() with the trackUri as argument: 

              playTrack(currentTrackUri); 

 

              //////////////////////////////////////////////////////////////////////////// 

 

              //  even if there is no previewUrl available, then just show preview's track name, artist, album name and cover: 

              // } else { 

              //   console.error("No preview URL available for this track."); 

 

              //  even if there is no playable link (no trackUri) available, then just show preview's track name, artist, album name and cover: 

            } else { 

              console.error("No audio available for this track."); // ovo kopirati i na kraj funkcija - kao info koji se pokaže na displayu 

 

              console.log("Track:", previewName); 

              console.log("Artist:", previewArtist); 

              console.log("Album:", previewAlbum); 

              console.log("Cover:", previewCover); 

 

              // Still add info about currently playing song into audio-player: 

              const currentTrackData = document.getElementById("current-play"); 

              const currentTrackInfo = document.createElement("div"); 

 

              const currentTrackInfoDiv1 = document.createElement("div"); 

              const currentTrackInfoDiv2 = document.createElement("div"); 

              const currentTrackInfoDiv3 = document.createElement("div"); 

 

              currentTrackInfoDiv1.textContent = `${previewName}`; 

              currentTrackInfoDiv2.textContent = `Artist: ${previewArtist}`; 

              currentTrackInfoDiv3.textContent = `Album: ${previewAlbum}`; 

 

              currentTrackInfo.appendChild(currentTrackInfoDiv1); 

              currentTrackInfo.appendChild(currentTrackInfoDiv2); 

              currentTrackInfo.appendChild(currentTrackInfoDiv3); 

 

              currentTrackInfo.classList.add("current-track"); 

              currentTrackData.appendChild(currentTrackInfo); 

            } 

            console.log("Track ID:", trackId); 

            console.log("Current track URI:", currentTrackUri); 

            // return trackId; 

            // return trackUri; 

          }); //  -> TU ZAVRŠAVA unutarnja FUNKCIJA:  playSymbol.addEventListener("click", (event) => {} 

          // return trackId; 

        }); // -> TU ZAVRŠAVA vanjska FUNKCIJA:  playStarters.forEach((playSymbol) => {} 

 

        // Scroll to the results container to focus on the tracklist: 

        document 

          .getElementById("search-results") 

          .scrollIntoView({ behavior: "smooth", block: "start" }); 

      } catch (error) { 

        console.error("Error fetching tracks:", error); 

        displayMessage(resultsContainer, "Error fetching track list."); 

      } 

      // return trackUri; 

    } // -> TU ZAVRŠAVA vanjska FUNKCIJA: async handleTrackListButtonClick() 

 

    // provjera da se vraća trackUri: 

    console.log( 

      "Provjera da se vraća trackUri kao globalna varijabla:", 

      currentTrackUri 

    ); 

 

    /* FOR NOW, THIS CODE CAN ONLY PLAY PREVIEW SONGS, AND NOT ALL SONGS EVEN HAVE A PREVIEW  */ 

 

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

 

    // FUNCTION TO PLAY SELECTED TRACK IN AUDIO-PLAYER: - OVO TRENUTNO NE KORISTIMO: 

    // *** (here it works with preview-url & client acceess token, not full song & user acceess token/SDK Player): 

 

    function playPreview(previewUrl) { 

      const audioPlayer = document.getElementById("audio-player"); 

 

      // Set the source of the html-audio-player to the selected track URL: 

      audioPlayer.src = previewUrl; 

 

      // Load the new track (required if you're changing the src dynamically) 

      audioPlayer.load(); 

 

      // Automatically play the track after loading 

      audioPlayer 

        .play() 

        .then(() => { 

          console.log("Track is playing"); 

        }) 

        .catch((error) => { 

          const noPreview = document.createElement("div"); 

          currentPlay = document.getElementById("current-play"); 

          noPreview.textContent = `No preview available for this track.`; 

          noPreview.classList.add("warning-message"); 

          currentPlay.appendChild(noPreview); 

 

          console.error("Error playing track:", error); 

        }); 

    } 

    // -> TU ZAVRŠAVA FUNKCIJA: playPreview(previewUrl) {} – koja je unutar function Todo() {} 

 

    // ____________________________________________________________________________________________________ 

 

    /* NOVO - 13.10. - PLAYER SDK: */ 

 

    // FUNKCTION WHICH WILL RETURN USER ACCESS TOKEN (which can then be used for PLAYER-SDK): 

 

    /* ------------ *****ODAVDE SMO MAKNULI FUNKCIJU fetchUserAccessToken I PREMJESTILI JE SKROZ GORE U NAJVIŠI GLOBALNI DOSEG, IZVAN TODO-FUNKCIJE****** --------------  */ 

 

    let userAccessToken = null; 

 

    const fetchUserAccessToken = async () => { 

      // First check if token is already available: 

      if (userAccessToken) { 

        console.log("Access token fetched:", userAccessToken); 

        return userAccessToken; // returns the existing token, if available 

      } 

 

      console.log("Trying to fetch the access token..."); // short console message to check if function is working 

      try { 

        // Try to get token via / (home) route: 

        const response = await fetch("/"); 

        console.log("Server response:", response); // check what server returns 

        // return userAccessToken; // function returns userAccessToken 

        if (!response.ok) { 

          throw new Error("Failed to fetch access token from main route"); 

        } 

 

        // If succesfull responce, we assume the token is there: 

        // Additionally handle response and get token from JSON: 

        const data = await response.json(); 

        if (data.token) { 

          userAccessToken = data.token; // global variable 

          console.log("Access token fetched:", userAccessToken); // check token 

          return userAccessToken; // function returns userAccessToken 

        } 

      } catch (error) { 

        console.error("Error fetching access token from main route:", error); 

 

        // If the 1st try (/ home-route) didn't succeed, try with an alternative route: /api/get-user-access-token: 

        try { 

          const response = await fetch("/api/get-user-access-token"); 

          console.log("Server response for alternative route:", response); // check what the server returns 

          if (!response.ok) { 

            throw new Error( 

              "Failed to fetch access token from alternative route" 

            ); 

          } 

          const data = await response.json(); 

          userAccessToken = data.token; // set a global variable 

          console.log( 

            "Access token fetched from the alternative route:", 

            data.token 

          ); // check token 

          // return data.token; // function returns userAccessToken 

          return userAccessToken; 

        } catch (error) { 

          console.error( 

            "Error fetching user access token from alternative route:", 

            error 

          ); 

          return null; // function returns null, in case of an error 

        } 

      } 

    }; 

 

    console.log( 

      "Provjera da se vraća i dohvaća trackUri kao globalna varijabla:", 

      currentTrackUri 

    ); 

 

    // OVDJE MOŽEMO DODATI FUNKCIJU KOJA SVIRA ODABRANU PJESMU: 

 

    async function playTrack(currentTrackUri) { 

      const token = userAccessToken; 

      const deviceId = window.device_id; // Device ID dobiven iz SDK-a 

      console.log("Device ID:", deviceId); // currently UNDEFINED!    --> OVO NE RADI, NAKON KRAJA KODA VRAĆA SE OVDJE I ODJEDNOM VIŠE NE PREPOZNAJE DEVICE_ID! - (UNDEFINED) :( 

 

      if (!deviceId) { 

        console.error( 

          "Spotify Web Player SDK is not initialized or device ID is missing."  // -> PRIKAŽE SE OVA GREŠKA JER FALI DEVICE_ID (iako je prije ove funkcije, kod inicijalizacije bio dohvaćen) 

        ); 

        return; 

      } 

 

      // Kreira API poziv za puštanje pjesme 

      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, { 

        method: "PUT", 

        body: JSON.stringify({ 

          uris: [currentTrackUri], // URI pjesme koju želimo pustiti 

        }), 

        headers: { 

          "Content-Type": "application/json", 

          Authorization: `Bearer ${token}`, 

        }, 

      }).then((response) => { 

        if (response.ok) { 

          console.log("Track is playing"); 

 

          //DODATI KOD ZA SVIRANJE U AUDIO PLAYERU: 

 

          const audioPlayer = document.getElementById("audio-player"); 

 

          // Set the source of the html-audio-player to the selected track URL: 

          audioPlayer.src = currentTrackUri; 

 

          // Load the new track (required if you're changing the src dynamically) 

          audioPlayer.load(); 

 

          // Automatically play the track after loading 

          audioPlayer 

            .play() 

            .then(() => { 

              console.log("Track is playing"); 

            }) 

            .catch((error) => { 

              const noPreview = document.createElement("div"); 

              currentPlay = document.getElementById("current-play"); 

              noPreview.textContent = `No preview available for this track.`; 

              noPreview.classList.add("warning-message"); 

              currentPlay.appendChild(noPreview); 

 

              console.error("Error playing track:", error); 

            }); 

        } else { 

          console.error("Error playing track:", response); 

        } 

      }); 

    } 

 

    // funkcija initializeSpotifyPlayer kreira instancu Spotify.Player s imenom "Web Playback SDK" 

    // i prosljeđuje getOAuthToken funkciju, koja poziva callback sa tokenom: 

    this.initializeSpotifyPlayer = (token) => { 

      const self = this; // Spremaj kontekst 'this' 

      console.log("Inicijalizacija Spotify playera s tokenom:", token); // Ispis tokena 

      // const token = data.access_token; 

      const player = new Spotify.Player({ 

        name: "Web Playback SDK", 

        getOAuthToken: (cb) => { 

          cb(token); 

        }, 

        volume: 0.5, 

      }); 

 

      // - - - - - - - - - - - - - - - - - - - - - - - - - - NOVO 15.10. - - - - - - - - - - - - - - - - - - 

 

      // Preslušavanje eventa kad je player spreman 

      player.addListener("ready", ({ device_id }) => { 

        console.log("Ready with Device ID", device_id); 

        // Sada možeš koristiti device_id za upravljanje reprodukcijom 

        this.device_id = device_id; 

      }); 

 

      // Preslušavanje errora 

      player.addListener("not_ready", ({ device_id }) => { 

        console.log("Device ID has gone offline", device_id); 

      }); 

 

      player.addListener("initialization_error", ({ message }) => { 

        console.error(message); 

      }); 

 

      player.addListener("authentication_error", ({ message }) => { 

        console.error(message); 

      }); 

 

      player.addListener("account_error", ({ message }) => { 

        console.error(message); 

      }); 

 

      // Spajanje playera: 

      // player.connect(); 

 

      player.connect().then((success) => { 

        if (success) { 

          console.log( 

            "The Web Playback SDK successfully connected to Spotify!" 

          ); 

        } else { 

          console.error("Failed to connect to Spotify."); 

        } 

      }); 

 

      // _______________________________________-NOVO 19.10. ______________________________________________ 

 

      // const trackId = "xxxx";  // Spotify Track ID 

      // const trackUri = `spotify:track:${trackId}`; // Kreira Spotify URI za pjesmu 

      // console.log("Track URI:", trackUri); 

 

      // OVDJE DEFINIRANU FUNKCIJU playTrack(trackUri) NIJE MOGUĆE POZVATI - JER JE FUNKCIJA OVDJE ZAČAHURENA UNUTAR FUNKCIJE initialize SpotifyPlayer(): 

 

      // async function playTrack(trackUri) { 

      //   const token = userAccessToken; 

      //   const deviceId = window.device_id; // Device ID dobiven iz SDK-a 

 

      //   if (!deviceId) { 

      //     console.error( 

      //       "Spotify Web Player SDK is not initialized or device ID is missing." 

      //     ); 

      //     return; 

      //   } 

 

      //   // Kreira API poziv za puštanje pjesme 

      //   fetch( 

      //     `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, 

      //     { 

      //       method: "PUT", 

      //       body: JSON.stringify({ 

      //         uris: [trackUri], // URI pjesme koju želimo pustiti 

      //       }), 

      //       headers: { 

      //         "Content-Type": "application/json", 

      //         Authorization: `Bearer ${token}`, 

      //       }, 

      //     } 

      //   ).then((response) => { 

      //     if (response.ok) { 

      //       console.log("Track is playing"); 

 

      //       //DODATI KOD ZA SVIRANJE U AUDIO PLAYERU: 

 

      //         const audioPlayer = document.getElementById("audio-player"); 

 

      //         // Set the source of the html-audio-player to the selected track URL: 

      //         audioPlayer.src = trackUri; 

 

      //         // Load the new track (required if you're changing the src dynamically) 

      //         audioPlayer.load(); 

 

      //         // Automatically play the track after loading 

      //         audioPlayer 

      //           .play() 

      //           .then(() => { 

      //             console.log("Track is playing"); 

      //           }) 

      //           .catch((error) => { 

      //             const noPreview = document.createElement("div"); 

      //             currentPlay = document.getElementById("current-play"); 

      //             noPreview.textContent = `No preview available for this track.`; 

      //             noPreview.classList.add("warning-message"); 

      //             currentPlay.appendChild(noPreview); 

 

      //             console.error("Error playing track:", error); 

      //           }); 

 

      //     } else { 

      //       console.error("Error playing track:", response); 

      //     } 

      //   }); 

      // } 

 

      // poziv funkcije  playTrack(trackUri) - nakon što smo je definirali - tu je pozvana 2. put. 

      // playTrack(trackUri); 

    }; 

    // -> tu završava funkcija initializeSpotifyPlayer 

 

    // - - - - - - - - - - - -  - - - - - - - - - - - -  - - - - - - - - - - - - 

 

    /* SLJEDEĆU this.init ASINKRONU FUNKCIJU SAM DODALA NA KRAJ, JER ONA POZIVA DRUGE 2 FUNKCIJE:  

 ->  fetchUserAccessToken & initializeSpotifyPlayer */ 

 

    /* init-funkction first calls another function: fetchUserAccessToken() to get the access token, 

    -> if the token is valid, then the init-function calls 3rd function: this.initializeSpotifyPlayer(token),  

    this function takes the fetched token as parameter and then can initialize Spotify Player: */ 

 

    this.init = async () => { 

      console.log("Initialisation started..."); 

      console.log("Spotify Web Playback SDK loaded 1:", window.Spotify); 

      const token = await fetchUserAccessToken(); 

      console.log("Access Token:", token); 

      if (token) { 

        this.initializeSpotifyPlayer(token); // call the function for initialising Spotify Player 

      } else { 

        console.error("User access token is not valid or not found"); 

      } 

    }; 

 

    // _____________________________  TU ZAVRŠAVA KOD ZA PUŠTANJE PJESAMA PREKO AUDIO-PLAYERA ___________________________________________ 

 

    // 19.10. - playing full version of tracks with SDK-Player: 

 

    // Example of using fetchUserAccessToken to play a full track via the Spotify Web Player SDK: 

    // async function playFullTrack(trackUri) { 

    //   const token = await fetchUserAccessToken(); // Ensure we have the user token 

    //   if (token) { 

    //     // Set up the Spotify Web Playback SDK or make API call using the user token 

    //     console.log("Playing full track with URI:", trackUri); 

    //     // Example SDK call or fetch to Spotify API using the token 

    //   } 

    // } 

 

    // // Call the fetchUserAccessToken whenever you need it, for example: 

    // document.getElementById("play-full-track").addEventListener("click", () => { 

    //   playFullTrack('spotify:track:xyz'); // Placeholder for actual track URI 

    // }); 

 

    /*  

    server.js: 

 

    app.get("/api/get-user-access-token", (req, res) => { 

      if (userAccessToken) { 

        res.json({ token: userAccessToken }); 

      } else { 

        res.status(401).send("Unauthorized"); // Ako token ne postoji, vrati status 401 

      } 

    }); 

    Dohvaćanje userAccessToken: Kada se korisnik prijavi putem Spotify OAuth i dobije userAccessToken,  

    on se pohranjuje u varijablu userAccessToken. 

    Nova API ruta: Nova ruta (/api/get-user-access-token) vraća userAccessToken klijentu ako je postavljen.  

    U suprotnom, vraća status 401 (Unauthorized). 

 

    index.js: 

    Klijentska funkcija: U index.js, fetchUserAccessToken šalje zahtjev serveru da dobije token.  

    Kada se SDK učita, poziva se ta funkcija kako bi se dobio token koji se koristi za inicijalizaciju Spotify playera. 

     */ 

 

    // _____________________________________________________________ 

 

    // Praćenje submita u search-form-u i prikaz search-rezultata: 

 

    searchButton.addEventListener("click", (event) => { 

      event.preventDefault(); // Prevent the default form submission 

 

      handleSearch(); // Pozovi handleSearch() umjesto displaySearchResults 

    }); 

 

    // function for focusing on the Search Results: 

    async function handleSearch() { 

      const query = searchInput.value.trim(); // Get the input value 

 

      const formContainer = document.getElementById("zero-input"); // Container near the input field 

 

      // Uklonite ranije poruke upozorenja 

      formContainer.querySelector(".warning-message")?.remove(); 

 

      if (query.length >= 1) { 

        console.log("Form submitted"); 

        console.log("Query:", query); 

        await displaySearchResults(query); // Koristi fetchSearchResults unutar displaySearchResults 

        // document.getElementById("search-results").focus(); // Focus on the results-container 

        document 

          .getElementById("search-results") 

          .scrollIntoView({ behavior: "smooth", block: "start" }); 

      } else { 

        displayMessage(formContainer, "Please enter your query."); 

      } 

    } 

 

    // Praćenje pritiska na Enter tipku i poziv handleSearch() 

    searchInput.addEventListener("keypress", function (event) { 

      if (event.key === "Enter") { 

        event.preventDefault(); // Prevent form submission on Enter 

        handleSearch(); 

      } 

    }); 

 

    // Event-listener za praćenje unosa u sva tri ova polja s posebnim kategorijama: 

    [artistInput, songInput, albumInput].forEach((input) => { 

      input.addEventListener("input", () => { 

        const query = input.value.trim(); 

        if (query.length > 0) { 

          fetchSuggestions2(query); 

        } else { 

          resultsList.innerHTML = ""; // Očisti rezultate ako je unos prazan 

        } 

      }); 

    }); 

 

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

 

    // _________________________________________________________________________________________________ 

 

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

 

    // ------------------------------------------------------------------------------------------- 

 

    //   NOVI KOD 20.10.: 

 

    let currentTrack = null; 

    let isPaused = false; 

    let isActive = false; 

 

 

    // Definiraj funkciju za inicijalizaciju player-a 

    this.initializeSpotifyPlayer = async function () { 

      const token = await fetchUserAccessToken(); // Dohvati token 

      this.player = new Spotify.Player({ 

        name: "Web Playback SDK Player", 

        getOAuthToken: (cb) => { 

          cb(token); 

        }, // Postavi ispravan token 

        volume: 0.5 

      }); 

 

       

 

      // Dodaj event listener za 'ready' event kako bi dobio device_id 

      this.player.addListener("ready", ({ device_id }) => { 

        console.log("Device is ready with ID:", device_id);      // OVO RADI I PRIKAŽE SE PORUKA S PRAVIM DEVICE_ID-em! :) 

        this.device_id = device_id; // Spremi device_id 

 

      this.player.addListener('not_ready', ({ device_id }) => { 

          console.log('Device ID has gone offline', device_id); 

      });   

 

        // U ovom trenutku, možeš pozvati playTrack 

        // Pozovi playTrack samo ako imaš URI pesme 

        // playTrack(currentTrackUri);  // - OVO SMO ZAKOMENTIRALI 20.10. JER SE IONAKO NE IZVRŠAVA 

      }); 

 

      // Poveži player s connect() 

      this.player.connect().then((success) => { 

        if (success) { 

          console.log("The Web Playback SDK successfully connected!");   // OVO RADI :) 

        } else { 

          console.error("Failed to connect to Spotify Web Playback SDK."); 

        } 

      }); 

       

    }; 

 

    this.init = async function () { 

      await this.initializeSpotifyPlayer(); // Pozovi funkciju za inicijalizaciju player-a 

      console.log("Called this.init() to initialize Spotify Player "); // Log za praćenje 

    }; 

 

 

        // Postavljanje event listenera za player van funkcije u kojoj je inicijaliziran: 

player.addListener('player_state_changed', function(state) { 

  if (!state) { 

      return; 

  } 

 

  setTrack(state.track_window.current_track); 

  setPaused(state.paused); 

 

  player.getCurrentState().then(function(state) { 

      if (!state) { 

          setActive(false); 

      } else { 

          setActive(true); 

      } 

  }); 

}); 

 

    /* 

 

NOVOSTI + (2): The Web Playback SDK successfully connected! 

 

Device is ready with ID: 6249acd971a31652b892ca20631ba2100d244d32 

 

Device ID: undefined 

 

PROBLEMI - (3):  

 

Zašto se više ne može koristiti Refresh token?? Nego sve ide preko alternativne rute: 

Error refreshing token: Error: Failed to refresh access token 

 

Access token fetched from the alternative route:  

BQDT2SRw_JOdKldqCEyhymQfRW1FoH4cBiRX1p_RlAfoZu6GNS8baL9SR48X2SuYGLbjyM3ks9JadBoMBgXrUDIDIok2cELHRcKPeeIC8bxft4iu9S3xCWjULBugDYHj11gncyclP0UuuKD8etmE0XpRke1t7nDgZDBTNMJsanv7gyCpdlq3XnUdfUxqmwhO97afAj6zuEKbaK28Lw6gjUKEInBtdyX3qFIxz-Ma9lE 

 

index.js:3 It is recommended that a robustness level be specified. Not specifying the robustness level could result in unexpected behavior. 

 

index.js:926 Spotify Web Player SDK is not initialized or device ID is missing. 

playTrack	@	index.js:926 

(anonymous)	@	index.js:1481 

(anonymous)	@	spotify-player.js:3 

t._onEvent	@	spotify-player.js:3 

t._handleMessages	@	spotify-player.js:3 

e._receiveMessage	@	spotify-player.js:3 

Show 1 more frame 

 

--> javlja se zato jer u tom trenu još/više nema device_id (iako ga prije toga uspješno bilježi, a kasnije! postane null - vidjeti REDOSLIJED! funkcija...) 

 

if (!deviceId) { 

        console.error( 

          "Spotify Web Player SDK is not initialized or device ID is missing." 

        ); 

        return; 

      } 

 

 */ 

 

    // - - - - - - - - - - - -- - -- - -- -- - ---------------------------------------- 

  } 

  // here ends Todo() function. 

 

  // ----------------------------------------------------------------------------------------------------- 

 

  const todo = new Todo(); // Todo()-funkciju spremamo u varijablu todo, i onda ćemo je inicijalizirati kad se stranica učita. 

  console.log("Instanca todo kreirana:", todo); 

 

  // window.addEventListener("load", todo.init); 

 

  // Dodaj event listener za load: 

  window.addEventListener("load", () => { 

    // Inicijaliziraj SDK i cijelu Todo-funkciju, čim je stranica učitana: 

    // window.onSpotifyWebPlaybackSDKReady = initializeSpotifyPlayer(); 

 

    todo.init(); // Poziv init nakon što se SDK učita 

    console.log("Pozvan todo.init()"); 

 

    // U slučaju da se SDK ne učita, možeš dodati fallback 

    setTimeout(() => { 

      if (typeof Spotify === "undefined") { 

        console.error("Spotify SDK nije učitan nakon 10 sekundi."); 

      } 

    }, 10000); // Provjeri nakon 10 sekundi 

  }); 

})(); 

 

// -> ovdje završava čitav index.js kod! (na kraju je poziv samopozivajuće funkcije). 

 

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

 

 

 

- napravi funkciju playSong() koja ima ove podfunkcije: 

- event-listener kad se klikne na bilo koji dio cijelog li (list itema), pokrene se player 

- automatski se fokus prebaci u donji form gdje je Audio player i pjesma počne svirati 

- volume je automatski set na 50% ili manje 

- pjesma se može zaustaviti na play/pause 

- u prozoru Playera se pojavi slika covera albuma s kojeg je pjesma 

- opcije premotavanja? Vidjeti jel ih Player ima 

- opcije Next / Back (iduća ili ranija pjesma)? (onda dohvaća sljedeći ili prethodni item s liste tog albuma) - moguće da postoji api-endpoint za to, ili preko petlje koja prolazi kroz cijelu listu na tom albumu 

- ispod Playera piše dinamički artist, album i song koji svira 

- Rate i Add to playlist buttoni su isto unutar Playera, blizu tog ispisa pjesme, i imaju svoje funkcije kao i prije (za dodavanje na listu) - samo podesiti da sad dohvaćaju podatke poslane s Api-ja 

 

- maknuti iz Search-forma opcije Artist, Album, Song i njihov kod preobličiti, tako da pod tim id-evima označava i sprema stvari dohvaćene s api-callova 

- umjesto njih, staviti opciju Search by: Artist, Album, Song kao neki checkbox-form, gdje korisnik može označiti jednu ili više stvari i dobiva samo djelomične api-rezultate ovisno o kategorijama koje je označio (modifikacija već postojećeg Searcha) 

- napraviti da Results nije stalno vidljiv na stranici, nego tek nakon što je korisnik kliknuo na Search i bio je unesen bar 1 znak 

 

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

 

- suziti širinu prvog forma u kojem je Search (nema potrebe da je tako širok i glomazan, dok ostali mogu biti kako jesu široki) 

- suziti širinu Search-input polja i Search-buttona, te prilagoditi za nekoliko media queriesa 

 

- Results container/form je trenutno stalno vidljiv jer je hardkodiran na idex.html-u - učiniti da je nevidljiv, i da se prikazuje samo kad se dohvate neki rezultati 

 

*/ 