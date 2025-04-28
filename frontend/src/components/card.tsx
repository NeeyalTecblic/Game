import React from "react";
import "../card.css";

interface CardProps {
  value: string;
  isFlipped: boolean;
  onClick: () => void;
  isMatched: boolean;
}

const Card: React.FC<CardProps> = ({ value, isFlipped, onClick, isMatched }) => {
  return (
    <div className={`card ${isFlipped || isMatched ? "flipped" : ""}`} onClick={onClick}>
      <div className="card-inner">
        <div className="card-front">?</div>
        <div className="card-back">{value}</div>
      </div>
    </div>
  );
};

export default Card;
