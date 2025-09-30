const express = require("express");
const app = express();
// const mysql = require("mysql");
const cors = require("cors");
const path = require("path");
const db = require('./db'); // Import the database connection

const corsOptions = {
  origin: ["http://localhost:5173"], 
};

app.use(cors(corsOptions));
app.use(express.json()); // Add this to parse JSON bodies
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

app.get('/rank', (req, res) => {
  const limit = parseInt(req.query.limit) || 10; // Default to top 10 scores

  db.all(
    `SELECT username, pokemon_id, score, date FROM players ORDER BY score DESC LIMIT ?`,
    [limit],
    (err, rows) => {
      if (err) {
        console.error('Error fetching leaderboard data:', err.message);
        res.status(500).json({ error: 'Failed to fetch leaderboard data' });
      } else {
        res.json(rows);
      }
    }
  );
});

// Get custom Pokemon story from database
app.get('/pokemon/:id/story', (req, res) => {
  const pokemonId = parseInt(req.params.id);
  
  db.get(
    'SELECT story FROM pokemons WHERE pokemon_id = ?',
    [pokemonId],
    (err, row) => {
      if (err) {
        console.error('Error fetching Pokemon story:', err.message);
        res.status(500).json({ error: 'Failed to fetch Pokemon story' });
      } else {
        res.json({ story: row ? row.story : null });
      }
    }
  );
});

// Update or create custom Pokemon story
app.put('/pokemon/:id/story', (req, res) => {
  const pokemonId = parseInt(req.params.id);
  const { story } = req.body;
  
  if (!story) {
    return res.status(400).json({ error: 'Story is required' });
  }
  
  // First check if Pokemon story exists
  db.get(
    'SELECT id FROM pokemons WHERE pokemon_id = ?',
    [pokemonId],
    (err, row) => {
      if (err) {
        console.error('Error checking Pokemon story:', err.message);
        return res.status(500).json({ error: 'Failed to check Pokemon story' });
      }
      
      if (row) {
        // Update existing story
        db.run(
          'UPDATE pokemons SET story = ? WHERE pokemon_id = ?',
          [story, pokemonId],
          function(err) {
            if (err) {
              console.error('Error updating Pokemon story:', err.message);
              res.status(500).json({ error: 'Failed to update Pokemon story' });
            } else {
              res.json({ message: 'Pokemon story updated successfully', pokemonId, story });
            }
          }
        );
      } else {
        // Create new story
        db.run(
          'INSERT INTO pokemons (pokemon_id, story) VALUES (?, ?)',
          [pokemonId, story],
          function(err) {
            if (err) {
              console.error('Error creating Pokemon story:', err.message);
              res.status(500).json({ error: 'Failed to create Pokemon story' });
            } else {
              res.json({ message: 'Pokemon story created successfully', pokemonId, story });
            }
          }
        );
      }
    }
  );
});

// Delete custom Pokemon story
app.delete('/pokemon/:id/story', (req, res) => {
  const pokemonId = parseInt(req.params.id);
  
  db.run(
    'DELETE FROM pokemons WHERE pokemon_id = ?',
    [pokemonId],
    function(err) {
      if (err) {
        console.error('Error deleting Pokemon story:', err.message);
        res.status(500).json({ error: 'Failed to delete Pokemon story' });
      } else {
        if (this.changes === 0) {
          res.status(404).json({ error: 'Pokemon story not found' });
        } else {
          res.json({ message: 'Pokemon story deleted successfully', pokemonId });
        }
      }
    }
  );
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
