import React, { useEffect, useState } from "react";

const MemoryGame = () => {
  const [gridSize, setGridSize] = useState(4);
  const [cards, setCards] = useState([]);

  const [flippedCards, setFlippedCards] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);

  const [won, setWon] = useState(false);

  const handleGridSize = (e) => {
    const size = parseInt(e.target.value);
    if (size >= 2 && size <= 10) setGridSize(size);
  };

  const initializeGame = () => {
    const totalCards = gridSize * gridSize;
    // console.log("totalCards", totalCards);
    const pairCount = Math.floor(totalCards / 2);
    // console.log("pairCount", pairCount);
    const numbers = [...Array(pairCount).keys()].map((n) => n + 1);
    // console.log("numbers", numbers);
    const shuffleCards = [...numbers, ...numbers]
      .sort(() => Math.random() - 0.5)
      .slice(0, totalCards)
      .map((number, index) => ({ id: index, number }));
    setCards(shuffleCards);
    setFlippedCards([]);
    setSolved([]);
    setWon(false);
  };

  useEffect(() => {
    initializeGame();
  }, [gridSize]);

  const checkMatch = (secondId) => {
    const [firstId] = flippedCards;
    if (cards[firstId].number === cards[secondId].number) {
      setSolved([...solved, firstId, secondId]);
      setFlippedCards([]);
      setDisabled(false);
    } else {
      setTimeout(() => {
        setFlippedCards([]);
        setDisabled(false);
      }, 100);
    }
  };

  const handleClick = (id) => {
    //If already won the match
    if (disabled || won) {
      return;
    }

    // If not a single card is flipped
    if (flippedCards.length === 0) {
      setFlippedCards([id]);
      return;
    }

    // If single card is selected
    if (flippedCards.length === 1) {
      if (id !== flippedCards[0]) {
        setDisabled(true);
        setFlippedCards([...flippedCards, id]);
        // Add the match logic here
        checkMatch(id);
      } else {
        setDisabled(false);
        setFlippedCards([]);
      }
    }
  };

  // To check the flipped card has the same id and to add the color
  const isFlipped = (id) => flippedCards.includes(id) || solved.includes(id);

  const isSolved = (id) => solved.includes(id);

  useEffect(() => {
    if (solved.length === cards.length && cards.length > 0) {
      setWon(true);
    }
  }, [solved, cards]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Memory Game</h1>
      {/* Input */}
      <div className="mb-4">
        <label htmlFor="gridSize" className="mr-4">
          Grid Size
        </label>
        <input
          id="gridSize"
          type="number"
          min={2}
          max={10}
          value={gridSize}
          onChange={handleGridSize}
          className="border-2 border-gray-300 rounded px-2 py-1"
        />
      </div>

      {/* Game Board */}
      <div
        className="grid gap-2 mb-4"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          width: `min(100%, ${gridSize * 5.5}rem)`,
        }}
      >
        {cards?.map((card) => {
          return (
            <div
              key={card.id}
              className={`aspect-square flex items-center justify-center text-xl font-bold rounded-lg cursor-pointer transition-all duration-300  ${
                isFlipped(card.id)
                  ? isSolved(card.id)
                    ? "bg-green-500 text-white"
                    : "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-400"
              }`}
              onClick={() => handleClick(card.id)}
            >
              {isFlipped(card.id) ? card.number : "?"}
            </div>
          );
        })}
      </div>

      {/* Result */}

      {won && (
        <div className="mt-4 text-4xl font-bold text-green-500 animate-bounce">
          You Won!
        </div>
      )}

      {/* Reset / Play Again Button */}
      <button
        onClick={initializeGame}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        {won ? "Play Again" : "Reset"}
      </button>
    </div>
  );
};

export default MemoryGame;
