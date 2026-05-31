import { site } from "@/lib/site";

const items = [
  "🧸 Giant teddy bears up to 160cm",
  "✏️ Name embroidery from KSh 500",
  `🚚 ${site.stats.delivery} delivery`,
  `📞 ${site.phoneDisplay}`,
  `💳 M-Pesa Till ${site.mpesa.till1}`,
  "🎀 Free gift wrap on teddy orders",
  `⭐ ${site.stats.happyClients} happy clients`,
  `📍 ${site.address.line1}`,
];

export default function TrustMarquee() {
  const doubled = [...items, ...items];
  return (
    <div className="border-y border-rose-100 bg-blush/50 overflow-hidden py-3">
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((text, i) => (
          <span key={`${text}-${i}`} className="mx-8 text-sm font-semibold text-cocoa/50">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
