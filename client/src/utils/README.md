# Pokemon Types Utilities

This module provides shared Pokemon type constants, styling utilities, and helper functions that can be used across your Pokemon-themed React application.

## Installation

Import the utilities you need from the `pokemonTypes.js` file:

```javascript
import {
  PokemonType,
  typeColors,
  typeText,
  typeBg,
  typeIcons,
  cardTypeColors,
  cardTypeIcons,
  getActiveBorderClass,
  getStatColors,
  getPrimaryType,
  generationMap,
} from "./utils/pokemonTypes";
```

## Available Exports

### Constants

- **`PokemonType`** - Object containing all Pokemon type constants
- **`typeColors`** - Gradient background classes for detailed views
- **`typeText`** - Text color classes for each type
- **`typeBg`** - Background color classes for each type
- **`typeIcons`** - Icon filenames for detailed views (uses `(1).svg` variants)
- **`cardTypeColors`** - Solid background classes for card components
- **`cardTypeIcons`** - Icon filenames for card components (uses `(2).svg` variants)
- **`generationMap`** - Maps generation IDs to region names

### Utility Functions

- **`getPrimaryType(types)`** - Safely gets the primary type from a types array
- **`getActiveBorderClass(pokemonType)`** - Returns active border classes for tabs
- **`getStatColors(pokemonType)`** - Returns foreground/background colors for stat bars

## Usage Examples

### Basic Component with Type Styling

```javascript
import React from "react";
import { typeColors, typeIcons, getPrimaryType } from "../utils/pokemonTypes";

const PokemonBanner = ({ pokemon }) => {
  const primaryType = getPrimaryType(pokemon.types);

  return (
    <div className={`bg-gradient-to-r p-4 ${typeColors[primaryType]}`}>
      <img src={`/assets/${typeIcons[primaryType]}`} alt={primaryType} />
      <h1>{pokemon.name}</h1>
    </div>
  );
};
```

### Type Badge Component

```javascript
import React from "react";
import { typeBg, typeText } from "../utils/pokemonTypes";

const TypeBadge = ({ type }) => (
  <span className={`rounded-full px-3 py-1 ${typeBg[type]} ${typeText[type]}`}>
    {type}
  </span>
);
```

### Card Component

```javascript
import React from "react";
import {
  cardTypeColors,
  cardTypeIcons,
  getPrimaryType,
} from "../utils/pokemonTypes";

const PokemonCard = ({ pokemon }) => {
  const primaryType = getPrimaryType(pokemon.types);

  return (
    <div className={`rounded-lg p-4 ${cardTypeColors[primaryType]}`}>
      <img src={`/assets/${cardTypeIcons[primaryType]}`} alt={primaryType} />
      <h3>{pokemon.name}</h3>
    </div>
  );
};
```

### Stat Bar Component

```javascript
import React from "react";
import { getStatColors } from "../utils/pokemonTypes";

const StatBar = ({ statName, value, pokemonType, maxValue = 255 }) => {
  const { foregroundColor, backgroundColor } = getStatColors(pokemonType);
  const percentage = (value / maxValue) * 100;

  return (
    <div className="flex items-center gap-2">
      <span className="w-20 text-sm">{statName}</span>
      <div className={`h-4 flex-1 rounded ${backgroundColor}`}>
        <div
          className={`h-full rounded ${foregroundColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-8 text-sm">{value}</span>
    </div>
  );
};
```

## File Structure

```
src/
├── utils/
│   └── pokemonTypes.js          # Shared utilities
├── components/
│   ├── PokemonCard.jsx          # Uses cardTypeColors, cardTypeIcons
│   └── ...
└── PokemonView.jsx              # Uses typeColors, typeIcons
```

## Benefits

- **Consistency**: All components use the same type definitions and styling
- **Maintainability**: Changes to type styling only need to be made in one place
- **Reusability**: Easy to create new Pokemon-themed components
- **Type Safety**: Centralized type constants prevent typos
- **Performance**: No duplicate definitions across components

## Type Variations

The utilities include different styling variations for different use cases:

- **`typeColors`**: Gradient backgrounds for detailed views
- **`cardTypeColors`**: Solid backgrounds for card layouts
- **`typeIcons`**: `(1).svg` variants for detailed views
- **`cardTypeIcons`**: `(2).svg` variants for card layouts

This allows you to maintain visual consistency while having appropriate styling for different contexts.
