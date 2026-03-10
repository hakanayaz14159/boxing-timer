type NavigatorWithWakeLock = Navigator & {
	wakeLock?: { request: (type: 'screen') => Promise<WakeLockSentinel> };
};

let wakeLockSentinel: WakeLockSentinel | null = null;
let shouldHoldLock = false;

export async function requestWakeLock(): Promise<boolean> {
	if (typeof document === 'undefined' || typeof navigator === 'undefined') return false;
	const nav = navigator as NavigatorWithWakeLock;
	if (!nav.wakeLock) return false;
	if (document.hidden) return false; // Can only request when visible
	try {
		wakeLockSentinel = await nav.wakeLock.request('screen');
		return true;
	} catch {
		return false;
	}
}

export async function releaseWakeLock(): Promise<void> {
	if (wakeLockSentinel) {
		try {
			await wakeLockSentinel.release();
		} catch {
			// Ignore release errors
		}
		wakeLockSentinel = null;
	}
}

export function isWakeLockSupported(): boolean {
	return typeof navigator !== 'undefined' && 'wakeLock' in navigator;
}

/** Set whether the wake lock should be held. Handles request/release and visibility changes. */
export async function setWakeLock(hold: boolean): Promise<void> {
	if (typeof document === 'undefined' || typeof navigator === 'undefined') return;
	shouldHoldLock = hold;
	if (hold && !document.hidden) {
		await requestWakeLock();
	} else if (!hold) {
		await releaseWakeLock();
	}
}

function initVisibilityHandler(): void {
	document.addEventListener('visibilitychange', async () => {
		if (document.hidden) {
			await releaseWakeLock(); // Released automatically, but clear our ref
			wakeLockSentinel = null;
		} else if (shouldHoldLock) {
			await requestWakeLock(); // Re-acquire when tab visible again
		}
	});
}

let visibilityHandlerInitialized = false;

export function ensureVisibilityHandler(): void {
	if (typeof document === 'undefined' || visibilityHandlerInitialized) return;
	visibilityHandlerInitialized = true;
	initVisibilityHandler();
}
