// require("dotenv").config(); // load environment variables from 'dotenv' file
import dotenv from "dotenv";
dotenv.config();

// load Express:
// const express = require("express");
// const cors = require("cors");
// const https = require("https");
// const bodyParser = require("body-parser");
// const fetch = require("node-fetch");
// const path = require("path"); // for work with files and folders
// *Recommended when dealing with file paths to ensure they are cross-compatible for different operating systems (npr. Windows, macOS, Linux).
// *If you plan to use relative paths, path can prevent possible misdefined path errors, especially when using methods like res.sendFile() to serve static files.

// Dependencies:
import express from "express"; // to create a web server
import cors from "cors"; // handling cross-origin requests
import https from "https"; // for making HTTPS-requests (...not used so far)
import bodyParser from "body-parser"; // parse incoming request bodies (although not needed, as Express now includes body-parsing by default for JSON)
import fetch from "node-fetch"; // to make HTTP requests (in this case, to Spotify's API)
import path from "path"; // used to calculate __dirname in ES modules, since it's not available like in CommonJS
import { fileURLToPath } from "url";
// static files (e.g., CSS, JS) are served from the public folder
// the / route serves an index.html file from the root directory of the project using sendFil

// Calculate __dirname:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app:
const app = express();

// Define port:
const PORT = process.env.PORT || 3000;

// Client ID & Client Secret securely saved in the .env file, fetched here via variables:
const clientId = process.env.client_id;
const clientSecret = process.env.client_secret;


// -> and this exact same link should be also set in Spotify Dashboard (Settings) as the only redirect-link!
// const redirect_uri = "http://localhost:3000/callback";
// if using SDK player, it's very important that the callback link (redirect page after user login) is localhost:3000/callback
// but for client authorisation we can use simply this redirect_uri:
const redirect_uri = "http://localhost:3000";

const auth_endpoint = "https://accounts.spotify.com/authorize";
const response_type = "token";

// Middleware:
app.use(cors());
app.use(express.static("public"));
// - for stacit files (pictures etc), index.JS and all CSS files - put them all in the map 'public' so Express could serve them at request.
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); // Parsing the body of our request into URL

// Global variable for storing access token (initially has no value):
let clientAccessToken = null; // token from Client Credentials Flow, for searching public data
// let userAccessToken = null; // Authorization Code Flow, to control User Playback SDK
// let userRefreshToken = null; // refresh token (if used)
let clientTokenExpirationTime = null;
// let userTokenExpirationTime = null;


let isFetchingToken = false; // New variable for tracking the status of token fetching

// Define main routes:
// SEND-request can be only ONE! - nothing else can be returned after that. Next SEND-requests following after this one will not be realised!


// ADDED 21.10.:
// Route for serving 'index.html' (home page: '/'):
// If index.html is in the same map as server.js (on the same 'hierarchy level'), the path to index.html should look like this:
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

// Route for serving Favorites / My playlists page:
app.get("/favorites", (req, res) => {
  res.sendFile(path.join(__dirname + "/favorites.html"));
});


// new 15.10.:

// app.get("/set-token", (req, res) => {
//   // setting token and saving it's expiration time
//   const expiresIn = 3600; // Access token lasts for 3600 sec (1 hour)
//   userTokenExpirationTime = Date.now() + expiresIn * 1000;
//   userAccessToken = "yourAccessTokenHere";

//   res.send("Token set!");
// });

// 21.10. WE WILL COMMENT THIS, NOT NEEDED (NEEDED ONLY FOR SDK AUTHORISATION):

// const refreshUserAccessToken = async () => {

//   const response = await fetch("https://accounts.spotify.com/api/token", {
//     method: "POST",
//     headers: {
//       Authorization:
//         "Basic " +
//         Buffer.from(clientId + ":" + clientSecret).toString("base64"),
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//     body: new URLSearchParams({
//       grant_type: "refresh_token",
//       refresh_token: userRefreshToken,
//     }),
//   });

//   const data = await response.json();
//   if (response.ok) {
//     console.log("New access token received:", data.access_token);

//     userAccessToken = data.access_token;
//     userTokenExpirationTime = Date.now() + data.expires_in * 1000; // Set expiration time
//     return data.access_token; // return new access token
//   } else {
//     throw new Error("Failed to refresh access token");
//   }
// };

// Function which checks if user access token is expired:
// const isUserTokenExpired = () => {
//   return Date.now() >= tokenExpirationTime;
// };

// app.get("/", async (req, res) => {
//   console.log("Checking userAccessToken...");

//   if (!userAccessToken || isUserTokenExpired()) {
//     console.log("Access token is missing or expired, refreshing token...");

//     try {
//       // Refresh token (if expired))
//       const newToken = await refreshUserAccessToken(); 
//       userAccessToken = newToken;
//       tokenExpirationTime = Date.now() + 3600 * 1000; // set new expiration time
//     } catch (error) {
//       console.error("Error refreshing token:", error);
//       return res.redirect("/login"); // If refreshing doesn't succeed, reroute to login page
//     }
//   }

  // Ako je token valjan, posluži početnu stranicu:
//   console.log("User access token found:", userAccessToken);
//   res.sendFile(path.join(__dirname + "/index.html"));
// });

// - - - - - - - - - - - - - - - - - - - - - - - - - - -- -

// NEW: Route for Login - needed if we want to use Player SDK:

// app.get("/login", (req, res) => {
//   // const auth_endpoint = "https://accounts.spotify.com/authorize"; // Spotify authorization endpoint
//   const scopes =
//     "streaming user-read-email user-read-private user-modify-playback-state user-read-playback-state"; // Scopes for the permissions we need
//   const authUrl = `${auth_endpoint}?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(
//     scopes
//   )}&redirect_uri=${encodeURIComponent(redirect_uri)}`;
//   res.redirect(authUrl);
// });

// NEW:  Route for Callback (sending user access token after authorisation on Spotify page):

// ALSO NOT NEEDED, IF WE ARE USING ONLY CLIENT ACCESS TOKEN, AND NOT USER ACCESS TOKEN:
// app.get("/callback", async (req, res) => {
//   const code = req.query.code;

//   if (!code) {
//     console.log("Authorization code not found.");
//     return res.send("Authorization code not found.");
//   }

//   const params = new URLSearchParams();
//   params.append("grant_type", "authorization_code");
//   params.append("code", code);
//   params.append("redirect_uri", redirect_uri);
//   params.append("client_id", clientId);
//   params.append("client_secret", clientSecret);

//   try {
//     const response = await fetch("https://accounts.spotify.com/api/token", {
//       method: "POST",
//       headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       body: params,
//     });

//     const data = await response.json();
//     if (response.ok) {
//       userAccessToken = data.access_token;

//       // Provjera postojanja refresh tokena
//       if (data.refresh_token) {
//         userRefreshToken = data.refresh_token; // save refresh token
//       }
//       userTokenExpirationTime = Date.now() + data.expires_in * 1000; // set expiration time

//       console.log("User access token received:", userAccessToken);
//       console.log("Token expires in:", data.expires_in, "seconds");
//       res.redirect("/"); // redirects to home page
//     } else {
//       console.log(
//         `Error fetching access token: ${response.status} - ${data.error}`
//       );
//       res.send(`Error fetching access token: ${data.error_description}`);
//     }
//   } catch (error) {
//     console.log(`Error during token request: ${error.message}`);
//     res.send(`Error during token request: ${error.message}`);
//   }
// });

// New route for fetching userAccessToken:
// app.get("/api/get-user-access-token", (req, res) => {
//   try {
//     if (userAccessToken) {
//       res.json({ token: userAccessToken });
//     } else {
//       res.status(401).send("Unauthorized"); // If token not existing, return status 401
//     }
//   } catch (error) {
//     console.error("Error fetching user access token:", error);
//     res.status(500).send("Internal Server Error"); // Return status 500 in case of an error
//   }
// });

// Autentifikacija radi, userAccessToken se dodjeljuje. Ako je user već ulogiran, automatski redirecta na home page bez potrebe za prijavom.
// Testirano paralelno u 2 browsera (Chrome i Mozilla).
// Čak i kad se izlogiram iz Spotify app-a, userAccessToken je i dalje aktivan.
// Isti userAccessToken se prikazuje u server-konzoli za oba browsera (console-loga se kad god reloadamo stranicu u nekom browseru).
// Znači da je userAccessToken dodijeljen na temelju device_id, koji je isti neovisno u kojem browseru se koristi, i traje i dalje (cca sat vremena).


// Asyncronous function to fetch Client access token:
// function sends a POST request to Spotify API to retrieve an OAuth access token.
// the request uses 'client_credentials'- grant type to authenticate the app.
// the access token is stored in a global variable 'accessToken' -> later renamed to 'clientAccessToken'.
async function getAccessToken() {
  if (clientAccessToken && Date.now() < clientTokenExpirationTime) {
    return clientAccessToken; // returns the already existing token, if still valid
  }

  // Function that checks if the token is already in the process of being fetched
  // (so we can prevent sending a 2nd API-request and getting another access token, if the user types in input-field faster, than the first request was finished)
  if (isFetchingToken) {
    // If the token is already in the process of fetching, wait until it is finished
    return new Promise((resolve) => {
      const checkToken = setInterval(() => {
        if (!isFetchingToken) {
          clearInterval(checkToken);
          resolve(clientAccessToken); // returns fetched access token
        }
      }, 100); // interval checks every 100ms
    });
  }

  isFetchingToken = true; // token is already in the process of being fetched = true

  // URLSearchParams creates an object, which manages with URL-encoded parameters which should be sent in the body of our POST request.
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials"); // app searches for token via Client Credentials Flow-a (app does this alone, without user, to get access token)
  params.append("client_id", clientId); // ID of the aplication/project, received during app registration on Spotify Developers platform
  params.append("client_secret", clientSecret); // secret key of the app, also received during app registration on Spotify Dev platform

  // fetch sends a HTTP request to the Spotify API. The function uses 'await' to wait for a response before continuing to execute the rest of the code.
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST", // HTTP POST method because we send data (authentication parameters) in the request body.
    headers: { "Content-Type": "application/x-www-form-urlencoded" }, // set headers that define the type of data we send.
    // Content-Type is: "application/x-www-form-urlencoded", meaning that the data in the request body uses URL-encoded format.
    body: params, // as the body of the request, we send the URL-encoded parameters (params) that we previously defined (grant_type, client_id, and client_secret).
  });

  // Log access token:
  const data = await response.json(); // takes the response received from the API, and calls the json() method,
  // which parses the response body from JSON format into a JavaScript object.
  // Since JSON parsing is asynchronous, await is used to stop the function until the JSON is parsed.
  if (!response.ok) {
    // if response.ok is false (which means the response is an HTTP status code of 4xx or 5xx), then an error has occurred.
    throw new Error(`Error fetching token: ${data.error}`);
  }
  clientAccessToken = data.access_token; // if the request was successful, the access_token field, which contains the access token, is extracted from the response (data).
  clientTokenExpirationTime = Date.now() + data.expires_in * 1000; // The API returns the data expires_in, which represents the number of seconds the token is valid (eg 3600 seconds, which is 1 hour) -
  // Date.now() - function returns current timestamp in milliseconds.
  // clientTokenExpirationTime: Calculates and stores the exact time / timestamp (in milliseconds) when the token will expire. This allows checking that the token is still valid before it is used in subsequent requests.

  isFetchingToken = false; // Fetching of the client access token is completed.

  /////////////////////////////////////////////////////////////////////////////////////////
  function displayCurrentTime() {
    const now = new Date(); // new Date object created
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Prikaz u formatu HH:MM:SS
    const currentTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    // function padStart() is used to reach needed number of characters, f.e. a 0 is added in front, if the number is single-digit.

    console.log("Current time:", currentTime);
  }
  displayCurrentTime();
  /////////////////////////////////////////////////////////////

  console.log("Client Access Token:", clientAccessToken);
  console.log("Expiration Timestamp:", clientTokenExpirationTime);
  return clientAccessToken; // an accessToken is returned, allowing the function caller to use that token for future API requests.
}

// Endpoint to provide the fetched access token - function defines Express.js route /api/token which enables returning the Spotify access token via API.
// defining route:
app.get("/api/token", async (req, res) => {
  try {
    if (!clientAccessToken || Date.now() >= clientTokenExpirationTime) {
      // Check if access token is missing, or if it's expired
      clientAccessToken = await getAccessToken(); // 1. If there is no token (either already expired, or not existing yet), it calls the already defined function 'getAccessToken'
    }
    res.json({ clientAccessToken }); // 2. Otherwise, if there is already a token fetched, this function returns the token as JSON
  } catch (error) {
    // 3. option: error handling
    console.error("Error fetching access token:", error);
    res.status(500).json({ error: "Failed to fetch access token" }); // client receives the error message 500 with explanation text
  }
});

// ENDPOINT GET ARTIST: https://api.spotify.com/v1/artists/{id}
// http GET https://api.spotify.com/v1/artists/0TnOYISbd1XYRBk9myaseg \
//  Authorization:'Bearer 1POdFZRZbvb...qqillRxMr2z'
// dodatni keys: genres [array of strings], images [array with usually one {object}, only important key: "url" - get the 1st object + url-key there]

// ENDPOINT GET SEVERAL ARTISTS: https://api.spotify.com/v1/artists
// http GET 'https://api.spotify.com/v1/artists?ids=2CIMQHirSU0MQqyYHq0eOx%2C57dN52uHvrHOxijzpIgu3E%2C1vCWHaC5f2uS3yhpwWbIA6' \
//   Authorization:'Bearer 1POdFZRZbvb...qqillRxMr2z'
// struktura: { objekt "artists": [array s objektima, svaki je zaseban objekt sa keyevima: genres, followers, images, name...]}

// ENDPOINT GET ARTIST'S ALBUMS: https://api.spotify.com/v1/artists/{id}/albums
// http GET https://api.spotify.com/v1/artists/0TnOYISbd1XYRBk9myaseg/albums \
// Authorization:'Bearer 1POdFZRZbvb...qqillRxMr2z'
// struktura: { object -> razni keys, npr. limit, total, items [array s {objektima - svaki ima ove keys: total_tracks, id, images, name, artists...}]}

// ENDPOINT GET ARTIST'S TOP TRACKS: https://api.spotify.com/v1/artists/{id}/top-tracks
// struktura: { object "tracks": [array s objektima "album", {svaki od njih ima keys: images, name, artistsduration_mstrack_number...}]}

// ENDPOINT GET ALBUM: https://api.spotify.com/v1/albums/{id}
// http GET https://api.spotify.com/v1/albums/4aawyAB9vmqN3uQ7FjRGTy \
// Authorization:'Bearer 1POdFZRZbvb...qqillRxMr2z'
// dodatni keys: name ("string"), total_tracks (integer), release_date, artists.name[0,1,2...] - array, tracks.name[array], genres
// ...album cover picture, npr: "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228"
// release_date_precision - The precision with which release_date value is known. Allowed values: "year", "month", "day". Example: "year"

// ENDPOINT GET SEVERAL ALBUMS: https://api.spotify.com/v1/albums
// - parametri: id, market (npr. ES).
// ids - a comma-separated list of the Spotify IDs for the albums. Maximum: 20 IDs.
// dodatni keys: items [array] -> {object za svaki item/album} -> svaki object ima artists, duration_ms, name...

// ENDPOINT GET ALBUM TRACKS: https://api.spotify.com/v1/albums/{id}/tracks
// limit: The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.

// ENDPOINT GET TRACK:  https://api.spotify.com/v1/tracks/{id}
// - parametri: id, market

// ENDPOINT GET SEVERAL TRACKS: https://api.spotify.com/v1/tracks
// - parametri: ids (više id-eva), market

// ENDPOINT SEARCH FOR ITEM: (tracks, albums, shows, episode, playlists, audiobooks...) - https://api.spotify.com/v1/search
// - parametri: q, type, market (ES), limit, offset...
// http GET 'https://api.spotify.com/v1/search?q=remaster%2520track%3ADoxy%2520artist%3AMiles%2520Davis&type=album' \
// Authorization:'Bearer 1POdFZRZbvb...qqillRxMr2z'

// ENDPOINT PLAYER:
/* Get Playback State
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
Add Item to Playback Queue */

// Backend defines an AOI-endpoint (call it /api/suggestions or /api/search or similar).
// When a request was sent from frontend to this endpoint, server is handling user request, fetching results, and returning them in json-format:
app.get("/api/search", async (req, res) => {
  const query = req.query.q; // user's query/input
  const type = req.query.type || "artist,album,track"; // type of the search, f.e. artist, album, track
  // NEW 22.10.:
  const offset = parseInt(req.query.offset) || 0; 
  const limit = parseInt(req.query.limit) || 9;

  const clientAccessToken = await getAccessToken(); // fetch access token

  // URL for Search on Spotify API:
  const searchUrl = `https://api.spotify.com/v1/search?q=${query}&type=${type}&offset=${offset}&limit=${limit}`;
  // const searchUrl = https://api.spotify.com/v1/search?q=${query}&type=${type}&limit=9;

  try {
    const response = await fetch(searchUrl, {
      method: "GET",
      headers: { Authorization: `Bearer ${clientAccessToken}` },
    });

    if (response.ok) {
      const searchResults = await response.json();
      res.json(searchResults); // return results as JSON
    } else {
      res.status(response.status).json({ error: "Search failed" });
    }
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ error: "Failed to fetch results." });
  }
});

// Route for fetching info about album - used for the funkcion 'handleTrackListButtonClick' in index.js (showing tracks from an album):
app.get("/api/albums/:id/tracks", async (req, res) => {
  const albumId = req.params.id;

  const clientAccessToken = await getAccessToken(); // Dohvati access token

  const searchUrl = `https://api.spotify.com/v1/albums/${albumId}/tracks`;

  //   http GET https://api.spotify.com/v1/albums/4aawyAB9vmqN3uQ7FjRGTy/tracks \
  // Authorization:'Bearer 1POdFZRZbvb...qqillRxMr2z'

  try {
    const response = await fetch(searchUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${clientAccessToken}`, 
      },
    });

    if (response.ok) {
      const tracksData = await response.json();
      res.json(tracksData);
    } else {
      res.status(response.status).json({ error: "Search failed" });
    }
  } catch (error) {
    console.error("Error fetching tracks:", error);
    res.status(500).send("Error fetching album tracks");
  }
});

// Route for fetching info about track / song - it uses track.id, which we may need later for SDK Player:
app.get("/api/tracks/:id", async (req, res) => {
  const trackId = req.params.id;

  const clientAccessToken = await getAccessToken(); // Dohvati access token

  const searchUrl = `https://api.spotify.com/v1/tracks/${trackId}`;

  try {
    const response = await fetch(searchUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${clientAccessToken}`, 
      },
    });

    if (response.ok) {
      const songData = await response.json();
      res.json(songData);
    } else {
      res.status(response.status).json({ error: "Track cannot be fetched" });
    }
  } catch (error) {
    console.error("Error fetching track:", error);
    res.status(500).send("Error fetching chosen track");
  }
});

// Route for using Spotify Player - showing which song is currently playing:
// app.get("/api/me/player/currently-playing", async (req, res) => {
//   // const playback = req.track.id;

//   const clientAccessToken = await getAccessToken(); 

//   const searchUrl = `https://api.spotify.com/v1/me/player/currently-playing`;

//   try {
//     const response = await fetch(searchUrl, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${clientAccessToken}`, 
//       },
//     });
//     if (response.ok) {
//       const playingTrack = await response.json();
//       res.json(playingTrack);
//     } else {
//       res
//         .status(response.status)
//         .json({ error: "Failed to fetch currently playing track" });
//     }
//   } catch (error) {
//     console.error("Error fetching track:", error);
//     res.status(500).send("Error fetching currently playing song");
//   }
// });

// // Route for using Spotify Player - it uses track.id for playing a song:
// app.get("/api/me/player/play", async (req, res) => {
//   const playback = req.track.id;

//   const clientAccessToken = await getAccessToken();

//   const searchUrl = `https://api.spotify.com/v1/me/player/play`;

//   try {
//     const response = await fetch(searchUrl, {
//       method: "PUT",
//       headers: {
//         Authorization: `Bearer ${clientAccessToken}`,
//       },
//       body: {
//         context_uri: `{"uris": ["spotify:track:${playback}"]}`,
//       },
//     });

//     if (response.ok) {
//       const playingTrack = await response.json();
//       res.json(playingTrack);
//     } else {
//       res.status(response.status).json({ error: "Failed to play the track." });
//     }
//   } catch (error) {
//     console.error("Error fetching track:", error);
//     res.status(500).send("Failed to play the track.");
//   }
// });

// ---------------------------------------------------------------------------------

// Route for fetching info on artist - not used for now?
app.get("/artist/:id", async (req, res) => {
  const artistId = req.params.id; 
  const clientAccessToken = await getAccessToken(); 

  // URL for fetching artist's data:
  const artistUrl = `https://api.spotify.com/v1/artists/${artistId}`;

  const response = await fetch(artistUrl, {
    method: "GET",
    headers: { Authorization: `Bearer ${clientAccessToken}` }, 
  });

  if (response.ok) {
    const artistData = await response.json();
    res.json(artistData); 
  } else {
    res.status(response.status).json({ error: "Artist not found" });
  }
});

// Route for fetching info on a song:
app.get("/api/search", async (req, res) => {
  const query = req.query.q; // search songs
  const clientAccessToken = await getAccessToken();

  // URL for Search on Spotify API:
  const searchUrl = `https://api.spotify.com/v1/search?q=${query}&type=track`;

  const response = await fetch(searchUrl, {
    method: "GET",
    headers: { Authorization: `Bearer ${clientAccessToken}` },
  });

  if (response.ok) {
    const searchResults = await response.json();
    res.json(searchResults); 
  } else {
    res.status(response.status).json({ error: "Search failed" });
  }
});

// Define additional routes (if needed):
// app.get("/api/data", (req, res) => {
//   res.json({ message: "This is some data" });
// });

// Logic for searching songs (npr. API-call to Spotify API):
// app.get("/api/search", async (req, res) => {
//   const query = req.query.q;
// });

// Edited endpoint for searching artist, song or album:
// app.get("/api/suggestions", (req, res) => {
//   const query = req.query.q;
// Add logic for searching (from API-documentation - Search)
// Add logic for returning results
//   const results = searchDatabaseForSuggestions(query); // current logic for saving results
//   res.json({ results });
// });

// Error handling middleware:
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start server:
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Git Bash command for starting the server:
// node server.js  -OR-  nodemon server.js (if Nodemon installed)

// Result, if status ok:
// Server is running on port 3000