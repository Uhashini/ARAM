// Card.jsx
import React from "react";
import "../pages/Home.css";

const Card = ({ title, description, action, href }) => {
  const handleClick = () => {
    if (href) {
      window.location.href = href; // navigate to page
    }
  };

  return (
    <div
      className={`card ${href ? "card-clickable" : ""}`}
      onClick={handleClick}
    >
      <h3 className="card-title">{title}</h3>
      <p className="card-body">{description}</p>
      {action && (
        <button
          className="card-action"
          onClick={(e) => {
            e.stopPropagation(); // avoid double trigger
            handleClick();
          }}
        >
          {action}
        </button>
      )}
    </div>
  );
};

export default Card;
