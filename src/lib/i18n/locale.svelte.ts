import { browser } from '$app/environment';
import en from './translations/en.json';
import tr from './translations/tr.json';

export type Locale = 'en' | 'tr';

const STORAGE_KEY = 'box-timer-locale';

type Messages = typeof en;

/** Dot-separated paths to every string leaf in the translation files. */
type Leaves<T> = {
	[K in keyof T & string]: T[K] extends string ? K : `${K}.${Leaves<T[K]>}`;
}[keyof T & string];

export type TranslationKey = Leaves<Messages>;
export type TranslationParams = Record<string, string | number>;

/** Typing every locale against `en` makes a missing translation a compile error. */
const TRANSLATIONS: Record<Locale, Messages> = { en, tr };

function isLocale(value: unknown): value is Locale {
	return value === 'en' || value === 'tr';
}

function loadFromStorage(): Locale {
	if (!browser) return 'en';
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (isLocale(stored)) return stored;
	} catch {
		/* Private-mode failures fall through to the default. */
	}
	return 'en';
}

function saveToStorage(locale: Locale): void {
	if (!browser) return;
	try {
		localStorage.setItem(STORAGE_KEY, locale);
	} catch {
		/* Persisting a preference is best-effort. */
	}
}

function resolve(messages: Messages, key: string): string | undefined {
	let current: unknown = messages;
	for (const part of key.split('.')) {
		if (current === null || typeof current !== 'object') return undefined;
		current = (current as Record<string, unknown>)[part];
	}
	return typeof current === 'string' ? current : undefined;
}

function interpolate(template: string, params: TranslationParams): string {
	return template.replace(/\{(\w+)\}/g, (_, name: string) => {
		const value = params[name];
		return value === undefined ? `{${name}}` : String(value);
	});
}

let current = $state<Locale>(loadFromStorage());

/**
 * Reads the locale signal on every call, so any template expression using `t`
 * re-evaluates when the language changes. No remount or manual invalidation.
 */
export function t(key: TranslationKey, params?: TranslationParams): string {
	const template = resolve(TRANSLATIONS[current], key);
	if (template === undefined) return key;
	return params ? interpolate(template, params) : template;
}

export const localeStore = {
	get value(): Locale {
		return current;
	},
	set(next: Locale) {
		current = next;
		saveToStorage(next);
	}
};
