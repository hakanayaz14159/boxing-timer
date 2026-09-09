import { browser } from '$app/environment';
import type { WorkoutConfig } from '$lib/types/timer';

const STORAGE_KEY = 'box-timer-config';

const DEFAULTS: WorkoutConfig = {
	exerciseSeconds: 3 * 60,
	restSeconds: 1 * 60,
	rounds: 3
};

const STEP_SECONDS = 15;

const MAX_TIME_SECONDS = 59 * 60 + 45;

const LIMITS = {
	exerciseSeconds: { min: STEP_SECONDS, max: MAX_TIME_SECONDS },
	restSeconds: { min: 0, max: MAX_TIME_SECONDS },
	rounds: { min: 1, max: 99 }
} as const;

export { STEP_SECONDS, LIMITS };

function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

function safeNumber(value: unknown, fallback: number): number {
	const n = Number(value);
	return Number.isFinite(n) ? n : fallback;
}

function snap(seconds: number): number {
	return Math.round(seconds / STEP_SECONDS) * STEP_SECONDS;
}

function normalizeConfig(raw: Partial<WorkoutConfig>): WorkoutConfig {
	// A zero exercise time yields a workout with no rounds, so treat it as absent.
	// This also migrates configs saved by earlier versions, whose default was 0.
	const exercise = safeNumber(raw.exerciseSeconds, DEFAULTS.exerciseSeconds);

	return {
		exerciseSeconds: clamp(
			snap(exercise > 0 ? exercise : DEFAULTS.exerciseSeconds),
			LIMITS.exerciseSeconds.min,
			LIMITS.exerciseSeconds.max
		),
		restSeconds: clamp(
			snap(safeNumber(raw.restSeconds, DEFAULTS.restSeconds)),
			LIMITS.restSeconds.min,
			LIMITS.restSeconds.max
		),
		rounds: clamp(
			Math.round(safeNumber(raw.rounds, DEFAULTS.rounds)),
			LIMITS.rounds.min,
			LIMITS.rounds.max
		)
	};
}

function loadFromStorage(): WorkoutConfig {
	if (!browser) return { ...DEFAULTS };
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return { ...DEFAULTS };
		const parsed: unknown = JSON.parse(raw);
		if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
			return { ...DEFAULTS };
		}
		return normalizeConfig(parsed as Partial<WorkoutConfig>);
	} catch {
		return { ...DEFAULTS };
	}
}

function saveToStorage(config: WorkoutConfig): void {
	if (!browser) return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
	} catch {
		/* Private-mode or quota failures must not break the timer. */
	}
}

function createConfigStore() {
	let config = $state(loadFromStorage());

	return {
		get value() {
			return config;
		},
		set(value: WorkoutConfig) {
			config = normalizeConfig(value);
			saveToStorage(config);
		},
		update(partial: Partial<WorkoutConfig>) {
			this.set({ ...config, ...partial });
		}
	};
}

export const configStore = createConfigStore();
