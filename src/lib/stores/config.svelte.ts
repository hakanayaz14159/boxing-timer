import { browser } from '$app/environment';
import type { Config } from '$lib/types/timer';

const STORAGE_KEY = 'box-timer-config';

const DEFAULTS: Config = {
	exerciseSeconds: 3 * 60, // 3 min
	restSeconds: 1 * 60, // 1 min
	rounds: 3
};

const STEP_SECONDS = 15;

const LIMITS = {
	exerciseSeconds: { min: 30, max: 60 * 60 }, // 30s–60 min
	restSeconds: { min: 0, max: 10 * 60 }, // 0–10 min
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

/** Normalizes partial or full config into a valid Config with clamped values. */
function normalizeConfig(raw: Partial<Config>): Config {
	return {
		exerciseSeconds: clamp(
			safeNumber(raw.exerciseSeconds, DEFAULTS.exerciseSeconds),
			LIMITS.exerciseSeconds.min,
			LIMITS.exerciseSeconds.max
		),
		restSeconds: clamp(
			safeNumber(raw.restSeconds, DEFAULTS.restSeconds),
			LIMITS.restSeconds.min,
			LIMITS.restSeconds.max
		),
		rounds: clamp(safeNumber(raw.rounds, DEFAULTS.rounds), LIMITS.rounds.min, LIMITS.rounds.max)
	};
}

function loadFromStorage(): Config {
	if (!browser) return { ...DEFAULTS };
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return { ...DEFAULTS };
		const parsed: unknown = JSON.parse(raw);
		if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
			return { ...DEFAULTS };
		}
		return normalizeConfig(parsed as Partial<Config>);
	} catch {
		return { ...DEFAULTS };
	}
}

function saveToStorage(config: Config): void {
	if (!browser) return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
	} catch {
		// ignore
	}
}

function createConfigStore() {
	let config = $state(loadFromStorage());

	return {
		get value() {
			return config;
		},
		set(value: Config) {
			config = normalizeConfig(value);
			saveToStorage(config);
		},
		update(partial: Partial<Config>) {
			this.set({ ...config, ...partial });
		}
	};
}

export const configStore = createConfigStore();
