import "./HowItWorks.css";

const steps = [
  { num: 1, title: "Search", desc: "Browse thousands of listings in your desired location with our smart filters." },
  { num: 2, title: "Compare", desc: "View photos, amenities, and reviews to find the best match for you." },
  { num: 3, title: "Book", desc: "Reserve your room instantly with secure online payment and move in hassle-free." },
];

export default function HowItWorks() {
  return (
    <section className="how-it-works">
      <div className="section-title">
        <h2>How It Works</h2>
        <p>Three simple steps to find your perfect room</p>
      </div>
      <div className="steps">
        {steps.map((s) => (
          <div className="step" key={s.num}>
            <div className="step-num">{s.num}</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
