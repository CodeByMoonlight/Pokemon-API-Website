import { FaArrowLeftLong } from "react-icons/fa6";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { BsGenderFemale } from "react-icons/bs";
import { BsGenderMale } from "react-icons/bs";
import { BsGenderAmbiguous } from "react-icons/bs";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  PokemonType,
  typeColors,
  typeText,
  typeBg,
  typeIcons,
  getActiveBorderClass,
  getStatColors,
  getPrimaryType,
} from "./utils/pokemonTypes";

export default function PokemonView() {
  const { pokemonId } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function getEvolutionChainWithIds(chain) {
    const evolutions = [];

    async function traverse(node) {
      const speciesUrl = node.species.url;
      const id = parseInt(speciesUrl.split("/").filter(Boolean).pop(), 10);
      const name = node.species.name;

      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
      const data = await res.json();
      const sprite = data.sprites.other["official-artwork"].front_default;

      evolutions.push({ id, name, sprite });

      await Promise.all(node.evolves_to.map((next) => traverse(next)));
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
          details.types.map(async (t) => (await axios.get(t.type.url)).data),
        );
        const evolutionData = (await axios.get(speciesData.evolution_chain.url))
          .data;

        const evolutions = await getEvolutionChainWithIds(evolutionData.chain);

        setPokemon({
          id: details.id,
          en_name: details.name,
          jp_name:
            speciesData.names.find((name) => name.language.name === "ja-Hrkt")
              ?.name || details.name,
          sprite: details.sprites.other["official-artwork"].front_default,
          types: details.types.map((t) => t.type.name),
          details: {
            abilities: details.abilities.map((a) => a.ability.name),
            weight: details.weight / 10 + " kg",
            height: details.height / 10 + " m",
            gender: speciesData.gender_rate,
            category:
              speciesData.genera.find((genus) => genus.language.name === "en")
                ?.genus || "unknown",
          },
          baseStat: {
            hp: details.stats[0].base_stat,
            attack: details.stats[1].base_stat,
            defense: details.stats[2].base_stat,
            special_attack: details.stats[3].base_stat,
            special_defense: details.stats[4].base_stat,
            speed: details.stats[5].base_stat,
          },
          weaknesses: Array.from(
            new Set(
              damageData
                .map((type) =>
                  type.damage_relations.double_damage_from.map((t) => t.name),
                )
                .flat(),
            ),
          ).map((name) => ({ name })),
          resistances: Array.from(
            new Set(
              damageData
                .map((type) =>
                  type.damage_relations.half_damage_from.map((t) => t.name),
                )
                .flat(),
            ),
          ).map((name) => ({ name })),
          story:
            speciesData.flavor_text_entries
              .find((entry) => entry.language.name === "en")
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

  const getGenderDisplay = (genderRate) => {
    const genderData = {
      "-1": [{ icon: BsGenderAmbiguous, text: "Genderless" }],
      0: [{ icon: BsGenderMale, text: "100%" }],
      1: [
        { icon: BsGenderMale, text: "87.5%" },
        { icon: BsGenderFemale, text: "12.5%" },
      ],
      2: [
        { icon: BsGenderMale, text: "75%" },
        { icon: BsGenderFemale, text: "25%" },
      ],
      4: [
        { icon: BsGenderMale, text: "50%" },
        { icon: BsGenderFemale, text: "50%" },
      ],
      6: [
        { icon: BsGenderMale, text: "25%" },
        { icon: BsGenderFemale, text: "75%" },
      ],
      8: [{ icon: BsGenderFemale, text: "100%" }],
    };

    const data = genderData[genderRate] || [
      { icon: AiOutlineQuestionCircle, text: "Unknown" },
    ];

    return (
      <>
        {data.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div key={index} className="gender-container">
              <IconComponent />
              <p>{item.text}</p>
            </div>
          );
        })}
      </>
    );
  };

  // Function to create stat bar
  const createStatBar = (statName, value, pokemonType, maxValue = 255) => {
    const percentage = (value / maxValue) * 100;
    const { foregroundColor, backgroundColor } = getStatColors(pokemonType);

    return (
      <div className="flex items-center gap-4">
        <div className="w-28 text-left text-sm font-medium capitalize">
          {statName.replace("_", " ")}
        </div>
        <div className="w-12 text-right text-sm font-semibold">{value}</div>
        <div
          className={`flex-1 ${backgroundColor} relative h-6 overflow-hidden rounded-full`}
        >
          <div
            className={`h-full rounded-full transition-all duration-500 ${foregroundColor}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
      </div>
    );
  };

  if (loading) return <div></div>;
  if (error) return <div>{error}</div>;
  if (!pokemon) return <div>Pokemon not found</div>;

  const primaryType = getPrimaryType(pokemon.types);

  return (
    <div
      className={`flex flex-row gap-36 bg-gradient-to-r ${typeColors[primaryType]} relative h-screen w-screen items-center justify-center`}
    >
      <div className="pointer-events-none absolute right-0 top-0 z-0 h-full w-1/2 overflow-hidden">
        <img
          src={`/assets/White Pokeball.svg`}
          alt={pokemon.en_name}
          className="w-70 rotate-145 absolute right-20 top-10 opacity-30"
        />
        <img
          src={`/assets/White Pokeball.svg`}
          alt={pokemon.en_name}
          className="w-100 right-50 absolute bottom-5 rotate-45 opacity-30"
        />
      </div>

      {/*Pokemon Navigation*/}
      <Link to={`/view/${pokemon.id - 1}`}>
        <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[5px_5px_5px_0px_rgba(0,0,0,0.10)] transition-transform duration-300 hover:scale-110">
          <IoIosArrowBack className="h-8 w-8" />
        </div>
      </Link>

      {/*Pokemon Info*/}
      <div className="relative z-10">
        {/*Pokemon Header*/}
        <div className="flex flex-col gap-1">
          <div className="flex flex-row items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-1 transition-transform duration-300 hover:scale-110 hover:rounded-full hover:bg-[rgba(255,255,255,0.5)] hover:shadow-[5px_5px_5px_0px_rgba(0,0,0,0.10)]"
            >
              <FaArrowLeftLong />
            </button>
            <h3 className="text-left text-xl font-semibold">
              #{pokemon.id.toString().padStart(5, "0")}
            </h3>
          </div>
          <div className="flex flex-row items-center gap-5">
            <h1 className="text-left text-4xl font-semibold capitalize">
              {pokemon.en_name}
            </h1>
            <img
              src={`/assets/${typeIcons[primaryType]}`}
              alt={pokemon.en_name}
              className="w-10"
            />
          </div>
        </div>

        {/*Main Details*/}
        <div className="mt-4 flex flex-row items-center justify-center gap-5">
          {/*Pokemon Image*/}
          <div className="relative flex h-fit w-[450px] flex-row">
            <img
              src={`/assets/${typeIcons[primaryType]}`}
              alt={pokemon.en_name}
              className="w-80 opacity-50"
            />
            <h1
              className={`absolute left-0 top-10 text-5xl font-semibold ${typeText[primaryType]}`}
            >
              {pokemon.jp_name}
            </h1>
            {pokemon.sprite ? (
              <img
                className="absolute -bottom-5 right-0 m-auto w-72"
                src={pokemon.sprite}
                alt={pokemon.en_name}
              />
            ) : (
              <></>
            )}
          </div>

          {/*Pokemon Details*/}
          <div className="flex h-[650px] w-[36rem] flex-col px-5">
            <Tabs defaultValue="about" className="">
              <TabsList className="">
                <TabsTrigger
                  value="about"
                  className={getActiveBorderClass(primaryType)}
                >
                  About
                </TabsTrigger>
                <TabsTrigger
                  value="stats"
                  className={getActiveBorderClass(primaryType)}
                >
                  Stats
                </TabsTrigger>
              </TabsList>
              <TabsContent value="about" className="">
                <div className="flex flex-col gap-5">
                  {/*Story*/}
                  <div className="flex flex-col gap-2">
                    <h2 className="text-left text-lg font-bold">Story</h2>
                    <p className="text-left">{pokemon.story}</p>
                  </div>

                  {/*Details*/}
                  <div className="flex flex-col gap-2">
                    <h2 className="text-left text-lg font-bold">Details</h2>
                    <div className="flex flex-wrap gap-5">
                      {Object.entries(pokemon.details || {}).map(
                        ([key, value], index) => {
                          if (Array.isArray(value)) {
                            return (
                              <div key={index} className="flex flex-row gap-5">
                                {(value || []).map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex w-40 flex-col gap-2 rounded-lg bg-white p-2 py-3 shadow-[5px_5px_5px_0px_rgba(0,0,0,0.10)] transition-transform duration-300 hover:scale-105"
                                  >
                                    <p className="text-base font-semibold capitalize">
                                      {key}
                                    </p>
                                    <p className="text-sm capitalize" key={idx}>
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
                                className="flex w-40 flex-col gap-2 rounded-lg bg-white p-2 py-3 shadow-[5px_5px_5px_0px_rgba(0,0,0,0.10)] transition-transform duration-300 hover:scale-110"
                              >
                                <p className="text-base font-semibold capitalize">
                                  {key}
                                </p>
                                <div className="flex flex-row justify-center gap-4 text-sm">
                                  {key === "gender"
                                    ? getGenderDisplay(value)
                                    : value}
                                </div>
                              </div>
                            );
                          }
                        },
                      )}
                    </div>
                  </div>

                  {/*Evolution*/}
                  <div className="flex flex-col gap-2">
                    <h2 className="text-left text-lg font-bold">Evolution</h2>
                    <div className="flex flex-wrap gap-5">
                      {(pokemon.evolutionChain || []).map((evo, index) => (
                        <Link to={`/view/${evo.id}`} key={index}>
                          <div
                            key={index}
                            className="rounded-full bg-white p-2 shadow-[5px_5px_5px_0px_rgba(0,0,0,0.10)] transition-transform duration-300 hover:scale-110"
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
                    <h2 className="text-left text-lg font-bold">Base Stats</h2>
                    <div className="flex flex-col gap-2 rounded-md bg-white p-4 pl-4 shadow-[5px_5px_5px_0px_rgba(0,0,0,0.08)]">
                      {Object.entries(pokemon.baseStat || {}).map(
                        ([key, value], index) => (
                          <div key={index}>
                            {createStatBar(key, value, primaryType)}
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  {/*Weakness*/}
                  <div className="flex flex-col gap-2">
                    <h2 className="text-left text-lg font-bold">Weakness</h2>
                    <div className="flex flex-wrap gap-3">
                      {(pokemon.weaknesses || []).map((weakness, index) => (
                        <div
                          key={index}
                          className="flex w-12 flex-col items-center gap-1"
                        >
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="rounded-full bg-white p-[6px] shadow-[5px_5px_5px_0px_rgba(0,0,0,0.10)] transition-transform duration-300 hover:scale-110">
                                <img
                                  src={`/assets/${typeIcons[weakness.name]}`}
                                  alt={pokemon.en_name}
                                  className={`w-10 ${typeBg[weakness.name]} rounded-full`}
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="capitalize">
                              <p>{weakness.name}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/*Resistance*/}
                  <div className="flex flex-col gap-2">
                    <h2 className="text-left text-lg font-bold">Resistance</h2>
                    <div className="flex flex-wrap gap-3">
                      {(pokemon.resistances || []).map((resistance, index) => (
                        <div
                          key={index}
                          className="flex w-12 flex-col items-center gap-1"
                        >
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="rounded-full bg-white p-[6px] shadow-[5px_5px_5px_0px_rgba(0,0,0,0.10)] transition-transform duration-300 hover:scale-110">
                                <img
                                  src={`/assets/${typeIcons[resistance.name]}`}
                                  alt={pokemon.en_name}
                                  className={`w-10 ${typeBg[resistance.name]} rounded-full`}
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="capitalize">
                              <p>{resistance.name}</p>
                            </TooltipContent>
                          </Tooltip>
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

      {/*Pokemon Navigation*/}
      <Link to={`/view/${pokemon.id + 1}`}>
        <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[5px_5px_5px_0px_rgba(0,0,0,0.10)] transition-transform duration-300 hover:scale-110">
          <IoIosArrowForward className="h-8 w-8" />
        </div>
      </Link>
    </div>
  );
}
