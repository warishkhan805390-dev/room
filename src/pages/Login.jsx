import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export default function Login({ onSwitch, onSuccess, onClose }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      onSuccess();
    } catch (err) {
      setErr(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" onClick={onClose}>
      <div className="auth-card" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose}>✕</button>
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your RoomRent account</p>
        </div>
        {err && <div className="auth-err">{err}</div>}
        <form onSubmit={handleSubmit}>
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
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="auth-footer">
          Don't have an account?{" "}
          <a href="#" onClick={(e) => { e.preventDefault(); onSwitch(); }}>
            Register here
          </a>
        </p>
        <div className="auth-demo">
          <p>Demo Accounts:</p>
          <code>admin@roomrent.com / admin123</code>
          <code>john@example.com / user123</code>
        </div>
      </div>
    </div>
  );
}
