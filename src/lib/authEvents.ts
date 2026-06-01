/** Client event to refresh auth state after sign-in/out without full page reload. */
export const AUTH_CHANGED_EVENT = "bearhug:auth-changed";

export function notifyAuthChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  }
}
