import "../App.css";
import { Link } from "react-router-dom";
import NavigationLink from "./NavigationLink";
import { HiOutlineHome } from "react-icons/hi";
import { BiBookOpen } from "react-icons/bi";
import { IoGameControllerOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { MdOutlineLeaderboard } from "react-icons/md";

export default function Navbar() {
  const location = useLocation();
  const [currentId, setCurrentID] = useState("header");

  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setCurrentID("header");
    else if (path.startsWith("/pokedex")) setCurrentID("pokedex");
    else if (path === "/memory-game") setCurrentID("game");
    else if (path === "/rank") setCurrentID("rank");
  }, [location.pathname]);

  const [showNavbar, setShowNavbar] = useState(true);
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`z-1 fixed left-0 right-0 top-0 mx-5 flex flex-row items-center justify-between rounded-[12px] bg-white/60 p-[8px] backdrop-blur-sm transition-transform duration-300 ${showNavbar ? "translate-y-5" : "-translate-y-full"}`}
    >
      <div className="">
        <Link
          to="/"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <img src="/assets/logo.png" alt="logo" className="w-24" />
        </Link>
      </div>

      <div className="align-center flex flex-row items-center justify-center gap-4">
        <NavigationLink
          to="/"
          className={`nav-item hidden sm:flex ${currentId === "header" ? "active" : ""}`}
          loadingOptions={{ minLoadingTime: 800 }}
        >
          <HiOutlineHome className="h-[20px] w-[20px]" />
          <span className="hidden sm:inline">HOME</span>
        </NavigationLink>
        <NavigationLink
          to="/pokedex/page/1"
          className={`nav-item hidden sm:flex ${currentId === "pokedex" ? "active" : ""}`}
          loadingOptions={{ minLoadingTime: 2000 }}
        >
          <BiBookOpen className="h-[20px] w-[20px]" />
          <span className="hidden sm:inline">POKEDEX</span>
        </NavigationLink>
        <NavigationLink
          to="/memory-game"
          className={`nav-item hidden sm:flex ${currentId === "game" ? "active" : ""}`}
          loadingOptions={{ minLoadingTime: 1200 }}
        >
          <IoGameControllerOutline className="h-[20px] w-[20px]" />
          <span className="hidden sm:inline">GAME</span>
        </NavigationLink>
      </div>
      <div className="flex flex-row gap-2">
        <a
          href="https://github.com/CodeByMoonlight/Pokemon-API-Website"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-item-btn"
        >
          <FaGithub className="h-[20px] w-[20px]" />
        </a>
        <a
          href="https://github.com/PokeAPI/pokeapi"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-item-btn"
        >
          <img
            src="/assets/Pokemon.svg"
            alt="pokeball"
            className="bg-text-primary border-text-primary h-[20px] w-[20px] rounded-full border-2"
          />
        </a>
      </div>
    </nav>
  );
}
