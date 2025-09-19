const express = require("express");
const app = express();
// const mysql = require("mysql");
const cors = require("cors");
const path = require("path");
const corsOptions = {
  origin: ["http://localhost:5173"], 
  
};

app.use(cors(corsOptions));


const port = 8080; 

app.get("/", async (req, res) => {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=8");
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Pokemon data" });
  }
});

app.get("/memory-game", async (req, res) => {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=5");
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Pokemon data" });
  }
});

app.get("/pokedex", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    const data = await response.json();
    
    // Add pagination info
    const totalCount = data.count;
    const totalPages = Math.ceil(totalCount / limit);
    
    res.json({
      ...data,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalCount: totalCount,
        limit: limit,
        hasNext: data.next !== null,
        hasPrevious: data.previous !== null
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Pokemon data" });
  }
});

app.get("/search", async (req, res) => {
  try {
    const query = req.query.query?.toLowerCase().trim();
    
    if (!query) {
      return res.json([]);
    }

    // Fetch all Pokemon to search through them
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=2000");
    const data = await response.json();
    
    // Filter Pokemon by name
    const filteredPokemon = data.results.filter(pokemon =>
      pokemon.name.toLowerCase().includes(query)
    );
    
    res.json(filteredPokemon);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Failed to search Pokemon" });
  }
});

app.get("/:id", async (req, res) => {
  try {

    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${req.params.id}`
    );
    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch Pokemon data" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
