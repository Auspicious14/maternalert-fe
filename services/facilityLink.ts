/**
 * Clinic linking helpers.
 * IDENTICAL in maternalert-web (src/services/facilityLink.ts) and
 * maternalert-fe (services/facilityLink.ts).
 *
 * The clinic QR code contains "MATERNALERT:FACILITY:<code>", where <code> is
 * the 8-character facility code shown on the health worker dashboard.
 */

const PREFIX = "MATERNALERT:FACILITY:";

/** Accepts a scanned QR value or a typed code; returns the QR value, or null. */
export function normaliseFacilityCode(raw: string): string | null {
  let v = (raw ?? "").trim();
  if (!v) return null;
  // Clinic posters hold a link: https://app.maternalert.com.ng/facility-linking?code=XXXX
  const fromUrl = v.match(/[?&]code=([A-Za-z0-9-]{6,14})/);
  if (fromUrl) v = fromUrl[1];
  if (v.toUpperCase().startsWith(PREFIX)) {
    const code = v.slice(PREFIX.length).trim().toUpperCase();
    return /^[A-Z0-9]{6,12}$/.test(code) ? `${PREFIX}${code}` : null;
  }
  const code = v.replace(/[\s-]/g, "").toUpperCase();
  return /^[A-Z0-9]{6,12}$/.test(code) ? `${PREFIX}${code}` : null;
}

export function linkErrorMessage(err: unknown): string {
  const e = err as { response?: { status?: number; data?: { message?: string } } };
  const status = e?.response?.status;
  if (!e?.response) return "We couldn't reach MaternAlert. Check your internet and try again.";
  if (status === 404) return "We couldn't find a clinic with that code. Check it with the nurse and try again.";
  if (status === 400) return "That isn't a MaternAlert clinic code. Ask the nurse to show you the clinic's QR code.";
  if (status === 409) {
    return (
      e.response?.data?.message ??
      "You're already linked to a different clinic. Unlink from it first, then link to this one."
    );
  }
  return "Linking didn't work. Please try again in a minute.";
}

// ── Clinic code waiting from a poster QR (set by middleware) ─────────────────
const PENDING = "ma_pending_clinic";

export function getPendingClinic(): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.split("; ").find((c) => c.startsWith(`${PENDING}=`));
  return m ? decodeURIComponent(m.split("=")[1] || "") || null : null;
}

export function clearPendingClinic() {
  if (typeof document === "undefined") return;
  document.cookie = `${PENDING}=; path=/; max-age=0`;
}
