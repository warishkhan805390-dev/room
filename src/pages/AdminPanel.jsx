import { useState, useEffect } from "react";
import { adminAPI, roomAPI, bookingAPI, paymentAPI } from "../api";
import { useAuth } from "../context/AuthContext";
import "./AdminPanel.css";

export default function AdminPanel({ onBack }) {
  const { user } = useAuth();
  const [tab, setTab] = useState("dashboard");
  const [data, setData] = useState({ stats: {}, recentBookings: [] });
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [editRoom, setEditRoom] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", price: "", location: "", city: "", country: "",
    category: "Studio", bed: 1, bath: 1, guests: 2, images: "",
    amenities: { wifi: false, ac: false, parking: false, kitchen: false, tv: false },
  });

  useEffect(() => {
    if (user?.role !== "admin") return;
    adminAPI.dashboard().then((r) => setData(r.data)).catch(() => {});
    roomAPI.getAll().then((r) => setRooms(r.data)).catch(() => {});
    adminAPI.users().then((r) => setUsers(r.data)).catch(() => {});
    bookingAPI.all().then((r) => setBookings(r.data)).catch(() => {});
    paymentAPI.all().then((r) => setPayments(r.data)).catch(() => {});
  }, [user]);

  const handleDeleteRoom = async (id) => {
    if (!confirm("Delete this room?")) return;
    await roomAPI.delete(id);
    setRooms(rooms.filter((r) => r.id !== id));
  };

  const handleSaveRoom = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      bed: Number(form.bed),
      bath: Number(form.bath),
      guests: Number(form.guests),
      images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
    };
    if (editRoom) {
      const updated = await roomAPI.update(editRoom.id, payload);
      setRooms(rooms.map((r) => (r.id === editRoom.id ? updated.data : r)));
    } else {
      const created = await roomAPI.create(payload);
      setRooms([created.data, ...rooms]);
    }
    setShowForm(false);
    setEditRoom(null);
  };

  const openEdit = (room) => {
    setEditRoom(room);
    setForm({
      title: room.title,
      description: room.description,
      price: room.price,
      location: room.location,
      city: room.city,
      country: room.country,
      category: room.category,
      bed: room.bed,
      bath: room.bath,
      guests: room.guests,
      images: (room.images || []).join(", "),
      amenities: room.amenities || { wifi: false, ac: false, parking: false, kitchen: false, tv: false },
    });
    setShowForm(true);
  };

  const handleRoleChange = async (id, role) => {
    await adminAPI.updateUserRole(id, role);
    setUsers(users.map((u) => (u.id === id ? { ...u, role } : u)));
  };

  const handleDeleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;
    await adminAPI.deleteUser(id);
    setUsers(users.filter((u) => u.id !== id));
  };

  const handleBookingStatus = async (id, status) => {
    await bookingAPI.update(id, { status });
    setBookings(bookings.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  if (user?.role !== "admin") {
    return (
      <div className="admin-unauthorized">
        <h2>🔒 Admin Access Required</h2>
        <p>You need admin privileges to access this panel.</p>
        <button className="btn btn-primary" onClick={onBack}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-sidebar">
        <div className="admin-logo">RoomRent Admin</div>
        <nav>
          {[
            { key: "dashboard", label: "📊 Dashboard", icon: "📊" },
            { key: "rooms", label: "🏠 Rooms", icon: "🏠" },
            { key: "users", label: "👥 Users", icon: "👥" },
            { key: "bookings", label: "📋 Bookings", icon: "📋" },
            { key: "payments", label: "💰 Payments", icon: "💰" },
          ].map((t) => (
            <button
              key={t.key}
              className={`admin-nav-item ${tab === t.key ? "active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <button className="admin-back" onClick={onBack}>← Back to Site</button>
      </div>

      <div className="admin-content">
        {tab === "dashboard" && (
          <>
            <h2>Dashboard</h2>
            <div className="admin-stats">
              {[
                { label: "Total Users", value: data.stats.totalUsers || 0, color: "#2563eb" },
                { label: "Total Rooms", value: data.stats.totalRooms || 0, color: "#059669" },
                { label: "Total Bookings", value: data.stats.totalBookings || 0, color: "#d97706" },
                { label: "Revenue", value: `$${(data.stats.totalRevenue || 0).toLocaleString()}`, color: "#7c3aed" },
                { label: "Pending", value: data.stats.pendingBookings || 0, color: "#dc2626" },
              ].map((s) => (
                <div className="stat-card" key={s.label} style={{ borderTop: `3px solid ${s.color}` }}>
                  <div className="stat-card-value">{s.value}</div>
                  <div className="stat-card-label">{s.label}</div>
                </div>
              ))}
            </div>
            <h3 style={{ marginTop: 32 }}>Recent Bookings</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Room</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {data.recentBookings?.map((b) => (
                  <tr key={b.id}>
                    <td>{b.user?.name || "N/A"}</td>
                    <td>{b.room?.title || "N/A"}</td>
                    <td>${b.totalAmount?.toLocaleString()}</td>
                    <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                    <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {!data.recentBookings?.length && (
                  <tr><td colSpan="5" style={{ textAlign: "center", color: "#94a3b8" }}>No bookings yet</td></tr>
                )}
              </tbody>
            </table>
          </>
        )}

        {tab === "rooms" && (
          <>
            <div className="admin-header-row">
              <h2>Manage Rooms</h2>
              <button className="btn btn-primary" onClick={() => { setEditRoom(null); setForm({ title: "", description: "", price: "", location: "", city: "", country: "", category: "Studio", bed: 1, bath: 1, guests: 2, images: "", amenities: { wifi: false, ac: false, parking: false, kitchen: false, tv: false } }); setShowForm(true); }}>
                + Add Room
              </button>
            </div>
            {showForm && (
              <form className="admin-form" onSubmit={handleSaveRoom}>
                <h3>{editRoom ? "Edit Room" : "New Room"}</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Title</label>
                    <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Price ($/month)</label>
                    <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Location</label>
                    <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                      {["Studio", "Private Room", "Shared Room", "Apartment", "Entire Home", "Luxury"].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Bed</label>
                    <input type="number" value={form.bed} onChange={(e) => setForm({ ...form, bed: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Bath</label>
                    <input type="number" value={form.bath} onChange={(e) => setForm({ ...form, bath: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Guests</label>
                    <input type="number" value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Images (comma-separated URLs)</label>
                  <input value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} placeholder="https://..." />
                </div>
                <div className="form-checkboxes">
                  {["wifi", "ac", "parking", "kitchen", "tv"].map((a) => (
                    <label key={a} className="checkbox-label">
                      <input type="checkbox" checked={form.amenities[a]} onChange={(e) => setForm({ ...form, amenities: { ...form.amenities, [a]: e.target.checked } })} />
                      {a.charAt(0).toUpperCase() + a.slice(1)}
                    </label>
                  ))}
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">{editRoom ? "Update Room" : "Create Room"}</button>
                  <button type="button" className="btn btn-outline" onClick={() => { setShowForm(false); setEditRoom(null); }}>Cancel</button>
                </div>
              </form>
            )}
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Location</th>
                  <th>Category</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((r) => (
                  <tr key={r.id}>
                    <td>{r.title}</td>
                    <td>${r.price?.toLocaleString()}</td>
                    <td>{r.city}, {r.country}</td>
                    <td><span className="badge badge-confirmed">{r.category}</span></td>
                    <td>⭐ {r.rating}</td>
                    <td className="action-td">
                      <button className="btn-sm" onClick={() => openEdit(r)}>✏️</button>
                      <button className="btn-sm btn-danger" onClick={() => handleDeleteRoom(r.id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {tab === "users" && (
          <>
            <h2>Manage Users</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>City</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.phone || "-"}</td>
                    <td>{u.city || "-"}</td>
                    <td>
                      <select value={u.role} onChange={(e) => handleRoleChange(u.id, e.target.value)}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="action-td">
                      <button className="btn-sm btn-danger" onClick={() => handleDeleteUser(u.id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {tab === "bookings" && (
          <>
            <h2>All Bookings</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Room</th>
                  <th>Amount</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td>{b.user?.name || "N/A"}</td>
                    <td>{b.room?.title || "N/A"}</td>
                    <td>${b.totalAmount?.toLocaleString()}</td>
                    <td>{new Date(b.checkIn).toLocaleDateString()}</td>
                    <td>{new Date(b.checkOut).toLocaleDateString()}</td>
                    <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                    <td><span className={`badge badge-${b.paymentStatus === "paid" ? "confirmed" : "pending"}`}>{b.paymentStatus}</span></td>
                    <td className="action-td">
                      {b.status === "pending" && (
                        <>
                          <button className="btn-sm" onClick={() => handleBookingStatus(b.id, "confirmed")}>✅</button>
                          <button className="btn-sm btn-danger" onClick={() => handleBookingStatus(b.id, "cancelled")}>❌</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {tab === "payments" && (
          <>
            <h2>Payment History</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>User</th>
                  <th>Room</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontFamily: "monospace", fontSize: 12 }}>{p.transactionId || "N/A"}</td>
                    <td>{p.user?.name || "N/A"}</td>
                    <td>{p.booking?.room?.title || "N/A"}</td>
                    <td>${p.amount?.toLocaleString()}</td>
                    <td>{p.method}</td>
                    <td><span className={`badge badge-${p.status === "success" ? "confirmed" : "pending"}`}>{p.status}</span></td>
                    <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
