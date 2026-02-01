// CardGrid.jsx
import React from "react";
import Card from "./Card";
import "../pages/Home.css";

const CardGrid = ({ items }) => {
  return (
    <div className="card-grid">
      {items.map((item) => (
        <Card
          key={item.title}
          title={item.title}
          description={item.description}
          action={item.action}
          href={item.href}   // 👈 pass the path
        />
      ))}
    </div>
  );
};

export default CardGrid;
