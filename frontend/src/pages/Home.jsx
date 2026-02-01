import React, { useEffect } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import CardGrid from "../components/CardGrid.jsx";
import Footer from "../components/Footer";
import "./Home.css";

const Home = () => {
  useEffect(() => {
    // 1) Fade-up on scroll for sections & cards
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    const fadeElements = document.querySelectorAll(".fade-up, .fade-child");
    fadeElements.forEach((el) => observer.observe(el));

    // 2) Parallax on hero logo
    const handleScroll = () => {
      const layer = document.querySelector(".hero-parallax-layer");
      const hero = document.querySelector(".hero-parallax");
      if (!layer || !hero) return;

      const rect = hero.getBoundingClientRect();
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const progress = 1 - Math.min(Math.max(rect.top / viewportHeight, 0), 1);
      const translateY = progress * 30; // tweak strength
      layer.style.transform = `translateY(${translateY}px)`;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="home">
      <Header />

      {/* HERO stays inside main container */}
      <main className="main-inner">
        <Hero />
      </main>

      {/* Quick actions band */}
      <section className="band band-quick-actions">
        <div className="band-inner section fade-up">
          <h2>Start here</h2>
          <p className="section-subtitle">
            Choose the option that best describes how you want to use this system.
          </p>
          <CardGrid
            items={[
              {
                title: "Self Screening",
                description:
                  "Answer private questions to understand your risk and what to do next.",
                action: "Start self screening",
              },
              {
                title: "Witness Report",
                description:
                  "Share what you witnessed. Witness details are optional, victim details are not.",
                action: "Report as a witness",
              },
              {
                title: "Healthcare Worker",
                description:
                  "Review risk scores, complete screenings and create referrals for patients.",
                action: "Healthcare worker portal",
              },
              {
                title: "Admin & Analytics",
                description:
                  "View reports, manage user access and monitor system-wide trends.",
                action: "Go to admin panel",
              },
            ]}
          />
        </div>
      </section>

      {/* Understand abuse / forms of abuse */}
      <section className="band band-understand" id="understand-abuse">
        <div className="band-inner section fade-up">
          <h2>Understand abuse</h2>
          <p className="section-subtitle">
            Short explanations and real stories to help you recognize different forms of abuse.
          </p>
          <CardGrid
            items={[
              {
                title: "Forms of abuse",
                description:
                  "Brief definitions of physical, emotional, sexual, financial and digital abuse.",
                action: "Learn about abuse types",
                href: "ARAM\frontend\src\pages\forms-of-abuse.jsx",
              },
              {
                title: "Helping a family or friend",
                description:
                  "Simple, safe ways to support someone you think might be experiencing abuse.",
                action: "See ways to help",
              },
              {
                title: "Online safety",
                description:
                  "Tips to protect your devices, accounts and online activity.",
                action: "View safety tips",
              },
              {
                title: "Stories of sexual consent",
                description:
                  "Understand consent and your rights through survivor stories.",
                action: "Read consent stories",
              },
              {
                title: "Stories of stalking and harassment",
                description:
                  "Learn about stalking, harassment and your legal options.",
                action: "Read survivor stories",
              },
              {
                title: "Dispelling myths",
                description:
                  "A short quiz to challenge common myths about domestic abuse.",
                action: "Take the myths quiz",
              },
            ]}
          />
        </div>
      </section>

      {/* Recognize abuse */}
      <section className="band band-recognize" id="recognize-abuse">
        <div className="band-inner section fade-up">
          <h2>Recognize abuse</h2>
          <p className="section-subtitle">
            Guidance and tools to help you notice warning signs early.
          </p>
          <div className="two-column">
            <div className="fade-child">
              <h3>Warning signs</h3>
              <p>
                Learn about behaviour patterns, injuries and controlling actions that may signal
                abuse.
              </p>
            </div>
            <div className="fade-child">
              <h3>Self checks</h3>
              <p>
                Use short checklists and screenings to reflect on your situation or someone
                else&apos;s.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seeking support */}
      <section className="band band-support" id="seeking-support">
        <div className="band-inner section fade-up">
          <h2>Seeking support</h2>
          <p className="section-subtitle">
            Practical information and services to help you plan next steps safely.
          </p>
          <CardGrid
            items={[
              {
                title: "Leaving an abusive relationship",
                description:
                  "Step-by-step planning and safety tips if you are thinking about leaving.",
                action: "Plan to leave safely",
              },
              {
                title: "Types of support",
                description:
                  "Learn about shelters, counselling, legal support and other services.",
                action: "Explore support options",
              },
              {
                title: "Financial independence",
                description:
                  "Information about financial abuse and building financial stability.",
                action: "Learn about finances",
              },
              {
                title: "Locate support",
                description:
                  "Find local services, hospitals and community organisations near you.",
                action: "Find local services",
              },
              {
                title: "National helplines",
                description:
                  "24/7 helplines that can support you wherever you live.",
                action: "View helplines",
              },
              {
                title: "Resources",
                description:
                  "Extra reading, legal information and wellbeing resources.",
                action: "Browse resources",
              },
            ]}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
