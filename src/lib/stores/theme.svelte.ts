import { browser } from '$app/environment';

export type ThemePreference = 'light' | 'dark' | 'system';
type EffectiveTheme = 'light' | 'dark';

const STORAGE_KEY = 'box-timer-theme';

/**
 * The only colours that must exist in JS: the browser/PWA chrome colour cannot
 * read a CSS custom property. Everything else lives in app.css.
 */
const CHROME_COLORS: Record<EffectiveTheme, string> = {
	light: '#f8fafc',
	dark: '#0f172a'
};

export { CHROME_COLORS };

function isPreference(value: unknown): value is ThemePreference {
	return value === 'light' || value === 'dark' || value === 'system';
}

function loadFromStorage(): ThemePreference {
	if (!browser) return 'system';
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (isPreference(stored)) return stored;
	} catch {
		/* Private-mode failures fall through to the default. */
	}
	return 'system';
}

function saveToStorage(preference: ThemePreference): void {
	if (!browser) return;
	try {
		localStorage.setItem(STORAGE_KEY, preference);
	} catch {
		/* Persisting a preference is best-effort. */
	}
}

let preference = $state<ThemePreference>(loadFromStorage());
let systemDark = $state(browser && window.matchMedia('(prefers-color-scheme: dark)').matches);

if (browser) {
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
		systemDark = event.matches;
	});
}

function effectiveOf(value: ThemePreference, dark: boolean): EffectiveTheme {
	if (value === 'system') return dark ? 'dark' : 'light';
	return value;
}

export const themeStore = {
	get preference(): ThemePreference {
		return preference;
	},
	set preference(value: ThemePreference) {
		preference = value;
		saveToStorage(value);
	},
	get chromeColor(): string {
		return CHROME_COLORS[effectiveOf(preference, systemDark)];
	}
};
