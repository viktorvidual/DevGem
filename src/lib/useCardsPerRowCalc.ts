import { useState, useEffect } from "react";
import { CARD_WIDTH, PAGE_WIDTH } from "../common/common.ts";

export const useCardsPerRowCalc = () => {
  const [numCards, setNumCards] = useState(0);

  const style = {
    display: 'grid',
    gridTemplateColumns: `repeat(${numCards}, 1fr)`,
    gap: '10px',
  };

  useEffect(() => {
    const handleResize = () => {
      const availableWidth = window.innerWidth * PAGE_WIDTH;
      const cardWidth = availableWidth >= CARD_WIDTH ? CARD_WIDTH : availableWidth;
      const cardsPerRow = Math.floor(availableWidth / cardWidth);
      setNumCards(cardsPerRow);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [])

  return {
    numCards,
    style
  }
}