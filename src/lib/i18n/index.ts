import { browser } from '$app/environment';
import { writable, get } from 'svelte/store';
import en from './translations/en.json';
import tr from './translations/tr.json';

export type Locale = 'en' | 'tr';

const STORAGE_KEY = 'box-timer-locale';

const translations: Record<Locale, Record<string, unknown>> = {
	en: en as Record<string, unknown>,
	tr: tr as Record<string, unknown>
};

function loadFromStorage(): Locale {
	if (!browser) return 'en';
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored === 'en' || stored === 'tr') return stored;
	} catch {
		/* noop */
	}
	return 'en';
}

function saveToStorage(locale: Locale): void {
	if (!browser) return;
	try {
		localStorage.setItem(STORAGE_KEY, locale);
	} catch {
		/* noop */
	}
}

function getNested(obj: Record<string, unknown>, path: string): string | undefined {
	const keys = path.split('.');
	let current: unknown = obj;
	for (const key of keys) {
		if (current === null || typeof current !== 'object') return undefined;
		current = (current as Record<string, unknown>)[key];
	}
	return typeof current === 'string' ? current : undefined;
}

function interpolate(template: string, params: Record<string, string | number>): string {
	return template.replace(/\{(\w+)\}/g, (_, key) => {
		const val = params[key];
		return val !== undefined ? String(val) : `{${key}}`;
	});
}

export const locale = writable<Locale>(loadFromStorage());

if (browser) {
	locale.subscribe((value) => {
		saveToStorage(value);
	});
}

export const localeStore = {
	get locale() {
		return get(locale);
	},
	set locale(value: Locale) {
		locale.set(value);
	},
	subscribe: locale.subscribe,
	t(key: string, params?: Record<string, string | number>): string {
		const messages = translations[get(locale)];
		const template = getNested(messages, key);
		if (template === undefined) return key;
		return params ? interpolate(template, params) : template;
	}
};
