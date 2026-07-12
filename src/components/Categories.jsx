import "./Categories.css";

const cats = [
  { icon: "🏠", title: "Entire Home", desc: "Complete privacy" },
  { icon: "🚪", title: "Private Room", desc: "Your own space" },
  { icon: "👥", title: "Shared Room", desc: "Budget friendly" },
  { icon: "🏢", title: "Apartment", desc: "Modern living" },
  { icon: "🏡", title: "Studio", desc: "Compact & cozy" },
  { icon: "🏰", title: "Luxury", desc: "Premium stays" },
];

export default function Categories({ onCategoryClick }) {
  return (
    <section className="categories" id="categories">
      <div className="section-title">
        <h2>Browse Categories</h2>
        <p>Find the perfect space that matches your lifestyle</p>
      </div>
      <div className="cat-grid">
        {cats.map((c, i) => (
          <div className="cat-card" key={i} onClick={() => onCategoryClick(c.title)}>
            <div className="cat-icon">{c.icon}</div>
            <h4>{c.title}</h4>
            <p>{c.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
