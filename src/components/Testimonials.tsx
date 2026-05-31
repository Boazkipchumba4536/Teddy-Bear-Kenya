import { Star } from "lucide-react";

const reviews = [
  {
    name: "Wanjiku M.",
    location: "Westlands",
    text: "The 120cm teddy bear was the highlight of my daughter's birthday. Same-day delivery and beautifully wrapped — she hasn't let go of it!",
    rating: 5,
  },
  {
    name: "Brian O.",
    location: "Karen",
    text: "Ordered the 140cm giant for our anniversary proposal. Absolutely massive and so soft. Teddy Bear Kenya nailed it.",
    rating: 5,
  },
  {
    name: "Faith N.",
    location: "Nairobi CBD",
    text: "Got a 65cm blue teddy with name embroidery. M-Pesa was easy and the bear quality is premium. Will order again!",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white to-ivory-dark/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-rose-600/55 mb-3">
            Teddy lovers
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-cocoa">
            What our customers say
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {reviews.map((review) => (
            <blockquote
              key={review.name}
              className="card p-8 relative hover:shadow-soft transition-shadow duration-300"
            >
              <div className="flex gap-0.5 text-gold mb-4">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-cocoa/75 leading-relaxed mb-6 text-[15px]">
                &ldquo;{review.text}&rdquo;
              </p>
              <footer>
                <cite className="not-italic font-bold text-cocoa block">
                  {review.name}
                </cite>
                <span className="text-sm text-cocoa/45">{review.location}</span>
              </footer>
              <span className="absolute top-6 right-8 text-5xl text-rose-600/10 font-display leading-none select-none">
                &ldquo;
              </span>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
