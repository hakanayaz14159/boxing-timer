/**
 * Formats seconds as "MM:SS" (e.g. 90 → "01:30", 0 → "00:00")
 */
export function formatSeconds(seconds: number): string {
	const m = Math.floor(seconds / 60);
	const s = Math.floor(seconds % 60);
	return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
