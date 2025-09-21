import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import PokemonCard from "./components/PokemonCard.jsx";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "./components/navbar.jsx";
import AudioPlayer from "./components/AudioPlayer.jsx";
import { Input } from "@/components/ui/input";
import { CircleChevronRight } from "lucide-react";
import { CircleChevronLeft } from "lucide-react";

export default function Pokedex() {
  // State for Pokemon data
  const { pageNumber } = useParams();
  const [pokemonCard, setPokemonCard] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(parseInt(pageNumber) || 1);
  const [pagination, setPagination] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  // Update currentPage when pageNumber param changes
  useEffect(() => {
    const pageFromUrl = parseInt(pageNumber) || 1;
    setCurrentPage(pageFromUrl);
  }, [pageNumber]);

  // Fetch Pokemon for the current page
  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/pokedex?page=${currentPage}&limit=20`,
        );
        const data = await response.data;
        const card = [];

        setPagination(data.pagination);

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
      } catch (err) {
        setError("Failed to fetch Pokemon");
      }
    };

    fetchPokemon();
  }, [currentPage]);

  // Pagination handlers
  const handlePreviousPage = () => {
    if (pagination && pagination.hasPrevious) {
      const newPage = currentPage - 1;
      navigate(`/pokedex/page/${newPage}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (pagination && pagination.hasNext) {
      const newPage = currentPage + 1;
      navigate(`/pokedex/page/${newPage}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPage = (pageNum) => {
    navigate(`/pokedex/page/${pageNum}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPaginationNumbers = () => {
    if (!pagination) return null;

    const { currentPage, totalPages } = pagination;
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`h-10 w-10 rounded-md transition-colors ${
            i === currentPage
              ? "bg-pokeball-blue text-white"
              : "text-text-primary border-text-tertiary hover:bg-pokeball-blue hover:border-pokeball-blue border-2 bg-white hover:text-white"
          }`}
        >
          {i}
        </button>,
      );
    }

    return (
      <div className="flex items-center justify-center gap-4 py-4">
        {startPage > 1 && (
          <>
            <button
              onClick={() => goToPage(1)}
              className="text-text-primary border-text-tertiary hover:bg-pokeball-blue hover:border-pokeball-blue h-10 w-10 rounded-md border-2 bg-white hover:text-white"
            >
              1
            </button>
            {startPage > 2 && <span>...</span>}
          </>
        )}

        {pages}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <button
              onClick={() => goToPage(totalPages)}
              className="text-text-primary border-text-tertiary hover:bg-pokeball-blue hover:border-pokeball-blue h-10 w-10 rounded-md border-2 bg-white hover:text-white"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>
    );
  };

  // Search handler
  const handleSearch = async (searchValue) => {
    setSearchTerm(searchValue);

    if (!searchValue.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      const response = await axios.get(
        `http://localhost:8080/search?query=${encodeURIComponent(searchValue)}`,
      );

      const searchData = await response.data;

      if (searchData && searchData.length > 0) {
        const searchCards = [];

        await Promise.all(
          searchData.slice(0, 20).map(async (poke) => {
            try {
              const details = (await axios.get(poke.url)).data;
              const speciesData = (await axios.get(details.species.url)).data;

              searchCards.push({
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
            } catch (err) {
              console.error(`Failed to fetch details for ${poke.name}:`, err);
            }
          }),
        );

        searchCards.sort((a, b) => a.id - b.id);
        setSearchResults(searchCards);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Search failed:", err);
      setSearchResults([]);
    }
  };

  const filteredPokemon = pokemonCard?.filter((pokemon) =>
    pokemon.en_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const displayedPokemon = isSearching
    ? searchResults
    : filteredPokemon || pokemonCard;

  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col items-center justify-center">
      <AudioPlayer />
      <Navbar />

      <div className="relative flex flex-col items-center justify-center">
        <div className="overflow-hidden">
          <img
            src="/assets/pokedex_img.gif"
            alt="hero_img"
            className="h-100 w-screen bg-cover bg-center object-cover object-center blur-[4px]"
          />
          <div className="bg-text-tertiary absolute inset-0 mix-blend-multiply"></div>
        </div>

        <div className="absolute flex h-fit flex-col items-center justify-center gap-4 p-6">
          <h2 className="text-4xl font-bold text-white [text-shadow:3px_3px_4px_rgba(0,0,0,0.6)]">
            Explore Pokémon stats, abilities, and evolutions
          </h2>
          <p className="w-[600px] font-medium text-white [text-shadow:3px_3px_4px_rgba(0,0,0,0.6)]">
            Dive into the Pokémon universe with our complete Pokédex. Learn
            about each Pokémon’s stats, abilities, and evolution paths all in
            one place.
          </p>
          <Input
            placeholder="Search Pokémon by name..."
            className="w-[600px] bg-white"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex max-w-[1150px] flex-col items-center justify-center">
        <div className="flex w-full flex-row items-center justify-between py-4">
          <h3 className="text-text-primary text-2xl font-bold">Pokémon List</h3>
          {!isSearching && (
            <div className="flex flex-row items-center gap-4">
              <CircleChevronLeft
                className={`text-text-primary hover:text-pokeball-blue cursor-pointer transition-colors`}
                onClick={handlePreviousPage}
              />
              <span className="text-text-primary font-medium">
                {pagination?.currentPage || 1} / {pagination?.totalPages || 1}
              </span>
              <CircleChevronRight
                className={`text-text-primary hover:text-pokeball-blue cursor-pointer transition-colors`}
                onClick={handleNextPage}
              />
            </div>
          )}
        </div>
        <div className="relative">
          <div className="flex flex-wrap justify-center gap-5">
            {displayedPokemon?.map((poke, index) => (
              <Link to={`/view/${poke.id}`} key={index}>
                <PokemonCard pokemon={poke} />
              </Link>
            ))}
          </div>
        </div>

        {!isSearching && renderPaginationNumbers()}
      </div>
    </div>
  );
}
