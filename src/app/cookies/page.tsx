import LegalDocument from "@/components/legal/LegalDocument";
import { cookiesSections } from "@/content/legal";
import { site } from "@/lib/site";

export const metadata = {
  title: `Cookie Policy | ${site.name}`,
  description: `How ${site.name} uses cookies and how you can manage your preferences.`,
};

export default function CookiesPage() {
  return (
    <LegalDocument
      title="Cookie Policy"
      description="This policy describes the cookies and similar technologies we use, and how you can accept or decline non-essential cookies. Use the cookie banner or footer link to change your preference anytime."
      sections={cookiesSections}
      updated="1 June 2026"
    />
  );
}
