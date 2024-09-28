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
import express from "express";  // to create a web server
import cors from "cors";  // handling cross-origin requests
import https from "https";   // for making HTTPS-requests (...not used so far)
import bodyParser from "body-parser";   // parse incoming request bodies (although not needed, as Express now includes body-parsing by default for JSON)
import fetch from "node-fetch";   // to make HTTP requests (in this case, to Spotify's API)
import path from "path";   // used to calculate __dirname in ES modules, since it's not available like in CommonJS
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

const redirect_uri = "http://localhost:3000";
const auth_endpoint = "https://accounts.spotify.com/authorize";
const response_type = "token";


// Middleware:
app.use(cors());
app.use(express.static("public"));
// - for stacit files (pictures etc), index.JS and all CSS files - put them all in the map 'public' so Express could serve them at request.
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); // Parsing the body of our request into URL

// Define main route- only for testing:
// app.get("/", (req, res) => {
//   res.send("Hello, World!");
// });
// SEND-request can be only ONE! - nothing else can be returned after that. Next SEND-requests following after this one will not be realised!

// Route for serving 'index.html':
// If index.html is in the same map as server.js (on the same 'hierarchy level'), the path to index.html should look like this:
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

// Global variable for storing access token (initially has no value):
let accessToken = null;
let tokenExpirationTime = null;  // New variable to track expiration time of the access token

// Asyncronous function to fetch access token (async - await terminology):
// function sends a POST request to Spotify API to retrieve an OAuth access token. 
// the request uses 'client_credentials'- grant type to authenticate the app.
// the access token is stored in a global variable 'accessToken'.
async function getAccessToken() {
  // URLSearchParams creates an object, which manages with URL-encoded parameters which should be sent in the body of our POST request.
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");  // app searches for token via Client Credentials Flow-a (app does this alone, without user, to get access token)
  params.append("client_id", clientId);   // ID of the aplication/project, received during app registration on Spotify Developers platform
  params.append("client_secret", clientSecret);  // secret key of the app, also received during app registration on Spotify Dev platform

  // fetch sends an HTTP request to the Spotify API. The function uses 'await' to wait for a response before continuing to execute the rest of the code.
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",   // HTTP POST method because we send data (authentication parameters) in the request body.
    headers: { "Content-Type": "application/x-www-form-urlencoded" },  // set headers that define the type of data we send. 
    // Content-Type is: "application/x-www-form-urlencoded", meaning that the data in the request body uses URL-encoded format.
    body: params,   // as the body of the request, we send the URL-encoded parameters (params) that we previously defined (grant_type, client_id, and client_secret).
  });

  // Log access token
 
  const data = await response.json();   // takes the response received from the API, and calls the json() method, 
  // which parses the response body from JSON format into a JavaScript object.
  // Since JSON parsing is asynchronous, await is used to stop the function until the JSON is parsed.
  if (!response.ok) {    // if response.ok is false (which means the response is an HTTP status code of 4xx or 5xx), then an error has occurred.
    throw new Error(`Error fetching token: ${data.error}`);
  }
  accessToken = data.access_token;   // ff the request was successful, the access_token field, which contains the access token, is extracted from the response (data).
  tokenExpirationTime = Date.now() + data.expires_in * 1000;  // The API returns the data expires_in, which represents the number of seconds the token is valid (eg 3600 seconds, which is 1 hour) - 
  // Date.now() - function returns current timestamp in milliseconds.
  // tokenExpirationTime: Calculates and stores the exact time (in milliseconds) when the token will expire. This allows checking that the token is still valid before it is used in subsequent requests.

  console.log("Access Token:", data.access_token);
  return accessToken;   // an accessToken is returned, allowing the function caller to use that token for future API requests.
 
}

// Endpoint to provide the fetched access token - function defines Express.js route /api/token which enables returning the Spotify access token via API.
// defining route:
app.get('/api/token', async (req, res) => {
  try {
    if (!accessToken || Date.now() >= tokenExpirationTime) {    // Check if access token is missing, or if it's expired
      accessToken = await getAccessToken();  // 1. If there is no token (either already expired, or not existing yet), it calls the already defined function 'getAccessToken' 
    }
    res.json({ accessToken });  // 2. Otherwise, if there is already a token fetched, this function returns the token as JSON
  } catch (error) {                             // 3. option: error handling
    console.error('Error fetching access token:', error);
    res.status(500).json({ error: 'Failed to fetch access token' });     // client receives the error message 500 with explanation text
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

// *** market = country code, 2 letters. HR - Croatia, GB - United Kingdom, US - United states of America, DE - Germany, ES - Spain...


// Ruta za prijedloge (sugestije) na temelju unosa
app.get("/api/suggestions", async (req, res) => {
  const query = req.query.q;  // Korisnički unos
  const type = req.query.type || 'artist,album,track';  // Tip pretrage, npr. artist, album, track
  
  const accessToken = await getAccessToken();  // Dohvati access token
  
  // URL za pretragu na Spotify API-ju
  const searchUrl = `https://api.spotify.com/v1/search?q=${query}&type=${type}&limit=5`;

  try {
    const response = await fetch(searchUrl, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.ok) {
      const searchResults = await response.json();
      res.json(searchResults);  // Vrati rezultate pretrage kao JSON
    } else {
      res.status(response.status).json({ error: "Search failed" });
    }
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    res.status(500).json({ error: "Failed to fetch suggestions" });
  }
});

// Ruta za dohvaćanje informacija o artistu
app.get("/artist/:id", async (req, res) => {
  const artistId = req.params.id; // ID artista iz URL-a
  const accessToken = await getAccessToken(); // Dohvati access token

  // URL za dohvaćanje informacija o artistu
  const artistUrl = `https://api.spotify.com/v1/artists/${artistId}`;

  const response = await fetch(artistUrl, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` }, // Postavi access token
  });

  if (response.ok) {
    const artistData = await response.json();
    res.json(artistData); // Vrati podatke o artistu kao JSON
  } else {
    res.status(response.status).json({ error: "Artist not found" });
  }
});

// Ruta za pretragu pjesama (npr. API-call to Spotify API):
app.get("/api/search", async (req, res) => {
  const query = req.query.q; // Pretraga pjesme
  const token = await getAccessToken(); // Dohvati access token

  // URL za pretragu na Spotify API-ju
  const searchUrl = `https://api.spotify.com/v1/search?q=${query}&type=track`;

  const response = await fetch(searchUrl, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (response.ok) {
    const searchResults = await response.json();
    res.json(searchResults); // Vrati rezultate pretrage
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

// Bash command for starting the server:
// node server.js  -OR-  nodemon server.js

// Result, if status ok:
// Server is running on port 3000
