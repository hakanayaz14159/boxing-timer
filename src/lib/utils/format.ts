/**
 * Formats seconds as "M:SS" (e.g. 90 → "1:30", 0 → "0:00")
 */
export function formatSeconds(seconds: number): string {
	const m = Math.floor(seconds / 60);
	const s = Math.floor(seconds % 60);
	return `${m}:${s.toString().padStart(2, '0')}`;
}
