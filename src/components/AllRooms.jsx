import { useState } from "react";
import "./AllRooms.css";

function rImg(r) { return r.img || (r.images && r.images[0]) || "https://picsum.photos/seed/default/400/300"; }
function rLoc(r) { return r.loc || r.location || "Unknown"; }
function rReviews(r) { return r.reviews || r.reviewsCount || 0; }

export default function AllRooms({ rooms, onViewDetails, onBack }) {
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("");

  const categories = ["All", ...new Set(rooms.map((r) => r.category || "").filter(Boolean))];

  let filtered = filter === "All" ? rooms : rooms.filter((r) => r.category === filter);

  if (sort === "low") filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sort === "high") filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sort === "rating") filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  return (
    <section className="all-rooms">
      <div className="all-rooms-header">
        <button className="btn btn-outline back-btn" onClick={onBack}>← Back</button>
        <h2>All Rooms ({filtered.length})</h2>
      </div>

      <div className="all-rooms-controls">
        <div className="filter-chips">
          {categories.map((c) => (
            <button key={c} className={`chip ${filter === c ? "active" : ""}`} onClick={() => setFilter(c)}>
              {c}
            </button>
          ))}
        </div>
        <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Default</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="no-results">
          <span className="no-icon">😕</span>
          <h3>No rooms found</h3>
          <p>Try changing your filters above</p>
        </div>
      ) : (
        <div className="room-grid">
          {filtered.map((r) => (
            <div className="room-card" key={r.id || r._id}>
              <div className="room-card-img-wrap">
                <img className="room-card-img" src={rImg(r)} alt={r.title} />
                <span className="room-category">{r.category}</span>
              </div>
              <div className="room-card-body">
                <h3>{r.title}</h3>
                <div className="room-location">📍 {rLoc(r)}</div>
                <div className="room-price">${Number(r.price).toLocaleString()} <span>/month</span></div>
                <div className="room-features">
                  <span>🛏️ {r.bed}</span>
                  <span>🚿 {r.bath}</span>
                  <span>👥 {r.guests}</span>
                  <span>⭐ {r.rating}</span>
                </div>
                <div className="room-card-footer">
                  <span className="reviews">({rReviews(r)} reviews)</span>
                  <button className="btn-sm" onClick={() => onViewDetails(r)}>View Details →</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
