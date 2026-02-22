/**
 * City/station options for from/to inputs.
 * Uses parallel arrays from stations-en.json and stations-ar.json (same index = same city).
 * Canonical value is always the English name for Firestore filtering.
 * Cache has a TTL so updated station files (e.g. CDN) are picked up after expiry.
 */

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export type CityOptionFull = {
  value: string;
  label: string;
  labelEn: string;
  labelAr: string;
};

let cached: CityOptionFull[] | null = null;
let cachedAt: number = 0;

async function loadStations(): Promise<CityOptionFull[]> {
  const now = Date.now();
  if (cached && now - cachedAt < CACHE_TTL_MS) return cached;

  const [enRes, arRes] = await Promise.all([
    fetch('/stations-en.json'),
    fetch('/stations-ar.json'),
  ]);
  if (!enRes.ok || !arRes.ok) {
    throw new Error('Failed to load station lists');
  }
  const en: string[] = await enRes.json();
  const ar: string[] = await arRes.json();
  if (!Array.isArray(en) || !Array.isArray(ar) || en.length !== ar.length) {
    throw new Error('Invalid station list format');
  }
  cached = en.map((labelEn, i) => ({
    value: labelEn,
    label: labelEn,
    labelEn,
    labelAr: ar[i] ?? labelEn,
  }));
  cachedAt = Date.now();
  return cached;
}

/**
 * Returns city options with value = canonical (English) and label = display for the given language.
 * Loads both station files once and caches.
 */
export async function getCityOptions(
  language: 'en' | 'ar-EG'
): Promise<CityOptionFull[]> {
  const list = await loadStations();
  const isAr = language === 'ar-EG';
  return list.map((opt) => ({
    ...opt,
    label: isAr ? opt.labelAr : opt.labelEn,
  }));
}

/**
 * Filters city option by input; matches against both English and Arabic labels (case-insensitive).
 */
export function filterCityOption(
  inputValue: string,
  option: { labelEn: string; labelAr: string }
): boolean {
  const q = inputValue.trim().toLowerCase();
  if (!q) return true;
  const en = option.labelEn?.toLowerCase() ?? '';
  const ar = option.labelAr?.toLowerCase() ?? '';
  return en.includes(q) || ar.includes(q);
}
