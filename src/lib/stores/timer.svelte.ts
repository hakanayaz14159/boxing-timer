import type { TimerPhase } from '$lib/types/timer';
import { configStore } from './config.svelte';
import { playBeep } from '$lib/services/sound';

const COUNTDOWN_STEPS: (number | 'Start')[] = [3, 2, 1, 'Start'];

function createTimerStore() {
	let phase = $state<TimerPhase>('config');
	let currentRound = $state(0);
	let remainingSeconds = $state(0);
	let isPaused = $state(false);
	let countdownStepIndex = $state(0);

	const TICK_MS = 1000;
	const COUNTDOWN_TICK_MS = 1000; // 3-2-1 countdown: 1s per number
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	function clearTimer() {
		if (timeoutId !== null) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}
	}

	function scheduleTick(isCountdown = false) {
		const delay = isCountdown ? COUNTDOWN_TICK_MS : TICK_MS;
		timeoutId = setTimeout(tick, delay);
	}

	function tick() {
		if (remainingSeconds <= 0) return;

		remainingSeconds--;
		if (remainingSeconds > 0) {
			// Still counting down, schedule next tick
			scheduleTick(phase === 'countdown');
			return;
		}

		// Phase transition when countdown reaches 0
		clearTimer();

		if (phase === 'countdown') {
			if (countdownStepIndex < COUNTDOWN_STEPS.length - 1) {
				countdownStepIndex++;
				remainingSeconds = 1; // Each step displays for 1 second
				scheduleTick(true);
			} else {
				phase = 'exercise';
				currentRound = 1;
				remainingSeconds = configStore.value.exerciseSeconds;
				scheduleTick();
			}
			return;
		}

		if (phase === 'exercise') {
			playBeep();
			if (currentRound >= configStore.value.rounds) {
				phase = 'finished';
				return;
			}
			phase = 'rest';
			remainingSeconds = configStore.value.restSeconds;
			scheduleTick();
			return;
		}

		if (phase === 'rest') {
			currentRound++;
			phase = 'exercise';
			remainingSeconds = configStore.value.exerciseSeconds;
			scheduleTick();
		}
	}

	return {
		get phase() {
			return phase;
		},
		get currentRound() {
			return currentRound;
		},
		get remainingSeconds() {
			return remainingSeconds;
		},
		get isPaused() {
			return isPaused;
		},
		get countdownStepIndex() {
			return countdownStepIndex;
		},
		get countdownDisplay(): number | 'Start' {
			return COUNTDOWN_STEPS[countdownStepIndex];
		},
		start() {
			clearTimer();
			phase = 'countdown';
			currentRound = 0;
			countdownStepIndex = 0;
			remainingSeconds = 1; // Each countdown step (3, 2, 1, Start) displays for 1 second
			isPaused = false;
			scheduleTick(true);
		},
		pause() {
			if (phase !== 'exercise' && phase !== 'rest') return;
			isPaused = true;
			clearTimer();
		},
		resume() {
			if (phase !== 'exercise' && phase !== 'rest') return;
			isPaused = false;
			scheduleTick();
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
			phase = 'config';
			currentRound = 0;
			remainingSeconds = 0;
			isPaused = false;
			countdownStepIndex = 0;
		}
	};
}

export const timerStore = createTimerStore();
