import { useState } from "react";
import "./ContactPage.css";

export default function ContactPage({ onBack }) {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section className="contact-page">
      <button className="btn btn-outline back-btn" onClick={onBack}>← Back</button>

      <div className="contact-container">
        <div className="contact-info">
          <h2>Get In Touch</h2>
          <p>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>

          <div className="contact-details">
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <div>
                <h4>Email</h4>
                <p>support@roomrent.com</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <div>
                <h4>Phone</h4>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <div>
                <h4>Address</h4>
                <p>123 Main Street, New York, NY 10001</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">🕐</span>
              <div>
                <h4>Working Hours</h4>
                <p>Mon - Sat: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <h3>Send a Message</h3>
          <div className="form-group">
            <label>Your Name</label>
            <input type="text" placeholder="John Doe" required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="john@example.com" required />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea rows="5" placeholder="Tell us about your query..." required></textarea>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
            {sent ? "✅ Message Sent!" : "📨 Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
}
