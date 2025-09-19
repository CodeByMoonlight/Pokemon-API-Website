import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import PokemonView from "./PokemonView.js";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import MemoryGame from "./MemoryGame.jsx";
import Pokedex from "./Pokedex.jsx";

const route = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/view/:pokemonId",
    element: <PokemonView />,
  },
  {
    path: "/memory-game",
    element: <MemoryGame />,
  },
  {
    path: "/pokedex",
    element: <Navigate to="/pokedex/page/1" replace />,
  },
  {
    path: "/pokedex/page/:pageNumber",
    element: <Pokedex />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={route} />
  </StrictMode>,
);
