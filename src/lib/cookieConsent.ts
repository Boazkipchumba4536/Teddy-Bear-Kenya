export type CookieConsentStatus = "accepted" | "declined";

export const COOKIE_CONSENT_KEY = "bearhug-cookie-consent";
export const COOKIE_CONSENT_VERSION = "1";

export interface CookieConsentRecord {
  status: CookieConsentStatus;
  version: string;
  updatedAt: string;
}

export function getCookieConsent(): CookieConsentRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookieConsentRecord;
    if (parsed.version !== COOKIE_CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setCookieConsent(status: CookieConsentStatus) {
  const record: CookieConsentRecord = {
    status,
    version: COOKIE_CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(record));
  window.dispatchEvent(new Event("bearhug:cookie-consent"));
  return record;
}

export function hasCookieConsentChoice(): boolean {
  return getCookieConsent() !== null;
}

export function cookiesAllowed(): boolean {
  const c = getCookieConsent();
  return c?.status === "accepted";
}
