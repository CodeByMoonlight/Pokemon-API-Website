import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import PokemonCard from "./components/PokemonCard.jsx";
import Navbar from "./components/navbar.jsx";
import AudioPlayer from "./components/AudioPlayer.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfettiSideCannons } from "./components/ui/confetti.jsx";

export default function MemoryGame() {
  const [pokemonCards, setPokemonCards] = useState([]);
  const [error, setError] = useState(null);
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
              speciesData.names.find((name) => name.language.name === "ja-Hrkt")
                ?.name || details.name,
            sprite: details.sprites.other["official-artwork"].front_default,
            types: details.types.map((t) => t.type.name),
            habitat: speciesData.habitat?.name || "unknown",
            generation: speciesData.generation?.name || "unknown",
          };

          cards.push({ ...pokemonData, cardId: `${details.id}-1` });
          cards.push({ ...pokemonData, cardId: `${details.id}-2` });
        }),
      );

      const shuffledCards = shuffleArray(cards);
      setPokemonCards(shuffledCards);
    } catch (err) {
      setError("Failed to fetch Pokemon");
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  const handleCardClick = (clickedCard) => {
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

      if (newFlippedCards[0].id === newFlippedCards[1].id) {
        setMatchedCards((prev) => [...prev, clickedCard.id]);
        setScore((prev) => prev + 10);
        setFlippedCards([]);

        if (matchedCards.length + 1 === pokemonCards.length / 2) {
          setGameWon(true);
        }
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const resetGame = async () => {
    setFlippedCards([]);
    setMatchedCards([]);
    setScore(0);
    setAttempts(0);
    setGameWon(false);
    await fetchPokemon();
  };

  const isCardFlipped = (card) => {
    return (
      flippedCards.some((flipped) => flipped.cardId === card.cardId) ||
      matchedCards.includes(card.id)
    );
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="relative flex h-full w-screen flex-col items-center justify-center overflow-auto xl:h-screen xl:overflow-hidden">
      <AudioPlayer />
      <Navbar />

      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <img
          src="/assets/game_bg.gif"
          alt="Game Background"
          className="h-full w-full object-cover blur-[2px]"
        />
        <div className="bg-text-tertiary absolute inset-0 mix-blend-multiply"></div>
      </div>

      <div className="relative z-10 mt-24 flex flex-col items-center xl:h-[670px]">
        {/* Game Header */}
        <div className="px -8 w-full xl:w-[1240px]">
          <div className="flex flex-row items-center justify-between gap-4">
            <div className="flex flex-row items-center justify-center gap-6">
              <div className="stat backdrop-blur-sm">Score: {score}</div>
              <div className="stat backdrop-blur-sm">Attempts: {attempts}</div>
              <div className="stat backdrop-blur-sm">
                Matches: {matchedCards.length}/{pokemonCards.length / 2}
              </div>
            </div>
            <button
              onClick={resetGame}
              className="main-btn rounded-[8px] px-5 py-2 text-sm backdrop-blur-sm sm:text-base md:text-lg"
            >
              Reset Game
            </button>
          </div>
        </div>

        <Dialog open={gameWon} onOpenChange={setGameWon}>
          <DialogContent>
            <DialogHeader className="flex flex-col items-center justify-center">
              <DialogTitle className="pb-2 text-3xl font-bold">
                🎉 Congratulations! 🎉
              </DialogTitle>
              <DialogDescription className="flex flex-col items-center justify-center gap-4">
                <p>You have successfully completed the game!</p>
                <p>
                  Score: {score} | Attempts: {attempts}
                </p>
                <button
                  onClick={resetGame}
                  className="main-btn rounded-[8px] px-5 py-2 text-sm sm:text-base md:text-lg"
                >
                  Play Again
                </button>
                <ConfettiSideCannons />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        {/* Game Board */}
        <div className="relative z-10 -m-2 flex w-full flex-wrap justify-center xl:max-w-[1400px]">
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
                {/* Card Back - Visible when not flipped */}
                <div
                  className="backface-hidden"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="bg-pokeball-blue w-68 scale-85 h-[330px] rounded-lg border-2 border-gray-300 p-4 shadow-lg transition-shadow hover:shadow-xl">
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg border-4 border-white">
                      <img
                        src="/assets/Pokemon.svg"
                        alt="pokeball"
                        className="mx-auto mb-2 h-16 w-16"
                      />
                      <p className="text-center font-medium text-white">
                        Click to Flip
                      </p>
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
