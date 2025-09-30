import { useState, useEffect } from "react";

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
      <AudioPlayer />

      {/*Header */}
      <div
        id="header"
        className="relative flex flex-col items-center justify-center"
      >
        <img
          src="/assets/transition.svg"
          alt="transition_img"
          className="absolute left-0 top-36 h-full w-full object-cover md:top-40 lg:top-56 xl:top-60"
        />
        <div className="xl:-translate-y-68 absolute top-1/2 flex h-fit -translate-y-24 flex-col items-center justify-center gap-3 text-center text-white [text-shadow:4px_4px_3px_rgba(0,0,0,0.4)] sm:-translate-y-36 lg:-translate-y-44">
          <h2 className="Russo-One text-4xl font-bold sm:text-5xl md:text-6xl xl:text-7xl">
            Catch 'Em All Online
          </h2>
          <p className="max-w-3/5 mb-4 text-sm font-semibold sm:text-base md:text-lg">
            Explore the complete Pokédex, challenge yourself with fun memory
            games, and see just how well you know your favorite Pokémon.
          </p>
          <button
            onClick={scrollToPokedex}
            className="game-font blur-in-md rounded-full bg-white/40 p-4 text-[0.625rem] [text-shadow:2px_2px_3px_rgba(0,0,0,0.7)] hover:scale-105 lg:p-5 lg:text-xs"
          >
            START EXPLORING
          </button>
        </div>

        <img
          src="/assets/hero.gif"
          alt="hero_img"
          className="h-[42.5rem] w-screen bg-cover bg-center object-cover sm:h-[48.75rem] md:h-[55rem] lg:h-[61.25rem] xl:h-[67.5rem]"
        />
      </div>

      {/*Body*/}
      <div className="flex flex-col items-center justify-center gap-36">
        {/*Pokedex */}
        <ScrollReveal direction="fade" duration={1000}>
          <div
            id="pokedex"
            className="flex max-w-[72rem] flex-col items-center justify-center gap-10 pt-16 sm:pt-20"
          >
            <div className="flex flex-col gap-12">
              <ScrollReveal direction="up" delay={200}>
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="flex flex-row items-center justify-center gap-5">
                    <img
                      src="/assets/Pokemon.svg"
                      alt="pokeball"
                      className="pokeball-header h-10 w-10 sm:h-14 sm:w-14 md:h-16 md:w-16"
                    />
                    <h1 className="header text-5xl md:text-6xl">POKÉDEX</h1>
                    <img
                      src="/assets/Pokemon.svg"
                      alt="pokeball"
                      className="pokeball-header h-10 w-10 sm:h-14 sm:w-14 md:h-16 md:w-16"
                    />
                  </div>

                  <p className="subtitle xl:w-7/10 lg:w-9/10 px-2 text-sm sm:px-4 sm:text-base md:px-6 md:text-base">
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

              <ScrollReveal direction="up" delay={200}>
                <NavigationLink
                  to="/pokedex"
                  loadingOptions={{ minLoadingTime: 1500 }}
                >
                  <button className="main-btn rounded-lg px-5 py-3 text-sm sm:text-base md:text-lg">
                    View More
                  </button>
                </NavigationLink>
              </ScrollReveal>
            </div>
          </div>
        </ScrollReveal>

        {/*Game */}
        <ScrollReveal direction="up" duration={1700}>
          <div
            id="game"
            className="flex max-w-[80rem] flex-col items-center justify-center gap-10 px-8 pt-20 lg:flex-row"
          >
            <div className="w-max-[46rem] order-2 flex flex-col items-center justify-center gap-5 text-center lg:order-1">
              <h1 className="header text-5xl md:text-6xl">MEMORY GAME</h1>
              <p className="subtitle mb-5 text-sm sm:text-base">
                Challenge yourself to match all the Pokémon pairs hidden on the
                board. Stay sharp, move fast, and prove that your memory is as
                strong as your battling skills
              </p>
              <NavigationLink
                to="/memory-game"
                loadingOptions={{ minLoadingTime: 1200 }}
              >
                <button className="main-btn rounded-lg px-5 py-3 text-sm sm:text-base md:text-lg">
                  Play Game
                </button>
              </NavigationLink>
            </div>

            <div className="xl:max-w-1/2 order-1 max-w-[28rem] lg:order-2">
              <img
                src="/assets/memory.png"
                alt="memory game"
                className="w-full object-cover"
              />
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/*Footer */}
      <div className="relative flex flex-col items-center">
        <img
          src="/assets/transition.svg"
          alt="logo"
          className="absolute left-0 top-0 w-full rotate-180 object-cover sm:h-[32rem] lg:h-[40rem]"
        />

        <img
          src="/assets/Pokemon Logo Pixel.png"
          alt="logo"
          className="lg:top-76 absolute bottom-0 top-44 w-[20rem] object-cover sm:top-52 sm:w-[25rem] md:w-[32rem] xl:top-80"
        />

        <img
          src="/assets/footer_img.gif"
          className="h-[32rem] w-screen bg-cover bg-center object-cover object-top sm:h-[34rem] md:h-[40rem] lg:h-[46rem] xl:h-[50rem]"
        />
        <Footer />
      </div>
    </div>
  );
}

export default App;
