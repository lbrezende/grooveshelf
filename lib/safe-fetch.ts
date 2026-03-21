/** Fetch that returns [] on error or non-array responses — prevents crashes when DB is unavailable */
export async function safeFetchArray<T = unknown>(url: string): Promise<T[]> {
  try {
    const r = await fetch(url);
    if (!r.ok) return [];
    const data = await r.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
