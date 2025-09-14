import { FaArrowLeftLong } from "react-icons/fa6";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { CircleChevronRight } from "lucide-react";
import { CircleChevronLeft } from "lucide-react";

enum PokemonType {
  Normal = "normal",
  Fire = "fire",
  Water = "water",
  Electric = "electric",
  Grass = "grass",
  Ice = "ice",
  Fighting = "fighting",
  Poison = "poison",
  Ground = "ground",
  Flying = "flying",
  Psychic = "psychic",
  Bug = "bug",
  Rock = "rock",
  Ghost = "ghost",
  Dragon = "dragon",
  Dark = "dark",
  Steel = "steel",
  Fairy = "fairy",
}

const typeColors: Record<PokemonType, string> = {
  normal: "bg-normal-light",
  fire: "bg-fire-light",
  water: "bg-water-light",
  electric: "bg-electric-light",
  grass: "bg-grass-light",
  ice: "bg-ice-light",
  fighting: "bg-fighting-light",
  poison: "bg-poison-light",
  ground: "bg-ground-light",
  flying: "bg-flying-light",
  psychic: "bg-psychic-light",
  bug: "bg-bug-light",
  rock: "bg-rock-light",
  ghost: "bg-ghost-light",
  dragon: "bg-dragon-light",
  dark: "bg-dark-light",
  steel: "bg-steel-light",
  fairy: "bg-fairy-light",
};

const typeText: Record<PokemonType, string> = {
  normal: "text-normal-dark",
  fire: "text-fire-dark",
  water: "text-water-dark",
  electric: "text-electric-dark",
  grass: "text-grass-dark",
  ice: "text-ice-dark",
  fighting: "text-fighting-dark",
  poison: "text-poison-dark",
  ground: "text-ground-dark",
  flying: "text-flying-dark",
  psychic: "text-psychic-dark",
  bug: "text-bug-dark",
  rock: "text-rock-dark",
  ghost: "text-ghost-dark",
  dragon: "text-dragon-dark",
  dark: "text-dark-dark",
  steel: "text-steel-dark",
  fairy: "text-fairy-dark",
};

const typeIcons: Record<PokemonType, string> = {
  normal: "Normal (1).svg",
  fire: "Fire (1).svg",
  water: "Water (1).svg",
  electric: "Electric (1).svg",
  grass: "Grass (1).svg",
  ice: "Ice (1).svg",
  fighting: "Fighting (1).svg",
  poison: "Poison (1).svg",
  ground: "Ground (1).svg",
  flying: "Flying (1).svg",
  psychic: "Psychic (1).svg",
  bug: "Bug (1).svg",
  rock: "Rock (1).svg",
  ghost: "Ghost (1).svg",
  dragon: "Dragon (1).svg",
  dark: "Dark (1).svg",
  steel: "Steel (1).svg",
  fairy: "Fairy (1).svg",
};

interface PokemonView {
  id: number;
  en_name: string;
  jp_name: string;
  sprite: string;
  types: PokemonType[];
  baseStat: {
    hp: number;
    attack: number;
    defense: number;
    special_attack: number;
    special_defense: number;
    speed: number;
  };
  details: {
    weight: number;
    height: number;
    gender: number;
    abilities: string[];
    category: string;
  };
  weaknesses: { name: PokemonType }[];
  resistances: { name: PokemonType }[];
  story: string;
  evolutionChain: {
    id: number;
    name: string;
    sprite: string;
  }[];
}

export default function PokemonView() {
  const { pokemonId } = useParams();
  const [pokemon, setPokemon] = useState<PokemonView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function getEvolutionChainWithIds(chain: any) {
    const evolutions: { id: number; name: string; sprite: string }[] = [];

    async function traverse(node: any) {
      const speciesUrl = node.species.url;
      const id = parseInt(speciesUrl.split("/").filter(Boolean).pop(), 10);
      const name = node.species.name;

      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
      const data = await res.json();
      const sprite = data.sprites.other["official-artwork"].front_default;

      evolutions.push({ id, name, sprite });

      await Promise.all(node.evolves_to.map((next: any) => traverse(next)));
    }

    await traverse(chain);
    return evolutions;
  }

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/${pokemonId}`);
        const details = response.data;
        const speciesData = (await axios.get(details.species.url)).data;
        const damageData = await Promise.all(
          details.types.map(
            async (t: any) => (await axios.get(t.type.url)).data
          )
        );
        const evolutionData = (await axios.get(speciesData.evolution_chain.url))
          .data;

        const evolutions = await getEvolutionChainWithIds(evolutionData.chain);

        setPokemon({
          id: details.id,
          en_name: details.name,
          jp_name:
            speciesData.names.find(
              (name: any) => name.language.name === "ja-Hrkt"
            )?.name || details.name,
          sprite: details.sprites.other["official-artwork"].front_default,
          types: details.types.map((t: any) => t.type.name as PokemonType),
          details: {
            abilities: details.abilities.map((a: any) => a.ability.name),
            weight: details.weight / 10, // Convert to kg
            height: details.height / 10, // Convert to m
            gender: speciesData.gender_rate,
            category:
              speciesData.genera.find(
                (genus: any) => genus.language.name === "en"
              )?.genus || "unknown",
          },
          baseStat: {
            hp: details.stats[0].base_stat,
            attack: details.stats[1].base_stat,
            defense: details.stats[2].base_stat,
            special_attack: details.stats[3].base_stat,
            special_defense: details.stats[4].base_stat,
            speed: details.stats[5].base_stat,
          },
          weaknesses: damageData
            .map((type: any) =>
              type.damage_relations.double_damage_from.map((t: any) => ({
                name: t.name as PokemonType,
              }))
            )
            .flat(),
          resistances: damageData
            .map((type: any) =>
              type.damage_relations.half_damage_from.map((t: any) => ({
                name: t.name as PokemonType,
              }))
            )
            .flat(),
          story:
            speciesData.flavor_text_entries
              .find((entry: any) => entry.language.name === "en")
              ?.flavor_text.replace(/\f/g, " ") || "No description available",
          evolutionChain: evolutions,
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch Pokemon details");
        setLoading(false);
        console.error(err);
      }
    };

    if (pokemonId) {
      fetchPokemonData();
    }
  }, [pokemonId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!pokemon) return <div>Pokemon not found</div>;

  return (
    <div className="flex flex-row gap-36 bg-gradient-to-r from-grass-base via-grass-light to-grass-lightest w-screen h-screen justify-center items-center">
      <Link to={`/view/${pokemon.id - 1}`}>
        <CircleChevronLeft className="w-16 h-16" />
      </Link>
      <div className="">
        <div className="">
          {/*Pokemon Info*/}
          <div className="flex flex-row items-center gap-5">
            <Link to={`/`}>
              <button className="back-btn">
                <FaArrowLeftLong />
              </button>
            </Link>

            <h3 className="text-left text-xl font-semibold">#00{pokemon.id}</h3>
          </div>
          <div className="flex flex-row gap-5 items-center">
            <h1 className="text-left capitalize font-semibold text-4xl">
              {pokemon.en_name}
            </h1>
            <img
              src={`/assets/${typeIcons[pokemon.types[0]]}`}
              alt={pokemon.en_name}
              className="w-10"
            />
          </div>
        </div>

        {/*Main Details*/}
        <div className="flex flex-row gap-5 justify-center items-center">
          {/*Pokemon Image*/}
          <div className="relative w-[450px] h-fit flex flex-row">
            <img
              src={`/assets/${typeIcons[pokemon.types[0]]}`}
              alt={pokemon.en_name}
              className="w-80 opacity-50"
            />
            <h1 className="font-semibold absolute top-10 left-0 text-5xl">
              {pokemon.jp_name}
            </h1>
            <img
              src={pokemon.sprite}
              alt={pokemon.en_name}
              className="absolute right-0 -bottom-5 m-auto w-72"
            />
          </div>

          {/*Pokemon Details*/}
          <div className="flex flex-col px-5 w-[36rem] h-[650px]">
            <Tabs defaultValue="about" className="">
              <TabsList className="">
                <TabsTrigger value="about" className="">
                  About
                </TabsTrigger>
                <TabsTrigger value="stats" className="">
                  Stats
                </TabsTrigger>
              </TabsList>
              <TabsContent value="about" className="">
                <div className="flex flex-col gap-5">
                  {/*Story*/}
                  <div className="flex flex-col gap-2">
                    <h2 className="text-left font-bold text-lg">Story</h2>
                    <p className="text-left w-96">{pokemon.story}</p>
                  </div>

                  {/*Details*/}
                  <div className="flex flex-col gap-2">
                    <h2 className="text-left font-bold text-lg">Details</h2>
                    <div className="flex flex-wrap gap-5">
                      {Object.entries(pokemon.details).map(
                        ([key, value], index) => {
                          if (Array.isArray(value)) {
                            return (
                              <div key={index} className="flex flex-row gap-5">
                                {value.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex flex-col bg-white p-2 py-3 gap-2 rounded-lg w-40 hover:scale-105 transition-transform duration-300 shadow-[5px_5px_5px_0px_rgba(0,0,0,0.10)]"
                                  >
                                    <p className="capitalize font-semibold text-base">
                                      {key}
                                    </p>
                                    <p className="capitalize text-sm" key={idx}>
                                      {item}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            );
                          } else {
                            return (
                              <div
                                key={index}
                                className="flex flex-col bg-white p-2 py-3 gap-2 rounded-lg w-40 hover:scale-110 transition-transform duration-300 shadow-[5px_5px_5px_0px_rgba(0,0,0,0.10)]"
                              >
                                <p className="capitalize font-semibold text-base">
                                  {key}
                                </p>
                                <p className="capitalize text-sm">{value}</p>
                              </div>
                            );
                          }
                        }
                      )}
                    </div>
                  </div>

                  {/*Evolution*/}
                  <div className="flex flex-col gap-2">
                    <h2 className="text-left font-bold text-lg">Evolution</h2>
                    <div className="flex flex-wrap gap-5">
                      {pokemon.evolutionChain.map((evo, index) => (
                        <Link to={`/view/${evo.id}`} key={index}>
                          <div
                            key={index}
                            className=" p-2 rounded-full bg-white hover:scale-110 transition-transform duration-300 shadow-[5px_5px_5px_0px_rgba(0,0,0,0.10)]"
                          >
                            <img
                              src={evo.sprite}
                              alt={evo.name}
                              className="w-16"
                            />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="stats" className="">
                <div className="flex flex-col gap-5">
                  {/*Base Stats*/}
                  <div className="flex flex-col gap-2">
                    <h2 className="text-left font-bold text-lg">Base Stats</h2>
                    <div>
                      {Object.entries(pokemon.baseStat).map(
                        ([key, value], index) => (
                          <div key={index} className="flex justify-between">
                            <p className="capitalize">{key}</p>
                            <p>{value}</p>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/*Weakness*/}
                  <div className="flex flex-col gap-2">
                    <h2 className="text-left font-bold text-lg">Weakness</h2>
                    <div className="flex flex-wrap gap-3">
                      {pokemon.weaknesses.map((weakness, index) => (
                        <div
                          key={index}
                          className="w-12 flex flex-col gap-1 items-center"
                        >
                          <img
                            src={`/assets/${typeIcons[weakness.name]}`}
                            alt={pokemon.en_name}
                            className="w-10"
                          />
                          <p className="capitalize text-xs font-medium">
                            {weakness.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/*Resistance*/}
                  <div className="flex flex-col gap-2">
                    <h2 className="text-left font-bold text-lg">Resistance</h2>
                    <div className="flex flex-wrap gap-3">
                      {pokemon.resistances.map((resistance, index) => (
                        <div
                          key={index}
                          className="w-12 flex flex-col gap-1 items-center"
                        >
                          <img
                            src={`/assets/${typeIcons[resistance.name]}`}
                            alt={pokemon.en_name}
                            className="w-10"
                          />
                          <p className="capitalize text-xs font-medium">
                            {resistance.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Link to={`/view/${pokemon.id + 1}`}>
        <CircleChevronRight className="w-16 h-16" />
      </Link>
    </div>
  );
}
