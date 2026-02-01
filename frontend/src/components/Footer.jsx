import React from "react";
import "../pages/Home.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} ARAM. All rights reserved.</p>
      <p className="footer-links">
        <a href="#privacy">Privacy</a>
        <span>•</span>
        <a href="#terms">Terms</a>
        <span>•</span>
        <a href="#contact">Contact</a>
      </p>
    </footer>
  );
};

export default Footer;
