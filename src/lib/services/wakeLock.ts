type NavigatorWithWakeLock = Navigator & {
	wakeLock?: { request: (type: 'screen') => Promise<WakeLockSentinel> };
};

let wakeLockSentinel: WakeLockSentinel | null = null;
let shouldHoldLock = false;
let visibilityBound = false;

async function requestWakeLock(): Promise<void> {
	if (typeof document === 'undefined' || typeof navigator === 'undefined') return;
	const nav = navigator as NavigatorWithWakeLock;
	if (!nav.wakeLock) return;
	if (document.hidden) return;
	try {
		wakeLockSentinel = await nav.wakeLock.request('screen');
	} catch {
		/* Denied or unsupported in this context — the timer still runs. */
	}
}

async function releaseWakeLock(): Promise<void> {
	if (!wakeLockSentinel) return;
	try {
		await wakeLockSentinel.release();
	} catch {
		/* Already released. */
	}
	wakeLockSentinel = null;
}

function bindVisibility(): void {
	if (visibilityBound || typeof document === 'undefined') return;
	visibilityBound = true;
	document.addEventListener('visibilitychange', () => {
		if (document.hidden) {
			void releaseWakeLock();
		} else if (shouldHoldLock) {
			void requestWakeLock();
		}
	});
}

export async function setWakeLock(hold: boolean): Promise<void> {
	if (typeof document === 'undefined' || typeof navigator === 'undefined') return;
	bindVisibility();
	shouldHoldLock = hold;
	if (hold && !document.hidden) {
		await requestWakeLock();
	} else if (!hold) {
		await releaseWakeLock();
	}
}
