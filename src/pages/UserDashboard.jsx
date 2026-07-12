import { useState, useEffect } from "react";
import { bookingAPI, paymentAPI } from "../api";
import { useAuth } from "../context/AuthContext";
import "./UserDashboard.css";

export default function UserDashboard({ onBack }) {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [payingId, setPayingId] = useState(null);

  useEffect(() => {
    bookingAPI.mine().then((r) => setBookings(r.data)).catch(() => {});
    paymentAPI.mine().then((r) => setPayments(r.data)).catch(() => {});
  }, []);

  const handlePay = async (bookingId) => {
    setPayingId(bookingId);
    try {
      const res = await paymentAPI.pay({ bookingId, method: "card" });
      alert(`✅ Payment Successful!\nTransaction: ${res.data.transactionId}\nAmount: $${res.data.amount}`);
      const updated = await bookingAPI.mine();
      setBookings(updated.data);
    } catch (err) {
      alert(err.response?.data?.msg || "Payment failed");
    } finally {
      setPayingId(null);
    }
  };

  return (
    <div className="user-dashboard">
      <div className="user-dash-header">
        <h2>👋 Welcome, {user?.name}</h2>
        <div className="user-dash-actions">
          <button className="btn btn-outline" onClick={onBack}>← Home</button>
          <button className="btn btn-outline" onClick={() => { logout(); onBack(); }}>🚪 Logout</button>
        </div>
      </div>

      <div className="user-tabs">
        {["bookings", "payments", "profile"].map((t) => (
          <button key={t} className={`user-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t === "bookings" && "📋 "}{t === "payments" && "💰 "}{t === "profile" && "👤 "}
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === "bookings" && (
        <div className="user-section">
          <h3>My Bookings ({bookings.length})</h3>
          {bookings.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🏠</span>
              <h4>No bookings yet</h4>
              <p>Browse rooms and book your first stay!</p>
            </div>
          ) : (
            <div className="booking-list">
              {bookings.map((b) => (
                <div className="booking-card" key={b.id}>
                  <img
                    src={b.room?.images?.[0] || "https://picsum.photos/seed/default/200/150"}
                    alt={b.room?.title}
                  />
                  <div className="booking-info">
                    <h4>{b.room?.title || "Unknown Room"}</h4>
                    <p>📍 {b.room?.location || "N/A"}</p>
                    <div className="booking-dates">
                      <span>📅 {new Date(b.checkIn).toLocaleDateString()} → {new Date(b.checkOut).toLocaleDateString()}</span>
                      <span>👥 {b.guests} guest(s)</span>
                    </div>
                    <div className="booking-meta">
                      <span className="booking-amount">${b.totalAmount?.toLocaleString()}</span>
                      <span className={`badge badge-${b.status}`}>{b.status}</span>
                      <span className={`badge badge-${b.paymentStatus === "paid" ? "confirmed" : "pending"}`}>
                        {b.paymentStatus}
                      </span>
                    </div>
                    {b.status === "pending" && b.paymentStatus === "unpaid" && (
                      <button
                        className="btn btn-primary"
                        style={{ marginTop: 12, padding: "8px 20px", fontSize: 13 }}
                        onClick={() => handlePay(b.id)}
                        disabled={payingId === b.id}
                      >
                        {payingId === b.id ? "⏳ Processing..." : "💳 Pay Now - $" + b.totalAmount}
                      </button>
                    )}
                    {b.status === "confirmed" && (
                      <div className="booking-owner-info">
                        <p style={{ marginTop: 10, fontSize: 13, color: "#059669" }}>
                          ✅ Booking Confirmed! Contact owner: {b.room?.ownerContact || "N/A"} ({b.room?.ownerName || "N/A"})
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "payments" && (
        <div className="user-section">
          <h3>Payment History</h3>
          {payments.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">💰</span>
              <h4>No payments yet</h4>
            </div>
          ) : (
            <table className="user-table">
              <thead>
                <tr>
                  <th>Transaction</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Card/UPI</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontFamily: "monospace", fontSize: 12 }}>{p.transactionId}</td>
                    <td>${p.amount?.toLocaleString()}</td>
                    <td>{p.method}</td>
                    <td style={{ fontSize: 13 }}>
                      {p.cardLast4 ? `****${p.cardLast4}` : p.upiId || "-"}
                    </td>
                    <td><span className={`badge badge-${p.status === "success" ? "confirmed" : "pending"}`}>{p.status}</span></td>
                    <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === "profile" && (
        <div className="user-section">
          <h3>My Profile</h3>
          <div className="profile-card">
            <div className="profile-avatar">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="profile-details">
              <div className="profile-row">
                <span className="profile-label">Name</span>
                <span>{user?.name}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Email</span>
                <span>{user?.email}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Phone</span>
                <span>{user?.phone || "Not set"}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Address</span>
                <span>{user?.address || "Not set"}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">City</span>
                <span>{user?.city || "Not set"}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Role</span>
                <span className={`badge badge-${user?.role === "admin" ? "confirmed" : "pending"}`}>{user?.role}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
