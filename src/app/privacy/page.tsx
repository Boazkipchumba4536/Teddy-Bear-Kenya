import LegalDocument from "@/components/legal/LegalDocument";
import { privacySections } from "@/content/legal";
import { site } from "@/lib/site";

export const metadata = {
  title: `Privacy Policy | ${site.name}`,
  description: `How ${site.name} collects, uses, and protects your personal data.`,
};

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      description="We respect your privacy. This policy explains what data we collect and how we use it when you shop with us."
      sections={privacySections}
      updated="1 June 2026"
    />
  );
}
