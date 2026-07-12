import { useState, useEffect } from "react";
import "./Hero.css";

const heroSlides = [
  {
    img: "https://picsum.photos/seed/heroliving/1600/900",
    badge: "🔥 Trending Now",
  },
  {
    img: "https://picsum.photos/seed/heromodern/1600/900",
    badge: "✨ New Listings",
  },
  {
    img: "https://picsum.photos/seed/heroview/1600/900",
    badge: "🏆 Top Rated",
  },
];

export default function Hero({ onExploreRooms, onListProperty }) {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((s) => (s + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero">
      <div className="hero-bg-slider">
        {heroSlides.map((s, i) => (
          <div
            key={i}
            className={`hero-bg-slide ${i === slide ? "active" : ""}`}
            style={{ backgroundImage: `url(${s.img})` }}
          />
        ))}
        <div className="hero-overlay" />
      </div>

      <div className="hero-content">
        <span className="hero-badge-pill">{heroSlides[slide].badge}</span>
        <h1 className="hero-title">
          Find Your <span className="highlight">Dream Room</span>
          <br />in Minutes
        </h1>
        <p className="hero-sub">
          Discover thousands of rooms, apartments, and shared spaces near you.
          Your perfect home is just a click away.
        </p>
        <div className="hero-btns">
          <button className="btn btn-primary btn-pulse" onClick={onExploreRooms}>
            🏠 Explore Rooms
          </button>
          <button className="btn btn-hero-outline" onClick={onListProperty}>
            📋 List Your Property
          </button>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-num">12K+</span>
            <span className="stat-label">Rooms Listed</span>
          </div>
          <div className="stat">
            <span className="stat-num">8K+</span>
            <span className="stat-label">Happy Tenants</span>
          </div>
          <div className="stat">
            <span className="stat-num">95%</span>
            <span className="stat-label">Satisfaction</span>
          </div>
        </div>

        <div className="hero-dots">
          {heroSlides.map((_, i) => (
            <span
              key={i}
              className={`dot ${i === slide ? "active" : ""}`}
              onClick={() => setSlide(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
