// Pokemon type constants and utilities

// Define Pokemon types
export const PokemonType = {
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

// Type color mappings for gradients, text, backgrounds, and icons
export const typeColors = {
  normal: "from-normal-base via-normal-light to-normal-lightest",
  fire: "from-fire-base via-fire-light to-fire-lightest",
  water: "from-water-base via-water-light to-water-lightest",
  electric: "from-electric-base via-electric-light to-electric-lightest",
  grass: "from-grass-base via-grass-light to-grass-lightest",
  ice: "from-ice-base via-ice-light to-ice-lightest",
  fighting: "from-fighting-base via-fighting-light to-fighting-lightest",
  poison: "from-poison-base via-poison-light to-poison-lightest",
  ground: "from-ground-base via-ground-light to-ground-lightest",
  flying: "from-flying-base via-flying-light to-flying-lightest",
  psychic: "from-psychic-base via-psychic-light to-psychic-lightest",
  bug: "from-bug-base via-bug-light to-bug-lightest",
  rock: "from-rock-base via-rock-light to-rock-lightest",
  ghost: "from-ghost-base via-ghost-light to-ghost-lightest",
  dragon: "from-dragon-base via-dragon-light to-dragon-lightest",
  dark: "from-dark-base via-dark-light to-dark-lightest",
  steel: "from-steel-base via-steel-light to-steel-lightest",
  fairy: "from-fairy-base via-fairy-light to-fairy-lightest",
};

// Text, background, and icon color mappings
export const typeText = {
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

// Background color mappings
export const typeBg = {
  normal: "bg-normal-lightest",
  fire: "bg-fire-lightest",
  water: "bg-water-lightest",
  electric: "bg-electric-lightest",
  grass: "bg-grass-lightest",
  ice: "bg-ice-lightest",
  fighting: "bg-fighting-lightest",
  poison: "bg-poison-lightest",
  ground: "bg-ground-lightest",
  flying: "bg-flying-lightest",
  psychic: "bg-psychic-lightest",
  bug: "bg-bug-lightest",
  rock: "bg-rock-lightest",
  ghost: "bg-ghost-lightest",
  dragon: "bg-dragon-lightest",
  dark: "bg-dark-lightest",
  steel: "bg-steel-lightest",
  fairy: "bg-fairy-lightest",
};

// Icon mappings
export const typeIcons = {
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

// Utility functions
export const getActiveBorderClass = (pokemonType) => {
  switch (pokemonType) {
    case PokemonType.Normal:
      return "data-[state=active]:border-normal-deep data-[state=active]:border-b-4";
    case PokemonType.Fire:
      return "data-[state=active]:border-fire-deep data-[state=active]:border-b-4";
    case PokemonType.Water:
      return "data-[state=active]:border-water-deep data-[state=active]:border-b-4";
    case PokemonType.Electric:
      return "data-[state=active]:border-electric-deep data-[state=active]:border-b-4";
    case PokemonType.Grass:
      return "data-[state=active]:border-grass-deep data-[state=active]:border-b-4";
    case PokemonType.Ice:
      return "data-[state=active]:border-ice-deep data-[state=active]:border-b-4";
    case PokemonType.Fighting:
      return "data-[state=active]:border-fighting-deep data-[state=active]:border-b-4";
    case PokemonType.Poison:
      return "data-[state=active]:border-poison-deep data-[state=active]:border-b-4";
    case PokemonType.Ground:
      return "data-[state=active]:border-ground-deep data-[state=active]:border-b-4";
    case PokemonType.Flying:
      return "data-[state=active]:border-flying-deep data-[state=active]:border-b-4";
    case PokemonType.Psychic:
      return "data-[state=active]:border-psychic-deep data-[state=active]:border-b-4";
    case PokemonType.Bug:
      return "data-[state=active]:border-bug-deep data-[state=active]:border-b-4";
    case PokemonType.Rock:
      return "data-[state=active]:border-rock-deep data-[state=active]:border-b-4";
    case PokemonType.Ghost:
      return "data-[state=active]:border-ghost-deep data-[state=active]:border-b-4";
    case PokemonType.Dragon:
      return "data-[state=active]:border-dragon-deep data-[state=active]:border-b-4";
    case PokemonType.Dark:
      return "data-[state=active]:border-dark-deep data-[state=active]:border-b-4";
    case PokemonType.Steel:
      return "data-[state=active]:border-steel-deep data-[state=active]:border-b-4";
    case PokemonType.Fairy:
      return "data-[state=active]:border-fairy-deep data-[state=active]:border-b-4";
    default:
      return "data-[state=active]:border-gray-600 data-[state=active]:border-b-4";
  }
};

// Stat color mappings for stat bars
export const getStatColors = (pokemonType) => {
  switch (pokemonType) {
    case PokemonType.Normal:
      return {
        foregroundColor: "bg-normal-deep",
        backgroundColor: "bg-normal-light",
      };
    case PokemonType.Fire:
      return {
        foregroundColor: "bg-fire-deep",
        backgroundColor: "bg-fire-light",
      };
    case PokemonType.Water:
      return {
        foregroundColor: "bg-water-deep",
        backgroundColor: "bg-water-light",
      };
    case PokemonType.Electric:
      return {
        foregroundColor: "bg-electric-deep",
        backgroundColor: "bg-electric-light",
      };
    case PokemonType.Grass:
      return {
        foregroundColor: "bg-grass-deep",
        backgroundColor: "bg-grass-light",
      };
    case PokemonType.Ice:
      return { foregroundColor: "bg-ice-deep", backgroundColor: "bg-ice-light" };
    case PokemonType.Fighting:
      return {
        foregroundColor: "bg-fighting-deep",
        backgroundColor: "bg-fighting-light",
      };
    case PokemonType.Poison:
      return {
        foregroundColor: "bg-poison-deep",
        backgroundColor: "bg-poison-light",
      };
    case PokemonType.Ground:
      return {
        foregroundColor: "bg-ground-deep",
        backgroundColor: "bg-ground-light",
      };
    case PokemonType.Flying:
      return {
        foregroundColor: "bg-flying-deep",
        backgroundColor: "bg-flying-light",
      };
    case PokemonType.Psychic:
      return {
        foregroundColor: "bg-psychic-deep",
        backgroundColor: "bg-psychic-light",
      };
    case PokemonType.Bug:
      return { foregroundColor: "bg-bug-deep", backgroundColor: "bg-bug-light" };
    case PokemonType.Rock:
      return {
        foregroundColor: "bg-rock-deep",
        backgroundColor: "bg-rock-light",
      };
    case PokemonType.Ghost:
      return {
        foregroundColor: "bg-ghost-deep",
        backgroundColor: "bg-ghost-light",
      };
    case PokemonType.Dragon:
      return {
        foregroundColor: "bg-dragon-deep",
        backgroundColor: "bg-dragon-light",
      };
    case PokemonType.Dark:
      return {
        foregroundColor: "bg-dark-deep",
        backgroundColor: "bg-dark-light",
      };
    case PokemonType.Steel:
      return {
        foregroundColor: "bg-steel-deep",
        backgroundColor: "bg-steel-light",
      };
    case PokemonType.Fairy:
      return {
        foregroundColor: "bg-fairy-deep",
        backgroundColor: "bg-fairy-light",
      };
    default:
      return { foregroundColor: "bg-gray-600", backgroundColor: "bg-gray-300" };
  }
};

// Helper function to get primary type safely
export const getPrimaryType = (types) => {
  return (types && types[0]) || PokemonType.Normal;
};

// Card-specific type colors (different from the gradient colors used in PokemonView)
export const cardTypeColors = {
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

// Card-specific type icons (uses (2).svg versions)
export const cardTypeIcons = {
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

// Generation mapping utility
export const generationMap = {
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