import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import PokemonCard from "./components/PokemonCard";
import PokemonView from "./PokemonView";
import { Link } from "react-router-dom";

export default function MemoryGame() {
  const [pokemonCard, setPokemonCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get("http://localhost:8080/");
        const data = await response.data;

        const card = [];

        await Promise.all(
          data.results.map(async (poke) => {
            const details = (await axios.get(poke.url)).data;
            const speciesData = (await axios.get(details.species.url)).data;

            card.push({
              id: details.id,
              en_name: details.name,
              jp_name:
                speciesData.names.find(
                  (name) => name.language.name === "ja-Hrkt"
                )?.name || details.name,
              sprite: details.sprites.other["official-artwork"].front_default,
              types: details.types.map((t) => t.type.name),
              habitat: speciesData.habitat?.name || "unknown",
              generation: speciesData.generation?.name || "unknown",
            });
          })
        );

        card.sort((a, b) => a.id - b.id);

        setPokemonCard(card);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch Pokemon");
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col justify-center items-center bg-[url('/assets/game_bg.jpg')] bg-cover bg-center w-screen ">
      <nav className="fixed top-0 left-0 right-0 bg-white/50 backdrop-blur-sm flex flex-row justify-between items-center w-full px-6 py-3 z-50">
        <img src="/assets/logo.png" alt="logo" className="w-32" />
        <div className="flex flex-row gap-12">
          <Link to="/" className="nav-item">
            Home
          </Link>
          <Link to="/pokedex" className="nav-item">
            Pokedex
          </Link>
          <Link to="/memory-game" className="nav-item">
            Memory Game
          </Link>
        </div>
      </nav>

      <div className="flex flex-col justify-center items-center gap-10 max-w-[1080px]">
        <div className="flex flex-wrap justify-center gap-5">
          {pokemonCard.map((poke, index) => (
            <Link to={`/view/${poke.id}`} key={index}>
              <PokemonCard pokemon={poke} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
