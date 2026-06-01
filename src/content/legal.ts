import { site } from "@/lib/site";

export type LegalSection = { title: string; paragraphs: string[] };

export const termsSections: LegalSection[] = [
  {
    title: "1. Agreement",
    paragraphs: [
      `By accessing ${site.name} ("the Site") or placing an order, you agree to these Terms of Service. If you do not agree, please do not use the Site.`,
      "We may update these terms from time to time. Continued use after changes constitutes acceptance of the revised terms.",
    ],
  },
  {
    title: "2. Products & pricing",
    paragraphs: [
      "All prices are listed in Kenyan Shillings (KSh) unless stated otherwise. We strive to display accurate descriptions and images; minor variations in plush shade or size may occur.",
      "We reserve the right to limit quantities, refuse orders, or correct pricing errors before an order is confirmed.",
    ],
  },
  {
    title: "3. Orders & payment",
    paragraphs: [
      "An order is confirmed once you receive an order reference number. Payment is due as selected at checkout (M-Pesa or card as displayed).",
      "M-Pesa till payments are completed on your device; we will contact you if payment cannot be verified.",
    ],
  },
  {
    title: "4. Delivery",
    paragraphs: [
      "Delivery timelines shown at checkout are estimates. Same-day Nairobi delivery applies to qualifying orders placed before the stated cutoff.",
      "Risk of loss passes to you upon delivery to the address provided. Please ensure someone is available to receive the package.",
    ],
  },
  {
    title: "5. Returns & cancellations",
    paragraphs: [
      "Personalised or custom items may not be eligible for return unless faulty. Standard bears in unused condition may be returned within 7 days of delivery — contact us first.",
      "Cancellations before dispatch may be accepted at our discretion; contact us via WhatsApp or email as soon as possible.",
    ],
  },
  {
    title: "6. Limitation of liability",
    paragraphs: [
      `${site.name} is not liable for indirect or consequential losses. Our total liability for any claim relating to an order is limited to the amount paid for that order.`,
    ],
  },
  {
    title: "7. Contact",
    paragraphs: [
      `Questions about these terms: ${site.email} or ${site.phoneDisplay}.`,
      `${site.address.line1}, ${site.address.city}, ${site.address.country}.`,
    ],
  },
];

export const privacySections: LegalSection[] = [
  {
    title: "1. Who we are",
    paragraphs: [
      `${site.name} operates this website to sell teddy bears and gifts in Kenya. This policy explains how we collect and use personal data.`,
    ],
  },
  {
    title: "2. Data we collect",
    paragraphs: [
      "Account: name, email, phone number, and password (stored securely via our authentication provider).",
      "Orders: delivery address, county, phone, email, order items, payment method, and optional gift messages.",
      "Technical: IP address, browser type, and cookies where you have consented (see our Cookie Policy).",
    ],
  },
  {
    title: "3. How we use your data",
    paragraphs: [
      "To process and deliver orders, communicate order status, provide customer support, and improve our services.",
      "We do not sell your personal data to third parties.",
    ],
  },
  {
    title: "4. Legal basis & retention",
    paragraphs: [
      "We process data to perform our contract with you (fulfilling orders) and, where applicable, with your consent (marketing cookies).",
      "Order records are retained as required for accounting and dispute resolution, typically up to seven years.",
    ],
  },
  {
    title: "5. Sharing with service providers",
    paragraphs: [
      "We use trusted providers for hosting, database, authentication, and email. These processors only access data needed to provide their service and are bound by confidentiality obligations.",
    ],
  },
  {
    title: "6. Your rights",
    paragraphs: [
      "You may request access, correction, or deletion of your personal data by contacting us. You may withdraw cookie consent at any time via your browser or our cookie settings.",
    ],
  },
  {
    title: "7. Security",
    paragraphs: [
      "We use industry-standard measures including encrypted connections (HTTPS) and access controls. No method of transmission over the internet is 100% secure.",
    ],
  },
  {
    title: "8. Contact",
    paragraphs: [`Privacy enquiries: ${site.email}.`],
  },
];

export const cookiesSections: LegalSection[] = [
  {
    title: "1. What are cookies?",
    paragraphs: [
      "Cookies are small text files stored on your device. We also use similar technologies such as local storage for essential site features.",
    ],
  },
  {
    title: "2. Your choice",
    paragraphs: [
      "When you first visit our site, you can Accept or Decline non-essential cookies. Essential storage required for the cart and your consent choice will still be used so the site can function.",
    ],
  },
  {
    title: "3. Types of cookies we use",
    paragraphs: [
      "Strictly necessary: session/authentication cookies from our auth provider, and local storage for shopping cart and cookie preference.",
      "Functional (if accepted): preferences that improve your experience.",
      "Analytics (if accepted): anonymous usage data to help us improve the shop — only loaded after you accept.",
    ],
  },
  {
    title: "4. Managing cookies",
    paragraphs: [
      "You can change your choice by clearing site data in your browser and revisiting the site, or using browser settings to block cookies.",
      "Declining cookies may limit some features but you can still browse and checkout using essential storage.",
    ],
  },
  {
    title: "5. Updates",
    paragraphs: ["We may update this policy; the version shown on this page applies from the date listed below."],
  },
];
