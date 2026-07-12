import "./PremiumSection.css";

function rImg(r) { return r.img || (r.images && r.images[0]) || "https://picsum.photos/seed/default/600/400"; }
function rLoc(r) { return r.loc || r.location || "Unknown"; }

export default function PremiumSection({ rooms, onViewDetails }) {
  const premium = rooms.filter((r) => r.category === "Luxury" || r.price >= 2000);
  if (premium.length === 0) return null;

  return (
    <section className="premium-section">
      <div className="premium-bg">
        <div className="premium-content">
          <span className="premium-badge">⭐ Premium Collection</span>
          <h2>Luxury Living</h2>
          <p>Experience the finest accommodations with premium amenities</p>
        </div>
      </div>

      <div className="premium-grid">
        {premium.slice(0, 4).map((r) => (
          <div className="premium-card" key={r.id || r._id} onClick={() => onViewDetails(r)}>
            <div className="premium-card-img">
              <img src={rImg(r)} alt={r.title} />
              <div className="premium-card-price">${Number(r.price).toLocaleString()}<span>/mo</span></div>
            </div>
            <div className="premium-card-body">
              <h3>{r.title}</h3>
              <p>📍 {rLoc(r)}</p>
              <div className="premium-features">
                <span>⭐ {r.rating}</span>
                <span>🛏️ {r.bed} Bed</span>
                <span>🚿 {r.bath} Bath</span>
                <span>👥 Up to {r.guests}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
