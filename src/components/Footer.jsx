import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h3 className="footer-logo">
            Room<span>Rent</span>
          </h3>
          <p className="footer-desc">
            Your trusted platform for finding the perfect room. We connect
            tenants with the best properties worldwide.
          </p>
        </div>
        <div>
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Browse Rooms</a></li>
            <li><a href="#">List Property</a></li>
            <li><a href="#">About Us</a></li>
          </ul>
        </div>
        <div>
          <h3>Support</h3>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Safety Guide</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
        <div>
          <h3>Contact</h3>
          <ul>
            <li><a href="#">📧 support@roomrent.com</a></li>
            <li><a href="#">📞 +1 (555) 123-4567</a></li>
            <li><a href="#">📍 123 Main St, NY</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; 2026 RoomRent. All rights reserved.
      </div>
    </footer>
  );
}
