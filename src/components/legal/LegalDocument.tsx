import Link from "next/link";
import type { LegalSection } from "@/content/legal";
import { site } from "@/lib/site";

interface LegalDocumentProps {
  title: string;
  description: string;
  sections: LegalSection[];
  updated: string;
}

export default function LegalDocument({
  title,
  description,
  sections,
  updated,
}: LegalDocumentProps) {
  return (
    <div className="bg-cream min-h-[70vh]">
      <div className="container-main py-12 md:py-16 max-w-3xl">
        <p className="text-sm text-caramel font-medium mb-2">{site.name}</p>
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-ink">{title}</h1>
        <p className="text-ink-muted mt-3 leading-relaxed">{description}</p>
        <p className="text-xs text-ink-light mt-4">Last updated: {updated}</p>

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-display text-xl font-semibold text-ink mb-3">{section.title}</h2>
              <div className="space-y-3 text-ink-muted text-sm leading-relaxed">
                {section.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-caramel/15 flex flex-wrap items-center gap-4 text-sm">
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
          <Link href="/shop" className="text-caramel hover:underline">
            Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
