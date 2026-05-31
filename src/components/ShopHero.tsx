import Link from "next/link";

export default function ShopHero() {
  return (
    <div className="bg-sand border-b border-ink/5">
      <div className="container-main py-14 md:py-20">
        <nav className="text-sm text-ink-muted mb-6">
          <Link href="/" className="hover:text-ink transition">
            Home
          </Link>
          <span className="mx-2 opacity-40">/</span>
          <span className="text-ink">Shop</span>
        </nav>
        <h1 className="font-display text-4xl md:text-5xl font-medium text-ink tracking-tight mb-4">
          All teddy bears
        </h1>
        <p className="text-ink-muted text-lg max-w-xl leading-relaxed">
          Giant, big, and classic plush bears — personalized embroidery available.
          Delivered countrywide across Kenya.
        </p>
      </div>
    </div>
  );
}
