/// <reference types="vite/client" />

declare module 'virtual:pwa-info' {
	export interface PwaInfo {
		webManifest?: { linkTag: string };
	}
	export const pwaInfo: PwaInfo | undefined;
}

declare module 'virtual:pwa-register' {
	export function registerSW(options?: { immediate?: boolean }): void;
}
