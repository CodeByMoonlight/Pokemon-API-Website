const PokemonType = {
  Normal: "normal",
  Fire: "fire",
  Water: "water",
  Electric: "electric",
  Grass: "grass",
  Ice: "ice",
  Fighting: "fighting",
  Poison: "poison",
  Ground: "ground",
  Flying: "flying",
  Psychic: "psychic",
  Bug: "bug",
  Rock: "rock",
  Ghost: "ghost",
  Dragon: "dragon",
  Dark: "dark",
  Steel: "steel",
  Fairy: "fairy",
};

const generationMap = {
  "GENERATION-I": "Kanto",
  "GENERATION-II": "Johto",
  "GENERATION-III": "Hoenn",
  "GENERATION-IV": "Sinnoh",
  "GENERATION-V": "Unova",
  "GENERATION-VI": "Kalos",
  "GENERATION-VII": "Alola",
  "GENERATION-VIII": "Galar",
  "GENERATION-IX": "Paldea",
  GENERATIONI: "Kanto",
  GENERATIONII: "Johto",
  GENERATIONIII: "Hoenn",
  GENERATIONIV: "Sinnoh",
  GENERATIONV: "Unova",
  GENERATIONVI: "Kalos",
  GENERATIONVII: "Alola",
  GENERATIONVIII: "Galar",
  GENERATIONIX: "Paldea",
  I: "Kanto",
  II: "Johto",
  III: "Hoenn",
  IV: "Sinnoh",
  V: "Unova",
  VI: "Kalos",
  VII: "Alola",
  VIII: "Galar",
  IX: "Paldea",
};

const typeColors = {
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

const typeText = {
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

const typeIcons = {
  normal: "Normal (2).svg",
  fire: "Fire (2).svg",
  water: "Water (2).svg",
  electric: "Electric (2).svg",
  grass: "Grass (2).svg",
  ice: "Ice (2).svg",
  fighting: "Fighting (2).svg",
  poison: "Poison (2).svg",
  ground: "Ground (2).svg",
  flying: "Flying (2).svg",
  psychic: "Psychic (2).svg",
  bug: "Bug (2).svg",
  rock: "Rock (2).svg",
  ghost: "Ghost (2).svg",
  dragon: "Dragon (2).svg",
  dark: "Dark (2).svg",
  steel: "Steel (2).svg",
  fairy: "Fairy (2).svg",
};

export default function PokemonCard({ pokemon, className = "" }) {
  const baseCardClasses =
    "text-text-primary w-68 flex h-[330px] flex-col gap-3 rounded-lg border-2 border-gray-200 bg-white p-3 transition-transform duration-300 hover:shadow-[9px_9px_9px_0px_rgba(0,0,0,0.10)]";
  const hoverScaleClass = className === "" ? "hover:scale-105" : "";

  return (
    <div
      key={pokemon.id}
      className={`${baseCardClasses} ${hoverScaleClass} ${className}`}
    >
      <div
        className={`${typeColors[pokemon.types[0]] || "bg-gray-300"} flex h-56 flex-col justify-between rounded-lg p-3`}
      >
        <div className="flex flex-row justify-between text-lg font-semibold">
          <p className="uppercase">
            {generationMap[
              pokemon.generation.replace("generation-", "").toUpperCase()
            ] || pokemon.generation}
          </p>
          <p className="capitalize">00{pokemon.id}</p>
        </div>
        <div
          className={`flex items-center justify-center font-semibold ${typeText[pokemon.types[0]]} gap-4`}
        >
          <p className="w-8 text-xl">{pokemon.jp_name}</p>
          <img className="w-40" src={pokemon.sprite} alt={pokemon.en_name} />
        </div>
      </div>

      <div className="flex flex-row">
        <div className="flex w-2/3 flex-col">
          <h3 className="text-left text-lg font-medium capitalize">
            {pokemon.en_name}
          </h3>
          <p className="text-left text-xs capitalize">
            Habitat: {pokemon.habitat}
          </p>
        </div>
        <div className="flex w-1/3 flex-row items-baseline justify-end gap-2">
          <img
            src={`/assets/${typeIcons[pokemon.types[0]]}`}
            alt={pokemon.en_name}
            className="w-9"
          />
          {pokemon.types[1] && (
            <img
              src={`/assets/${typeIcons[pokemon.types[1]]}`}
              alt={pokemon.en_name}
              className="w-9"
            />
          )}
        </div>
      </div>
    </div>
  );
}
