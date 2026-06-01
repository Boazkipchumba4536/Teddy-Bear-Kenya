import Link from "next/link";
import { site } from "@/lib/site";

interface LegalPageLayoutProps {
  title: string;
  description: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export default function LegalPageLayout({
  title,
  description,
  lastUpdated,
  children,
}: LegalPageLayoutProps) {
  return (
    <div className="bg-cream min-h-full">
      <div className="container-main py-12 md:py-16 max-w-3xl">
        <p className="text-sm text-caramel font-medium mb-2">{site.name}</p>
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-ink">{title}</h1>
        <p className="text-ink-muted mt-2">{description}</p>
        <p className="text-xs text-ink-light mt-4">Last updated: {lastUpdated}</p>

        <article className="prose-legal mt-10 space-y-6 text-ink-muted leading-relaxed">
          {children}
        </article>

        <div className="mt-12 pt-8 border-t border-caramel/15 flex flex-wrap gap-4 text-sm">
          <Link href="/terms" className="text-caramel hover:underline">
            Terms of Service
          </Link>
          <Link href="/privacy" className="text-caramel hover:underline">
            Privacy Policy
          </Link>
          <Link href="/cookies" className="text-caramel hover:underline">
            Cookie Policy
          </Link>
          <Link href="/contact" className="text-caramel hover:underline">
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}
