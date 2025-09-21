import {
  PokemonType,
  typeText,
  cardTypeColors,
  cardTypeIcons,
  generationMap,
  getPrimaryType,
} from "../utils/pokemonTypes";

export default function PokemonCard({ pokemon, className = "" }) {
  const baseCardClasses =
    "text-text-primary w-68 flex h-[330px] flex-col gap-3 rounded-lg border-2 border-gray-200 bg-white p-3 transition-transform duration-300 hover:shadow-[9px_9px_9px_0px_rgba(0,0,0,0.10)]";
  const hoverScaleClass = className === "" ? "hover:scale-105" : "";
  const primaryType = getPrimaryType(pokemon.types);

  return (
    <div
      key={pokemon.id}
      className={`${baseCardClasses} ${hoverScaleClass} ${className}`}
    >
      <div
        className={`${cardTypeColors[primaryType] || "bg-gray-300"} flex h-56 flex-col justify-between rounded-lg p-3`}
      >
        <div className="flex flex-row justify-between text-lg font-semibold">
          <p className="uppercase">
            {generationMap[
              pokemon.generation.replace("generation-", "").toUpperCase()
            ] || pokemon.generation}
          </p>
          <p className="capitalize">{pokemon.id.toString().padStart(5, "0")}</p>
        </div>
        <div
          className={`flex items-center justify-center font-semibold ${typeText[primaryType]} gap-4`}
        >
          <p className="w-8 text-xl">{pokemon.jp_name}</p>
          <div className="w-40">
            {pokemon.sprite ? (
              <img
                className="w-40"
                src={pokemon.sprite}
                alt={pokemon.en_name}
              />
            ) : (
              <img
                src="/assets/Pokemon.svg"
                alt="pokeball"
                className="bg-text-primary border-text-primary h-36 w-36 rounded-full border-2 opacity-85"
              />
            )}
          </div>
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
            src={`/assets/${cardTypeIcons[primaryType]}`}
            alt={pokemon.en_name}
            className="w-9"
          />
          {pokemon.types[1] && (
            <img
              src={`/assets/${cardTypeIcons[pokemon.types[1]]}`}
              alt={pokemon.en_name}
              className="w-9"
            />
          )}
        </div>
      </div>
    </div>
  );
}
