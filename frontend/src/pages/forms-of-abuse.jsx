'use client';

import { useState, useEffect, useRef } from 'react';
import './forms-of-abuse.css';

const abuseTypes = [
  {
    title: "Physical Abuse",
    description: "Violent or physical harm including hitting, shoving, holding down, throwing objects, using weapons, slapping, kicking, burning, or stabbing. May start small and escalate, often blamed on substances or victim's actions.",
    icon: "💥",
    color: "from-red-500 to-orange-500"
  },
  {
    title: "Controlling Behaviour", 
    description: "Forces you against your will through repeated acts limiting freedom. Includes restricting access to friends/family, controlling finances, monitoring devices, or preventing work/education.",
    icon: "🔒",
    color: "from-blue-500 to-indigo-500"
  },
  {
    title: "Coercive Behaviour",
    description: "Builds fear over time through threats, manipulation, or implied harm to you, loved ones, pets, or possessions. Makes you feel trapped and unable to make independent decisions.",
    icon: "⛓️",
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Sexual Violence",
    description: "Any unwanted sexual act without consent, including rape, assault, harassment, or sharing intimate images. Consent must be free from pressure, threats, or intoxication.",
    icon: "🚨",
    color: "from-pink-500 to-red-500"
  },
  {
    title: "Online Abuse",
    description: "Harassment through digital means: sharing private info, impersonation, trolling, or public accusations. Feels humiliating and strips control over your online presence.",
    icon: "📱",
    color: "from-cyan-500 to-blue-500"
  },
  {
    title: "Economic Abuse",
    description: "Controls money, property, or financial decisions. Includes taking money secretly, restricting access to funds, taking loans in your name, or giving inadequate allowances.",
    icon: "💰",
    color: "from-yellow-500 to-amber-500"
  },
  {
    title: "Image-based Abuse",
    description: "Non-consensual sharing or threats to share intimate photos/videos (revenge porn, sextortion). Violates privacy and used for coercion or humiliation.",
    icon: "📸",
    color: "from-rose-500 to-fuchsia-500"
  },
  {
    title: "Stalking",
    description: "Repeated unwanted contact including following, cyberstalking, unwanted gifts, or property damage. Often continues after leaving abusive relationships.",
    icon: "👁️",
    color: "from-gray-500 to-slate-500"
  },
  {
    title: "Cyberstalking",
    description: "Uses spyware/stalkerware to monitor location, messages, or online activity without consent. Creates constant vulnerability and fear of being watched.",
    icon: "🕵️",
    color: "from-emerald-500 to-teal-500"
  },
  {
    title: "Gaslighting",
    description: "Makes you doubt reality, memory, or sanity. Denies events, accuses you of mental issues, or distorts facts to maintain control.",
    icon: "🌀",
    color: "from-orange-400 to-yellow-500"
  }
];

const FormsOfAbuse = () => {
  const [visibleCards, setVisibleCards] = useState(3);
  const scrollRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        const scrollProgress = scrollTop / (scrollHeight - clientHeight);
        const newVisibleCards = Math.max(
          3,
          Math.min(
            abuseTypes.length,
            Math.floor(3 + scrollProgress * (abuseTypes.length - 3))
          )
        );
        setVisibleCards(newVisibleCards);
      }
    };

    const el = scrollRef.current;
    el?.addEventListener("scroll", handleScroll);
    return () => el?.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="forms-page">
      <div className="forms-header">
        <h1>Forms of Domestic Abuse</h1>
        <p>Recognize the patterns. Stacked cards reveal more as you scroll.</p>
      </div>

      {/* scroll container */}
      <div className="forms-scroll" ref={scrollRef}>
        <div className="forms-stack">
          {abuseTypes.map((abuse, index) => (
            <div
              key={abuse.title}
              className={`forms-card ${
                index < visibleCards ? "forms-card-visible" : "forms-card-hidden"
              }`}
              style={{ zIndex: abuseTypes.length - index }}
            >
              <div className="forms-card-header">
                <span className="forms-card-icon">{abuse.icon}</span>
                <h2>{abuse.title}</h2>
              </div>
              <p className="forms-card-body">{abuse.description}</p>
              <div className="forms-card-footer">
                <span>Recognize • Act • Support</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="forms-footer">
        <p>Scroll to reveal more forms of abuse • Awareness saves lives</p>
      </div>
    </div>
  );
};

export default FormsOfAbuse;