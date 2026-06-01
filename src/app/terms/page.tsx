import LegalDocument from "@/components/legal/LegalDocument";
import { termsSections } from "@/content/legal";
import { site } from "@/lib/site";

export const metadata = {
  title: `Terms of Service | ${site.name}`,
  description: `Terms and conditions for shopping at ${site.name}.`,
};

export default function TermsPage() {
  return (
    <LegalDocument
      title="Terms of Service"
      description={`These terms govern your use of ${site.name} and purchases made through our website.`}
      sections={termsSections}
      updated="1 June 2026"
    />
  );
}
