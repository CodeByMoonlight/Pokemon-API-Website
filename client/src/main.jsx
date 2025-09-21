import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import PokemonView from "./PokemonView.jsx";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import MemoryGame from "./MemoryGame.jsx";
import Pokedex from "./Pokedex.jsx";
import { NavigationProvider } from "./contexts/NavigationContext.jsx";
import ProgressBar from "./components/ProgressBar.jsx";
import { useNavigation } from "./contexts/NavigationContext.jsx";

// Wrapper component to show progress bar
const AppWithProgressBar = ({ children }) => {
  const { isLoading, progress } = useNavigation();

  return (
    <>
      <ProgressBar progress={progress} isVisible={isLoading} />
      {children}
    </>
  );
};

const route = createBrowserRouter([
  {
    path: "/",
    element: (
      <AppWithProgressBar>
        <App />
      </AppWithProgressBar>
    ),
  },
  {
    path: "/view/:pokemonId",
    element: (
      <AppWithProgressBar>
        <PokemonView />
      </AppWithProgressBar>
    ),
  },
  {
    path: "/memory-game",
    element: (
      <AppWithProgressBar>
        <MemoryGame />
      </AppWithProgressBar>
    ),
  },
  {
    path: "/pokedex",
    element: <Navigate to="/pokedex/page/1" replace />,
  },
  {
    path: "/pokedex/page/:pageNumber",
    element: (
      <AppWithProgressBar>
        <Pokedex />
      </AppWithProgressBar>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NavigationProvider>
      <RouterProvider router={route} />
    </NavigationProvider>
  </StrictMode>,
);
