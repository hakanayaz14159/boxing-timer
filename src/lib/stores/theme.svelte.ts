import { browser } from '$app/environment';
import { writable, derived, get } from 'svelte/store';

export type ThemePreference = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'box-timer-theme';

const LIGHT_COLORS = {
	bg: '#f8fafc',
	bgInput: '#ffffff',
	bgHover: '#f1f5f9',
	text: '#0f172a',
	textMuted: '#64748b',
	primary: '#dc2626',
	secondary: '#475569',
	border: '#e2e8f0',
	bgExercise: '#fef2f2',
	bgRest: '#f0f9ff'
} as const;

const DARK_COLORS = {
	bg: '#0f172a',
	bgInput: '#1e293b',
	bgHover: '#334155',
	text: '#f8fafc',
	textMuted: '#94a3b8',
	primary: '#ef4444',
	secondary: '#64748b',
	border: '#334155',
	bgExercise: '#451a1a',
	bgRest: '#0c4a6e'
} as const;

function loadFromStorage(): ThemePreference {
	if (!browser) return 'system';
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored === 'light' || stored === 'dark' || stored === 'system') {
			return stored;
		}
	} catch {
		/* noop */
	}
	return 'system';
}

function saveToStorage(preference: ThemePreference): void {
	if (!browser) return;
	try {
		localStorage.setItem(STORAGE_KEY, preference);
	} catch {
		/* noop */
	}
}

function getSystemPrefersDark(): boolean {
	if (!browser) return false;
	return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

const preference = writable<ThemePreference>(loadFromStorage());
const systemDark = writable(getSystemPrefersDark());

if (browser) {
	preference.subscribe((value) => {
		saveToStorage(value);
	});

	const mq = window.matchMedia('(prefers-color-scheme: dark)');
	mq.addEventListener('change', () => {
		systemDark.set(mq.matches);
	});
}

export const effectiveTheme = derived(
	[preference, systemDark],
	([$preference, $systemDark]): 'light' | 'dark' => {
		if ($preference === 'system') return $systemDark ? 'dark' : 'light';
		return $preference;
	}
);

export const themeColor = derived(effectiveTheme, ($effective) =>
	$effective === 'light' ? LIGHT_COLORS.bg : DARK_COLORS.bg
);

export const themeStore = {
	get preference() {
		return get(preference);
	},
	set preference(value: ThemePreference) {
		preference.set(value);
	},
	get effectiveTheme() {
		return get(effectiveTheme);
	},
	get themeColor() {
		return get(themeColor);
	},
	subscribe: preference.subscribe
};
