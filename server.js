require("dotenv").config(); // load 'dotenv' file

// load Express:
const express = require("express");

const cors = require("cors");

// Initialize Express app:
const app = express();

// Define port:
const PORT = process.env.PORT || 3000;

//Additionally, if needed:

app.use(cors());
// app.use(morgan('dev'));
app.use(express.static("public"));
// - for stacit files (pictures etc), index.JS and all CSS files - put them all in the map 'public' so Express could serve them at request.
app.use(express.json());

// Define main route- only for testing: 

// app.get("/", (req, res) => {
//   res.send("Hello, World!");
// });
// SEND-request can be only ONE! - nothing else can be returned after that. Next SEND-requests following after this one will not be realised!


// Alternative request:
// If index.html is in the same map as server.js (on the same 'hierarchy level'), the path to index.html should look like this:
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Define additional routes (if needed):
app.get("/api/data", (req, res) => {
  res.json({ message: "This is some data" });
});

// Logic for searching songs (npr. API-call to Spotify API):
app.get("/api/search", async (req, res) => {
  const query = req.query.q;
});

// Edited endpoint for searching artist, song or album:
app.get("/api/suggestions", (req, res) => {
  const query = req.query.q;
  // Add logic for searching (from API-documentation - Search)
  // Add logic for returning results
  const results = searchDatabaseForSuggestions(query); // current logic for saving results
  res.json({ results });
});

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
