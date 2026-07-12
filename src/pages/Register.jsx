import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export default function Register({ onSwitch, onSuccess, onClose }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      onSuccess();
    } catch (err) {
      setErr(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" onClick={onClose}>
      <div className="auth-card" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose}>✕</button>
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join RoomRent and find your perfect room</p>
        </div>
        {err && <div className="auth-err">{err}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Min 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
            />
          </div>
          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account?{" "}
          <a href="#" onClick={(e) => { e.preventDefault(); onSwitch(); }}>
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
