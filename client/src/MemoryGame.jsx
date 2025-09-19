import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import PokemonCard from "./components/PokemonCard.jsx";
import Navbar from "./components/navbar.jsx";
import Loading from "./components/Loading.jsx";
import AudioPlayer from "./components/AudioPlayer.jsx";

export default function MemoryGame() {
  const [pokemonCards, setPokemonCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoading, setShowLoading] = useState(true);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get("http://localhost:8080/memory-game");
        const data = await response.data;

        const cards = [];

        await Promise.all(
          data.results.map(async (poke) => {
            const details = (await axios.get(poke.url)).data;
            const speciesData = (await axios.get(details.species.url)).data;

            const pokemonData = {
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
            };

            // Create two identical cards for matching
            cards.push({ ...pokemonData, cardId: `${details.id}-1` });
            cards.push({ ...pokemonData, cardId: `${details.id}-2` });
          }),
        );

        const shuffledCards = shuffleArray(cards);
        setPokemonCards(shuffledCards);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch Pokemon");
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  const handleCardClick = (clickedCard) => {
    // Prevent clicking if card is already flipped or matched
    if (
      flippedCards.length === 2 ||
      flippedCards.some((card) => card.cardId === clickedCard.cardId) ||
      matchedCards.includes(clickedCard.id)
    ) {
      return;
    }

    const newFlippedCards = [...flippedCards, clickedCard];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setAttempts((prev) => prev + 1);

      // Check if cards match
      if (newFlippedCards[0].id === newFlippedCards[1].id) {
        // Match found
        setMatchedCards((prev) => [...prev, clickedCard.id]);
        setScore((prev) => prev + 10);
        setFlippedCards([]);

        // Check if game is won
        if (matchedCards.length + 1 === pokemonCards.length / 2) {
          setGameWon(true);
        }
      } else {
        // No match - flip cards back after delay
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    setFlippedCards([]);
    setMatchedCards([]);
    setScore(0);
    setAttempts(0);
    setGameWon(false);
    setPokemonCards((prev) => shuffleArray([...prev]));
  };

  const isCardFlipped = (card) => {
    return (
      flippedCards.some((flipped) => flipped.cardId === card.cardId) ||
      matchedCards.includes(card.id)
    );
  };

  const isCardMatched = (card) => {
    return matchedCards.includes(card.id);
  };

  if (loading) return <div className="bg-text-primary"></div>;
  if (error) return <div>{error}</div>;

  const handleLoadingComplete = () => {
    setShowLoading(false);
  };

  return (
    <div className="from-rock-base via-rock-light to-rock-lightest flex min-h-screen w-screen flex-col items-center justify-center bg-gradient-to-r bg-cover bg-center">
      {/* {showLoading && (
        <Loading isDataLoading={loading} onComplete={handleLoadingComplete} />
      )} */}

      <AudioPlayer />
      <Navbar />

      <div className="mt-16 flex w-full flex-col items-center">
        {/* Game Header */}
        {/* <div className="mb-8 text-center">
          <div className="flex justify-center gap-8 text-lg font-semibold text-white [text-shadow:1px_1px_2px_rgba(0,0,0,0.8)]">
            <div>Score: {score}</div>
            <div>Attempts: {attempts}</div>
            <div>
              Matches: {matchedCards.length}/{pokemonCards.length / 2}
            </div>
            <button
              onClick={resetGame}
              className="rounded-lg bg-red-500 px-6 py-2 font-semibold text-white transition-colors hover:bg-red-600"
            >
              Reset Game
            </button>
          </div>
        </div> */}

        {/* Game Won Modal */}
        {gameWon && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="rounded-lg bg-white p-8 text-center shadow-2xl">
              <h2 className="mb-4 text-3xl font-bold text-green-600">
                🎉 Congratulations! 🎉
              </h2>
              <p className="mb-2 text-lg">You won the game!</p>
              <p className="mb-4 text-gray-600">
                Score: {score} | Attempts: {attempts}
              </p>
              <button
                onClick={resetGame}
                className="rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {/* Game Board */}
        <div className="flex w-[1400px] flex-wrap justify-center gap-0">
          {pokemonCards.map((card) => (
            <div
              key={card.cardId}
              onClick={() => handleCardClick(card)}
              className="h-[297px] w-[244.8px] cursor-pointer"
            >
              <div
                className={`transform-style-preserve-3d transition-transform duration-700 ${isCardFlipped(card) ? "rotate-y-180" : ""} ${!isCardFlipped(card) ? "hover:scale-105" : ""}`}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Card Back - Only visible when not flipped */}
                <div
                  className="backface-hidden"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="bg-pokeball-blue w-68 scale-85 h-[330px] rounded-lg border-2 border-gray-300 p-4 shadow-lg transition-shadow hover:shadow-xl">
                    <div className="flex h-full w-full items-center justify-center rounded-lg border-4 border-white">
                      <img
                        src="/assets/Pokemon.svg"
                        alt="pokeball"
                        className="mx-auto mb-2 h-16 w-16"
                      />
                    </div>
                  </div>
                </div>

                {/* Card Front - Only visible when flipped */}
                <div
                  className="backface-hidden rotate-y-180 absolute inset-0"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <PokemonCard pokemon={card} className="scale-85" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
