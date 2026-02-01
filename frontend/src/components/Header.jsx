import React from "react";
import "../pages/Home.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <span className="logo-mark">ARAM</span>
          <span className="logo-subtitle">
            Central Reporting for Managing Safe Services
          </span>
        </div>
      </div>

      <nav className="nav">
        <a href="#home">Home</a>
        <a href="#understand-abuse">Understand abuse</a>
        <a href="#recognize-abuse">Recognize abuse</a>
        <a href="#seeking-support">Seeking support</a>
      </nav>

      <div className="header-right">
        <button className="btn-outline">Log in</button>
        <button className="btn-primary">Register / Get help</button>
      </div>
    </header>
  );
};

export default Header;
