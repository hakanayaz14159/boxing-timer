import type { ActivePhase, TimerPhase, WorkoutConfig } from '$lib/types/timer';
import { configStore } from './config.svelte';
import { playBell, playWarningBeep, preloadBell } from '$lib/services/sound';

const COUNTDOWN_STEPS = [3, 2, 1, 'go'] as const;
type CountdownStep = (typeof COUNTDOWN_STEPS)[number];

const COUNTDOWN_STEP_SECONDS = 1;

/** Seconds remaining during which the warning beep fires, per phase. */
const WARNING_WINDOWS: Record<Exclude<ActivePhase, 'countdown'>, { min: number; max: number }> = {
	exercise: { min: 7, max: 10 },
	rest: { min: 1, max: 10 }
};

/** Bells for boundaries missed while the tab was hidden are dropped, not replayed. */
const BELL_GRACE_MS = 1500;

type Segment =
	| { phase: 'countdown'; step: CountdownStep; seconds: number }
	| { phase: 'exercise'; round: number; seconds: number }
	| { phase: 'rest'; round: number; seconds: number };

/**
 * Expands a config into the full ordered list of segments. Zero-length segments
 * are filtered out here, which is what makes a rest of 0 behave correctly
 * instead of consuming a round.
 */
function buildTimeline(config: WorkoutConfig): Segment[] {
	const timeline: Segment[] = COUNTDOWN_STEPS.map((step) => ({
		phase: 'countdown',
		step,
		seconds: COUNTDOWN_STEP_SECONDS
	}));

	for (let round = 1; round <= config.rounds; round++) {
		timeline.push({ phase: 'exercise', round, seconds: config.exerciseSeconds });
		if (round < config.rounds) {
			timeline.push({ phase: 'rest', round, seconds: config.restSeconds });
		}
	}

	return timeline.filter((segment) => segment.seconds > 0);
}

/** Round starts and round ends ring; the 3-2-1 lead-in does not. */
function isBellBoundary(segment: Segment): boolean {
	return segment.phase !== 'countdown' || segment.step === 'go';
}

function createTimerStore() {
	let phase = $state<TimerPhase>('config');
	let currentRound = $state(0);
	let totalRounds = $state(0);
	let remainingSeconds = $state(0);
	let segmentSeconds = $state(0);
	let isPaused = $state(false);
	let countdownStep = $state<CountdownStep>(COUNTDOWN_STEPS[0]);

	let timeline: Segment[] = [];
	let cursor = 0;
	let segmentEndsAt = 0;
	let pausedRemainingMs = 0;
	let timeoutId: ReturnType<typeof setTimeout> | null = null;
	let visibilityBound = false;

	function clearTimer(): void {
		if (timeoutId !== null) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}
	}

	function enterSegment(startedAt: number): void {
		const segment = timeline[cursor];
		phase = segment.phase;
		segmentSeconds = segment.seconds;
		remainingSeconds = segment.seconds;
		segmentEndsAt = startedAt + segment.seconds * 1000;

		switch (segment.phase) {
			case 'countdown':
				countdownStep = segment.step;
				break;
			case 'exercise':
			case 'rest':
				currentRound = segment.round;
				break;
			default: {
				const unhandled: never = segment;
				throw new Error(`Unhandled segment: ${JSON.stringify(unhandled)}`);
			}
		}
	}

	function finish(): void {
		clearTimer();
		phase = 'finished';
		remainingSeconds = 0;
		segmentSeconds = 0;
	}

	function warnIfInWindow(seconds: number): void {
		if (phase !== 'exercise' && phase !== 'rest') return;
		const { min, max } = WARNING_WINDOWS[phase];
		if (seconds >= min && seconds <= max) {
			void playWarningBeep();
		}
	}

	/** Wakes exactly when the displayed second changes, so ticks cannot accumulate drift. */
	function schedule(): void {
		const remainingMs = Math.max(0, segmentEndsAt - Date.now());
		const delay = remainingMs === 0 ? 0 : remainingMs % 1000 || 1000;
		timeoutId = setTimeout(sync, delay);
	}

	/**
	 * Reconciles state against the wall clock. Advances through however many
	 * segments have elapsed, so a throttled or suspended tab catches up on return
	 * instead of resuming a stale countdown.
	 */
	function sync(): void {
		clearTimer();

		while (Date.now() >= segmentEndsAt) {
			const ended = timeline[cursor];
			const endedAt = segmentEndsAt;
			const isFinalSegment = cursor === timeline.length - 1;

			if (isBellBoundary(ended) && Date.now() - endedAt <= BELL_GRACE_MS) {
				void playBell(isFinalSegment ? 'workout_complete' : 'round');
			}

			if (isFinalSegment) {
				finish();
				return;
			}

			cursor++;
			enterSegment(endedAt);
		}

		const seconds = Math.ceil((segmentEndsAt - Date.now()) / 1000);
		if (seconds !== remainingSeconds) {
			remainingSeconds = seconds;
			warnIfInWindow(seconds);
		}

		schedule();
	}

	function bindVisibility(): void {
		if (visibilityBound || typeof document === 'undefined') return;
		visibilityBound = true;
		document.addEventListener('visibilitychange', () => {
			if (document.hidden || isPaused) return;
			if (phase === 'countdown' || phase === 'exercise' || phase === 'rest') {
				sync();
			}
		});
	}

	return {
		get phase() {
			return phase;
		},
		get currentRound() {
			return currentRound;
		},
		get totalRounds() {
			return totalRounds;
		},
		get remainingSeconds() {
			return remainingSeconds;
		},
		get isPaused() {
			return isPaused;
		},
		get countdownStep() {
			return countdownStep;
		},
		/** Fraction of the current segment already elapsed, 0 to 1. */
		get segmentProgress() {
			if (segmentSeconds <= 0) return 0;
			return (segmentSeconds - remainingSeconds) / segmentSeconds;
		},
		start() {
			const workout = configStore.value;
			// Called from a click, which is the only moment mobile browsers let us
			// unlock the AudioContext.
			void preloadBell();
			bindVisibility();
			clearTimer();

			timeline = buildTimeline(workout);
			totalRounds = workout.rounds;
			cursor = 0;
			currentRound = 0;
			isPaused = false;
			enterSegment(Date.now());
			sync();
		},
		pause() {
			if (phase !== 'exercise' && phase !== 'rest') return;
			if (isPaused) return;
			isPaused = true;
			pausedRemainingMs = Math.max(0, segmentEndsAt - Date.now());
			clearTimer();
		},
		resume() {
			if (phase !== 'exercise' && phase !== 'rest') return;
			if (!isPaused) return;
			isPaused = false;
			segmentEndsAt = Date.now() + pausedRemainingMs;
			sync();
		},
		togglePause() {
			if (isPaused) {
				this.resume();
			} else {
				this.pause();
			}
		},
		reset() {
			clearTimer();
			timeline = [];
			cursor = 0;
			segmentEndsAt = 0;
			pausedRemainingMs = 0;
			phase = 'config';
			currentRound = 0;
			totalRounds = 0;
			remainingSeconds = 0;
			segmentSeconds = 0;
			isPaused = false;
			countdownStep = COUNTDOWN_STEPS[0];
		}
	};
}

export const timerStore = createTimerStore();
