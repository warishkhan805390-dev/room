import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { bookingAPI } from "../api";
import "./RoomModal.css";

export default function RoomModal({ room, onClose }) {
  const { user } = useAuth();
  const [imgIdx, setImgIdx] = useState(0);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  if (!room) return null;

  const allImgs = room.images && room.images.length > 0
    ? room.images
    : [room.img, ...(room.imgs || [])].filter(Boolean);
  const roomId = room.id || room._id;

  const handleBook = async () => {
    if (!user) {
      setErr("Please sign in first to book a room");
      return;
    }
    if (!checkIn || !checkOut) {
      setErr("Please select check-in and check-out dates");
      return;
    }
    setLoading(true);
    setErr("");
    try {
      const res = await bookingAPI.create({
        roomId,
        checkIn,
        checkOut,
        guests: room.guests || 1,
      });
      setBooking(res.data);
    } catch (err) {
      setErr(err.response?.data?.msg || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const days = checkIn && checkOut
    ? Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
    : 1;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-gallery">
          <img src={allImgs[imgIdx]} alt={room.title} />
          {allImgs.length > 1 && (
            <div className="modal-thumbs">
              {allImgs.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  className={i === imgIdx ? "active" : ""}
                  onClick={() => setImgIdx(i)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="modal-info">
          <h2>{room.title}</h2>
          <span className="modal-loc">📍 {room.loc || room.location}</span>

          <div className="modal-price">
            ${Number(room.price).toLocaleString()} <span>/month</span>
          </div>

          <div className="modal-rating">
            ⭐ {room.rating} <span>({room.reviewsCount || room.reviews || 0} reviews)</span>
          </div>

          <p className="modal-desc">{room.desc || room.description}</p>

          <div className="modal-amenities">
            <h3>Amenities</h3>
            <div className="amenities-grid">
              <span className={room.amenities?.wifi ?? room.wifi ? "avail" : "na"}>📶 WiFi</span>
              <span className={room.amenities?.ac ?? room.ac ? "avail" : "na"}>❄️ AC</span>
              <span className={room.amenities?.parking ?? room.parking ? "avail" : "na"}>🅿️ Parking</span>
              <span className="avail">🛏️ {room.bed} Bed</span>
              <span className="avail">🚿 {room.bath} Bath</span>
              <span className="avail">👥 {room.guests} Guests</span>
            </div>
          </div>

          {booking ? (
            <div className="booking-success">
              <h3>✅ Booking Confirmed!</h3>
              <p>Room booked from {new Date(booking.checkIn).toLocaleDateString()} to {new Date(booking.checkOut).toLocaleDateString()}</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: "#2563eb", margin: "8px 0" }}>
                Total: ${booking.totalAmount?.toLocaleString()}
              </p>
              <p>💳 Go to Dashboard to complete payment</p>
            </div>
          ) : (
            <>
              <div className="booking-form">
                <h3>Book This Room</h3>
                <div className="booking-dates-row">
                  <div className="form-group">
                    <label>Check In</label>
                    <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Check Out</label>
                    <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                  </div>
                </div>
                {checkIn && checkOut && (
                  <p style={{ fontSize: 14, color: "#64748b", marginTop: 8 }}>
                    {days} night{days > 1 ? "s" : ""} × ${Number(room.price).toLocaleString()}/month = <strong style={{ color: "#2563eb" }}>${(days * room.price).toLocaleString()}</strong>
                  </p>
                )}
              </div>

              {err && <div className="modal-err">{err}</div>}

              <div className="modal-actions">
                <button className="btn btn-primary" onClick={handleBook} disabled={loading}>
                  {loading ? "⏳ Booking..." : user ? "📋 Book Now" : "🔑 Sign In to Book"}
                </button>
                <button className="btn btn-outline" onClick={() => {
                  const contact = room.ownerContact || room.ownerName || "+1 (555) 000-0000";
                  alert(`📞 Contact Owner: ${contact}\n\nOwner: ${room.ownerName || "Property Manager"}`);
                }}>
                  📞 Contact Owner
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
