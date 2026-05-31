import { Shield, Truck, Headphones, CreditCard } from "lucide-react";

const features = [
  { icon: Truck, title: "Countrywide delivery", desc: "Nairobi same-day · Kenya-wide shipping" },
  { icon: CreditCard, title: "M-Pesa & card", desc: "Till 9466773 · Secure checkout" },
  { icon: Headphones, title: "WhatsApp support", desc: "Fast replies · Order assistance" },
  { icon: Shield, title: "Quality guaranteed", desc: "Premium plush · Gift-ready packaging" },
];

export default function TrustBar() {
  return (
    <section className="py-14 border-y border-ink/5 bg-white">
      <div className="container-main">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4 items-start">
              <div className="w-11 h-11 rounded-2xl bg-sand flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-wine" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-semibold text-ink text-sm mb-1">{title}</h3>
                <p className="text-ink-muted text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
