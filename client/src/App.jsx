import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import PokemonCard from "./components/PokemonCard";
import { Link } from "react-router-dom";

function App() {
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
    <div className="flex flex-col justify-center items-center ">
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
      <div className="relative mb-80">
        <img
          src="/assets/transition.svg"
          alt="transition_img"
          className="absolute top-60 left-0 w-full h-auto object-cover"
        />

        <img
          src="/assets/hero.gif"
          alt="hero_img"
          className="bg-cover bg-center w-screen h-[1080px] object-cover"
        />
      </div>

      <div className="flex flex-col justify-center items-center gap-10 max-w-[1080px]">
        <div className="">
          <div className="">
            <h1 className="header">Pokedex</h1>
            <p>
              Welcome to the Pokedex! Here you can find information about all
              your favorite Pokemon.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-5">
            {pokemonCard.map((poke, index) => (
              <Link to={`/view/${poke.id}`} key={index}>
                <PokemonCard pokemon={poke} />
              </Link>
            ))}
          </div>
          <Link to="/pokedex">
            <button className="main-btn">View More</button>
          </Link>
        </div>

        <div className="flex flex-row justify-center items-center gap-10">
          <div>
            <h1 className="header">Memory Game</h1>
            <p>
              Welcome to the Memory Game! Here you can test your memory skills
              with your favorite Pokemon.
            </p>
            <Link to="/memory-game">
              <button className="main-btn">Play Memory Game</button>
            </Link>
          </div>
          <img
            src="/assets/memory.png"
            alt="memory game"
            className="w-lg object-cover"
          />
        </div>
      </div>

      <div className="relative overflow-hidden">
        <img
          src="/assets/transition.svg"
          alt="logo"
          className="absolute top-0 left-0 w-full object-cover rotate-180"
        />

        <img
          src="/assets/footer.gif"
          className="bg-cover bg-center w-screen h-screen object-cover mt-50"
        />
        {/* Footer */}
      </div>
    </div>
  );
}

export default App;
