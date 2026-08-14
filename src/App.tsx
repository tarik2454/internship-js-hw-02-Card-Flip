import { useEffect, useRef, useState } from "react";
import { cardData } from "./data/card-data";

type CardId = (typeof cardData)[number]["id"];

const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem("theme");
  return stored === "dark" ? "dark" : "light";
};

const createInitialFlipState = () =>
  cardData.reduce<Record<CardId, boolean>>((acc, card) => {
    acc[card.id] = true;
    return acc;
  }, {} as Record<CardId, boolean>);

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [flippedCards, setFlippedCards] = useState(createInitialFlipState);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const handleThemeToggle = () =>
    setTheme((current) => (current === "light" ? "dark" : "light"));

  const handleCardClick = (id: CardId) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  };

  const cardBackAlt = "Playing card back";

  return (
    <>
      <div className="toggle">
        <input
          id="theme-toggle"
          type="checkbox"
          checked={theme === "dark"}
          onChange={handleThemeToggle}
          aria-label="Toggle theme"
        />
        <label htmlFor="theme-toggle"></label>
      </div>

      <div className="cards-container">
        {cardData.map((card) => (
          <div
            key={card.id}
            className={`card-wrapper ${card.wrapperClass}`}
            onClick={() => handleCardClick(card.id)}
          >
            <div className={`card ${flippedCards[card.id] ? "flipped" : ""}`}>
              <div className="card-front">
                <img src={card.frontSrc} alt={card.alt} />
              </div>
              <div className="card-back">
                <img
                  src="https://deckofcardsapi.com/static/img/back.png"
                  alt={cardBackAlt}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <audio ref={audioRef} src="/audio/card-down.mp3" preload="auto" />
    </>
  );
}
