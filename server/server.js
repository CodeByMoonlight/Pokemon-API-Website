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
    // Get total count first to know the range
    const countResponse = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1");
    const countData = await countResponse.json();
    const totalPokemon = countData.count;
    
    // Generate 5 random Pokemon IDs (we need 5 for 10 cards - 5 pairs)
    const randomIds = [];
    while (randomIds.length < 5) {
      const randomId = Math.floor(Math.random() * Math.min(totalPokemon, 1010)) + 1; // Limit to first 1010 for better artwork
      if (!randomIds.includes(randomId)) {
        randomIds.push(randomId);
      }
    }
    
    // Fetch the random Pokemon
    const randomPokemon = await Promise.all(
      randomIds.map(async (id) => {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await response.json();
        return {
          name: data.name,
          url: `https://pokeapi.co/api/v2/pokemon/${id}/`
        };
      })
    );
    
    res.json({
      count: randomPokemon.length,
      results: randomPokemon
    });
  } catch (error) {
    console.error("Memory game fetch error:", error);
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
