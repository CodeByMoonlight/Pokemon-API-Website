import { useState, useEffect, useRef } from "react";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;

    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, []);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="z-1 fixed bottom-5 right-5 flex items-center gap-2">
      <button
        onClick={togglePlayPause}
        className="rounded-full bg-white/80 p-3 shadow-md transition-all hover:cursor-pointer hover:bg-white"
      >
        {isPlaying ? (
          <FaVolumeUp className="text-text-primary h-5 w-5" />
        ) : (
          <FaVolumeMute className="text-text-primary h-5 w-5" />
        )}
      </button>
      <audio ref={audioRef} loop preload="auto" className="hidden">
        <source src="/assets/bg_music.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
