import "./FeaturedRooms.css";

function rImg(r) { return r.img || (r.images && r.images[0]) || "https://picsum.photos/seed/default/400/300"; }
function rLoc(r) { return r.loc || r.location || "Unknown"; }
function rReviews(r) { return r.reviews || r.reviewsCount || 0; }

export default function FeaturedRooms({ rooms, onViewDetails, title }) {
  return (
    <section className="featured" id="rooms">
      <div className="section-title">
        <h2>{title || "Featured Rooms"}</h2>
        <p>Handpicked rooms with the best amenities for you</p>
      </div>
      <div className="room-grid">
        {rooms.map((r) => (
          <div className="room-card" key={r.id || r._id}>
            <div className="room-card-img-wrap">
              <img className="room-card-img" src={rImg(r)} alt={r.title} />
              <span className="room-category">{r.category}</span>
            </div>
            <div className="room-card-body">
              <h3>{r.title}</h3>
              <div className="room-location">📍 {rLoc(r)}</div>
              <div className="room-price">
                ${Number(r.price).toLocaleString()} <span>/month</span>
              </div>
              <div className="room-features">
                <span>🛏️ {r.bed}</span>
                <span>🚿 {r.bath}</span>
                <span>👥 {r.guests}</span>
                <span>⭐ {r.rating}</span>
              </div>
              <div className="room-card-footer">
                <span className="reviews">({rReviews(r)} reviews)</span>
                <button className="btn-sm" onClick={() => onViewDetails(r)}>
                  View Details →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
