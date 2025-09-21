import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import PokemonCard from "./components/PokemonCard";
import { Link } from "react-router-dom";
import NavigationLink from "./components/NavigationLink";
import Navbar from "./components/navbar.jsx";
import AudioPlayer from "./components/AudioPlayer.jsx";
import Footer from "./components/Footer.jsx";
import Loading from "./components/Loading.jsx";
import ScrollReveal from "./components/ScrollReveal.jsx";

function App() {
  // State for Pokemon data
  const [pokemonCard, setPokemonCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if this is the first visit in this session
  const [showLoading, setShowLoading] = useState(() => {
    return !sessionStorage.getItem("hasSeenLoading");
  });

  const handleLoadingComplete = () => {
    setShowLoading(false);
    // Mark that loading has been seen in this session
    sessionStorage.setItem("hasSeenLoading", "true");
  };

  // Fetch initial 20 Pokemon for homepage
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

  // Smooth scroll to pokedex section
  const scrollToPokedex = () => {
    const pokedexSection = document.getElementById("pokedex");
    if (pokedexSection) {
      const targetPosition =
        pokedexSection.getBoundingClientRect().top + window.scrollY;
      const startPosition = window.scrollY;
      const distance = targetPosition - startPosition;
      const duration = 1000;
      let start = null;

      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const easeInOutQuad = (t) =>
          t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const scrollProgress = easeInOutQuad(Math.min(progress / duration, 1));
        window.scrollTo(0, startPosition + distance * scrollProgress);
        if (progress < duration) {
          window.requestAnimationFrame(step);
        }
      };

      window.requestAnimationFrame(step);
    }
  };

  if (loading) return <div></div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col items-center justify-center gap-36">
      {showLoading && (
        <Loading isDataLoading={loading} onComplete={handleLoadingComplete} />
      )}

      <Navbar />

      {/*Header */}
      <div
        id="header"
        className="relative flex flex-col items-center justify-center"
      >
        <img
          src="/assets/transition.svg"
          alt="transition_img"
          className="absolute left-0 top-60 h-full w-full object-cover"
        />
        <div className="-translate-y-70 absolute top-1/2 flex h-fit flex-col items-center justify-center">
          <h2 className="Russo-One text-[66px] font-bold text-white [text-shadow:3px_3px_4px_rgba(0,0,0,0.6)]">
            Catch ’Em All Online
          </h2>
          <p className="mb-6 w-[600px] text-lg font-semibold text-white [text-shadow:3px_2px_4px_rgba(0,0,0,0.8)]">
            Explore the complete Pokédex, challenge yourself with fun memory
            games, and see just how well you know your favorite Pokémon.
          </p>
          <a
            onClick={scrollToPokedex}
            className="game-font transform cursor-pointer rounded-full p-5 text-center [text-shadow:3px_3px_4px_rgba(0,0,0,0.6)] hover:scale-105"
          >
            START EXPLORING
          </a>
        </div>

        <img
          src="/assets/hero.gif"
          alt="hero_img"
          className="h-[1080px] w-screen bg-cover bg-center object-cover"
        />
      </div>

      {/*Pokedex */}
      <ScrollReveal direction="fade" duration={1000}>
        <div
          id="pokedex"
          className="flex max-w-[1150px] flex-col items-center justify-center gap-10 pt-24"
        >
          <div className="flex flex-col gap-16">
            <ScrollReveal direction="up" delay={200}>
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
                  The Pokédex is your ultimate guide to the world of Pokémon.
                  Browse through a complete collection of Pokémon, each with
                  detailed information on their types, abilities, stats,
                  evolutions, and more.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={400}>
              <div className="flex flex-wrap justify-center gap-5">
                {pokemonCard.map((poke, index) => (
                  <ScrollReveal
                    key={index}
                    direction="up"
                    delay={100 * (index + 1)}
                    duration={600}
                  >
                    <Link to={`/view/${poke.id}`}>
                      <PokemonCard pokemon={poke} />
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={500}>
              <NavigationLink
                to="/pokedex"
                loadingOptions={{ minLoadingTime: 1500 }}
              >
                <button className="main-btn">View More</button>
              </NavigationLink>
            </ScrollReveal>
          </div>
        </div>
      </ScrollReveal>

      {/*Game */}
      <ScrollReveal direction="up" duration={2000}>
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
            <NavigationLink
              to="/memory-game"
              loadingOptions={{ minLoadingTime: 1200 }}
            >
              <button className="main-btn">Play Game</button>
            </NavigationLink>
          </div>

          <div className="w-1/2">
            <img
              src="/assets/memory.png"
              alt="memory game"
              className="w-2xl object-cover"
            />
          </div>
        </div>
      </ScrollReveal>

      {/*Footer */}
      <div className="relative flex flex-col items-center">
        <img
          src="/assets/transition.svg"
          alt="logo"
          className="absolute left-0 top-0 h-[650px] w-full rotate-180 object-cover"
        />

        <img
          src="/assets/Pokemon Logo Pixel.png"
          alt="logo"
          className="absolute bottom-0 top-80 w-[500px] object-cover"
        />

        <img
          src="/assets/footer_img.gif"
          className="h-[800px] w-screen bg-cover bg-center object-cover object-top"
        />
        <Footer />
        <AudioPlayer />
      </div>
    </div>
  );
}

export default App;
