import { useState } from "react";
import "./SearchBar.css";

export default function SearchBar({ onSearch }) {
  const [loc, setLoc] = useState("");
  const [budget, setBudget] = useState("Any Price");

  const handleSearch = () => {
    onSearch({ location: loc, budget });
  };

  return (
    <section className="search-section">
      <div className="search-container">
        <div className="search-group">
          <label>📍 Location</label>
          <input
            type="text"
            placeholder="City, area or landmark"
            value={loc}
            onChange={(e) => setLoc(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <div className="search-group">
          <label>📅 Check In</label>
          <input type="date" />
        </div>
        <div className="search-group">
          <label>💰 Budget</label>
          <select value={budget} onChange={(e) => setBudget(e.target.value)}>
            <option>Any Price</option>
            <option>$200 - $500</option>
            <option>$500 - $1000</option>
            <option>$1000 - $2000</option>
            <option>$2000+</option>
          </select>
        </div>
        <button className="search-btn" onClick={handleSearch}>
          🔍 Search
        </button>
      </div>
    </section>
  );
}
