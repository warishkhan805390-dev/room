import "./Testimonials.css";

const testimonials = [
  {
    text: "I found the perfect studio in just 2 days! The search filters made it so easy to find exactly what I needed.",
    name: "Sarah Johnson",
    loc: "New York, USA",
    seed: "u1",
  },
  {
    text: "RoomRent helped me find a great roommate and a beautiful apartment. The whole process was smooth and stress-free!",
    name: "Rahul Sharma",
    loc: "Mumbai, India",
    seed: "u2",
  },
  {
    text: "As a landlord, I was able to list my property and find a reliable tenant within a week. Highly recommended!",
    name: "Emma Wilson",
    loc: "London, UK",
    seed: "u3",
  },
];

export default function Testimonials() {
  return (
    <section className="testimonials">
      <div className="section-title">
        <h2>What Our Users Say</h2>
        <p>Hear from people who found their perfect home through RoomRent</p>
      </div>
      <div className="testimonial-grid">
        {testimonials.map((t, i) => (
          <div className="testimonial-card" key={i}>
            <p>"{t.text}"</p>
            <div className="testimonial-author">
              <img
                src={`https://picsum.photos/seed/${t.seed}/100/100`}
                alt={t.name}
              />
              <div>
                <h4>{t.name}</h4>
                <span>{t.loc}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
