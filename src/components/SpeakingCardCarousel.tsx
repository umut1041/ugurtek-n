import React, { useState } from "react";
import data from "../data/speaking/cards.json";

type Card = (typeof data.cards)[number];

const SpeakingCardCarousel: React.FC = () => {
  const [index, setIndex] = useState(0);

  const cards = data.cards;
  const current: Card | undefined = cards[index];

  const next = () => {
    setIndex((prev) => (prev + 1) % cards.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  if (!current) return null;

  return (
    <div className="speaking-carousel">
      <h3>{current.title}</h3>
      <ul>
        {current.prompts.map((p, idx) => (
          <li key={idx}>{p}</li>
        ))}
      </ul>
      <div className="carousel-controls">
        <button type="button" onClick={prev}>
          ← Önceki kart
        </button>
        <button type="button" onClick={next}>
          Sonraki kart →
        </button>
      </div>
    </div>
  );
};

export default SpeakingCardCarousel;

