import React from "react";
import "../pages/Home.css";
import aramHeroLogo from "../assets/aram-hero-logo.png"; // adjust path

const Hero = () => {
  return (
    <section className="hero hero-parallax" id="home">
      <div className="hero-layout">
        <div className="hero-logo-left">
          <img
            src={aramHeroLogo}
            alt="ARAM logo"
            className="hero-logo-large hero-parallax-layer"
          />
        </div>
        <div className="hero-content">
          <h1>Recognize. Report. Recover.</h1>
          <p>
            Empowering communities and healthcare professionals to identify, report and respond
            to abuse safely.
          </p>
          <div className="hero-actions">
            <button className="btn-primary">I need help now</button>
            <button className="btn-ghost">I&apos;m a healthcare worker</button>
          </div>
        </div>

        
      </div>
    </section>
  );
};

export default Hero;