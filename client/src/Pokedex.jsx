import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import PokemonCard from "./components/PokemonCard";
import PokemonView from "./PokemonView";
import { Link } from "react-router-dom";
import Navbar from "./components/navbar.jsx";
import Loading from "./components/Loading.jsx";
import AudioPlayer from "./components/AudioPlayer.jsx";

export default function Pokedex() {
  const [pokemonCard, setPokemonCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoading, setShowLoading] = useState(true);
  const handleLoadingComplete = () => {
    setShowLoading(false);
  };

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

  if (loading) return <div className="bg-text-primary"></div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col items-center justify-center">
      {showLoading && (
        <Loading isDataLoading={loading} onComplete={handleLoadingComplete} />
      )}

      <AudioPlayer />
      <Navbar />

      <div className="relative">
        <img
          src="/assets/pokedex_hero.gif"
          alt="hero_img"
          className="h-[450px] w-screen bg-cover bg-center object-cover"
        />
      </div>

      <div className="m-20 flex max-w-[1080px] flex-col items-center justify-center gap-10">
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
