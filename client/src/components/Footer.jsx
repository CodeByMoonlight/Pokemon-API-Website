import "../App.css";
import { Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { AiFillInstagram } from "react-icons/ai";
import { FaYoutube } from "react-icons/fa";
import { AiFillTikTok } from "react-icons/ai";

export default function Footer() {
  return (
    <nav
      id="about"
      className="absolute bottom-0 left-0 right-0 z-50 flex w-full flex-row items-center justify-between bg-white/50 px-[8px] py-3 backdrop-blur-sm"
    >
      <div className="w-1/3">
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
      <div className="flex w-1/3 flex-row justify-center gap-5">
        <a
          href="https://www.facebook.com/Pokemon/"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-item-btn"
        >
          <FaFacebook className="icon" />
        </a>
        <a
          href="https://x.com/Pokemon?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-item-btn"
        >
          <FaXTwitter className="icon" />
        </a>
        <a
          href="https://www.instagram.com/pokemon/?hl=en"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-item-btn"
        >
          <AiFillInstagram className="icon" />
        </a>
        <a
          href="https://www.youtube.com/channel/UCFctpiB_Hnlk3ejWfHqSm6Q"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-item-btn"
        >
          <FaYoutube className="icon" />
        </a>
        <a
          href="https://www.tiktok.com/@pokemonofficial?lang=en"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-item-btn"
        >
          <AiFillTikTok className="icon" />
        </a>
      </div>
      <div className="w-1/3 text-right">
        <p className="text-text-primary font-semibold">
          2025 All Rights Reserved
        </p>
      </div>
    </nav>
  );
}
