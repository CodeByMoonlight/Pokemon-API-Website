const express = require("express");
const app = express();
// const mysql = require("mysql");
const cors = require("cors");
const path = require("path");
const corsOptions = {
  origin: ["http://localhost:5173"], // Adjust the port if necessary
  // optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// app.use(express.static(path.join(__dirname, "public")));
// app.use(express.json());

const port = 8080; //Or 8000

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "password",
//   database: "pokemon_db",
// });

// app.get("/api", (req, res) => {
//   res.json({ fruits: ["apple", "banana", "orange"] });
// });

app.get("/", async (req, res) => {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Pokemon data" });
  }
});

app.get("/memory-game", async (req, res) => {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Pokemon data" });
  }
});

app.get("/pokedex", async (req, res) => {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Pokemon data" });
  }
});

app.get("/:id", async (req, res) => {
  try {
    // Fetch Pokemon details
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${req.params.id}`
    );
    const data = await response.json();
    res.json(data);

    // Fetch species data
    // const speciesResponse = await fetch(details.species.url);
    // const speciesData = await speciesResponse.json();

    // res.json({
    //   ...details,
    //   species: {
    //     ...details.species,
    //     url: speciesData.url,
    //   },
    // });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch Pokemon data" });
  }
});

// You can also get a specific Pokemon by ID
// app.get("/api/pokemon/:id", async (req, res) => {
//   try {
//     const response = await fetch(
//       `https://pokeapi.co/api/v2/pokemon/${req.params.id}`
//     );
//     const data = await response.json();
//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch Pokemon data" });
//   }
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
