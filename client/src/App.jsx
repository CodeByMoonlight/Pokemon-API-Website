import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import PokemonCard from "./components/PokemonCard";
import { Link } from "react-router-dom";
import Navbar from "./components/navbar.jsx";
import AudioPlayer from "./components/AudioPlayer.jsx";
import Footer from "./components/Footer.jsx";
import Loading from "./components/Loading.jsx";

function App() {
  const [pokemonCard, setPokemonCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoading, setShowLoading] = useState(true);

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
                  (name) => name.language.name === "ja-Hrkt",
                )?.name || details.name,
              sprite: details.sprites.other["official-artwork"].front_default,
              types: details.types.map((t) => t.type.name),
              habitat: speciesData.habitat?.name || "unknown",
              generation: speciesData.generation?.name || "unknown",
            });
          }),
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

  const handleLoadingComplete = () => {
    setShowLoading(false);
  };

  if (loading) return <div className="bg-text-primary"></div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col items-center justify-center gap-36">
      {showLoading && (
        <Loading isDataLoading={loading} onComplete={handleLoadingComplete} />
      )}

      <AudioPlayer />

      <Navbar />

      {/*Header */}
      <div id="header" className="relative">
        <img
          src="/assets/transition.svg"
          alt="transition_img"
          className="absolute left-0 top-60 h-full w-full object-cover"
        />

        <img
          src="/assets/hero.gif"
          alt="hero_img"
          className="h-[1080px] w-screen bg-cover bg-center object-cover"
        />
      </div>

      <div
        id="pokedex"
        className="flex max-w-[1080px] flex-col items-center justify-center gap-10 pt-24"
      >
        <div className="flex flex-col gap-16">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="flex flex-row items-center justify-center gap-5">
              <img
                src="/assets/Pokemon.svg"
                alt="pokeball"
                className="bg-text-primary border-text-primary h-16 w-16 rounded-full border-2"
              />
              <h1 className="header">POKÉDEX</h1>
              <img
                src="/assets/Pokemon.svg"
                alt="pokeball"
                className="bg-text-primary border-text-primary h-16 w-16 rounded-full border-2"
              />
            </div>

            <p className="subtitle">
              The Pokédex is your ultimate guide to the world of Pokémon. Browse
              through a complete collection of Pokémon, each with detailed
              information on their types, abilities, stats, evolutions, and
              more.
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
      </div>

      <div
        id="game"
        className="pt-25 flex flex-row items-center justify-center gap-10"
      >
        <div className="flex w-[750px] flex-col items-center justify-center gap-5 text-center">
          <h1 className="header">MEMORY GAME</h1>
          <p className="subtitle mb-5">
            Challenge yourself to match all the Pokémon pairs hidden on the
            board. Stay sharp, move fast, and prove that your memory is as
            strong as your battling skills
          </p>
          <Link to="/memory-game">
            <button className="main-btn">Play Game</button>
          </Link>
        </div>
        <div className="w-1/2">
          <img
            src="/assets/memory.png"
            alt="memory game"
            className="w-2xl object-cover"
          />
        </div>
      </div>

      <div className="relative">
        <img
          src="/assets/transition.svg"
          alt="logo"
          className="absolute left-0 top-0 h-[650px] w-full rotate-180 object-cover"
        />
        <img
          src="/assets/test.jpg"
          className="h-screen w-screen bg-cover bg-center object-cover"
        />
        <Footer />
      </div>
    </div>
  );
}

export default App;
