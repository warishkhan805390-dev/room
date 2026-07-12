import "./CategoryRooms.css";

function rImg(r) { return r.img || (r.images && r.images[0]) || "https://picsum.photos/seed/default/400/300"; }
function rLoc(r) { return r.loc || r.location || "Unknown"; }

const catConfig = [
  { key: "Apartment", icon: "🏢", label: "Apartments", color: "#2563eb", desc: "Modern living spaces" },
  { key: "Studio", icon: "🏡", label: "Studios", color: "#059669", desc: "Compact & cozy" },
  { key: "Entire Home", icon: "🏠", label: "Entire Homes", color: "#d97706", desc: "Complete privacy" },
  { key: "Private Room", icon: "🚪", label: "Private Rooms", color: "#7c3aed", desc: "Your own space" },
  { key: "Shared Room", icon: "👥", label: "Shared Rooms", color: "#dc2626", desc: "Budget friendly" },
];

export default function CategoryRooms({ rooms, onViewDetails }) {
  return (
    <section className="category-rooms-section">
      <div className="section-title">
        <h2>Browse by Category</h2>
        <p>Find exactly what you're looking for</p>
      </div>

      {catConfig.map((cat) => {
        const filtered = rooms.filter((r) => r.category === cat.key);
        if (filtered.length === 0) return null;

        return (
          <div className="cat-room-block" key={cat.key}>
            <div className="cat-room-header">
              <div className="cat-room-title">
                <span className="cat-room-icon" style={{ background: `${cat.color}15`, color: cat.color }}>
                  {cat.icon}
                </span>
                <div>
                  <h3>{cat.label}</h3>
                  <p>{cat.desc} · {filtered.length} rooms</p>
                </div>
              </div>
            </div>

            <div className="cat-room-scroll">
              {filtered.map((r) => (
                <div className="cat-room-card" key={r.id || r._id} onClick={() => onViewDetails(r)}>
                  <div className="cat-room-card-img">
                    <img src={rImg(r)} alt={r.title} />
                    <div className="cat-room-card-overlay">
                      <button className="cat-view-btn">View Details</button>
                    </div>
                  </div>
                  <div className="cat-room-card-body">
                    <h4>{r.title}</h4>
                    <p>📍 {rLoc(r)}</p>
                    <div className="cat-room-card-footer">
                      <span className="cat-price">${Number(r.price).toLocaleString()}<span>/mo</span></span>
                      <span className="cat-rating">⭐ {r.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
