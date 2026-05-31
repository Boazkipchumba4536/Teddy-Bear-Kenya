import { CreditCard, Headphones, Truck } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Timely Shipping",
    desc: "Same-day Nairobi CBD · Countrywide delivery",
  },
  {
    icon: Headphones,
    title: "Online Support",
    desc: "WhatsApp & phone — we're here to help",
  },
  {
    icon: CreditCard,
    title: "Secure Payment",
    desc: "M-Pesa Till · Card · Cash on delivery",
  },
];

export default function TrustFeatures() {
  return (
    <section className="border-y border-rose-100 bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-3 gap-8">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-blush flex items-center justify-center text-rose-600">
              <Icon className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-cocoa">{title}</h3>
            <p className="text-sm text-cocoa/50">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
