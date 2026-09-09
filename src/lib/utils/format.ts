import type { WorkoutConfig } from '$lib/types/timer';

/** Compact `M:SS`, for inline labels. */
export function formatDuration(seconds: number): string {
	const { minutes, secs } = splitClock(seconds);
	return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/** `M:SS` or `H:MM:SS`, for whole-workout totals. */
export function formatTotal(seconds: number): string {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = Math.floor(seconds % 60);
	if (hours === 0) return `${minutes}:${secs.toString().padStart(2, '0')}`;
	return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/** Split into the two halves the countdown renders on separate lines. */
export function splitClock(seconds: number): { minutes: number; secs: number } {
	const safe = Math.max(0, Math.floor(seconds));
	return { minutes: Math.floor(safe / 60), secs: safe % 60 };
}

export function totalWorkoutSeconds(config: WorkoutConfig): number {
	return (
		config.exerciseSeconds * config.rounds + config.restSeconds * Math.max(0, config.rounds - 1)
	);
}
