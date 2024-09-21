require("dotenv").config(); // Učitaj dotenv
const express = require("express");

const cors = require("cors");

// Inicijaliziraj Express aplikaciju
const app = express();

// Definiraj port
const PORT = process.env.PORT || 3000;

//Dodaci, ako treba:

app.use(cors());
// app.use(morgan('dev'));
app.use(express.static("public"));
// - za statične fileove (slike i sl. - staviti u mapu public da bi ih Express mogao poslužiti)
app.use(express.json());

// Definiraj osnovnu rutu - samo za testiranje, kasnije maknuti jer se inače sljedeće rute nikad neće izvršiti:
// app.get("/", (req, res) => {
//   res.send("Hello, World!");
// });

// Alternativni request:
// Ako se index.html nalazi u istoj mapi kao i server.js, putanja bi trebala izgledati ovako:
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Definiraj dodatne rute (ako treba):
app.get("/api/data", (req, res) => {
  res.json({ message: "This is some data" });
});

// Logika za pretraživanje pjesama (npr. poziv na Spotify API):
app.get("/api/search", async (req, res) => {
  const query = req.query.q;
});

// Dorađeni endpoint na serveru za traženje artista, pjesme ili albuma:
app.get("/api/suggestions", (req, res) => {
  const query = req.query.q;
  // Ovdje dodaj logiku za pretraživanje (npr. u bazi podataka)
  // Pretpostavljam da ćeš imati funkciju koja vraća rezultate
  const results = searchDatabaseForSuggestions(query); // Ovo je tvoja logika
  res.json({ results });
});

// Error handling middleware:
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Pokreni server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// bash naredba za pokretanje servera: 
// node server.js

// Rezultat, ako je sve ok:
// Server is running on port 3000
