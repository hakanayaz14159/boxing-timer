import type { TimerPhase, WorkoutConfig } from '$lib/types/timer';
import { configStore } from './config.svelte';
import type { BellSignal } from '$lib/services/sound';
import { playAlarm, playTenSecondWarning, preloadBell } from '$lib/services/sound';

const COUNTDOWN_STEPS: (number | 'Start')[] = [3, 2, 1, 'Start'];

function createTimerStore() {
	let phase = $state<TimerPhase>('config');
	let currentRound = $state(0);
	let remainingSeconds = $state(0);
	let isPaused = $state(false);
	let countdownStepIndex = $state(0);

	let activeConfig: WorkoutConfig | null = null;

	function getConfig(): WorkoutConfig {
		return activeConfig ?? configStore.value;
	}

	const TICK_MS = 1000;
	const COUNTDOWN_TICK_MS = 1000;
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

		// Ring 1 second before transition (check before decrement for 1-second phases)
		if (remainingSeconds === 1 && (phase === 'exercise' || phase === 'rest')) {
			const signal: BellSignal =
				phase === 'exercise' && currentRound >= getConfig().rounds
					? 'workout_complete'
					: 'round_end';
			playAlarm(signal);
		}

		remainingSeconds--;
		if (remainingSeconds >= 1 && remainingSeconds <= 10 && (phase === 'exercise' || phase === 'rest')) {
			playTenSecondWarning();
		}
		if (remainingSeconds > 0) {
			scheduleTick(phase === 'countdown');
			return;
		}

		clearTimer();

		if (phase === 'countdown') {
			if (countdownStepIndex < COUNTDOWN_STEPS.length - 1) {
				countdownStepIndex++;
				remainingSeconds = 1;
				if (countdownStepIndex === COUNTDOWN_STEPS.length - 1) {
					playAlarm('round_end');
				}
				scheduleTick(true);
			} else {
				phase = 'exercise';
				currentRound = 1;
				remainingSeconds = getConfig().exerciseSeconds;
				while (remainingSeconds <= 0) {
					if (currentRound >= getConfig().rounds) {
						phase = 'finished';
						return;
					}
					phase = 'rest';
					remainingSeconds = getConfig().restSeconds;
					if (remainingSeconds > 0) break;
					currentRound++;
					phase = 'exercise';
					remainingSeconds = getConfig().exerciseSeconds;
				}
				if (remainingSeconds > 0) scheduleTick();
			}
			return;
		}

		if (phase === 'exercise') {
			if (currentRound >= getConfig().rounds) {
				phase = 'finished';
				return;
			}
			phase = 'rest';
			remainingSeconds = getConfig().restSeconds;
			while (remainingSeconds <= 0) {
				currentRound++;
				phase = 'exercise';
				remainingSeconds = getConfig().exerciseSeconds;
				if (currentRound >= getConfig().rounds) {
					phase = 'finished';
					return;
				}
				if (remainingSeconds > 0) break;
				phase = 'rest';
				remainingSeconds = getConfig().restSeconds;
			}
			if (remainingSeconds > 0) scheduleTick();
			return;
		}

		if (phase === 'rest') {
			currentRound++;
			phase = 'exercise';
			remainingSeconds = getConfig().exerciseSeconds;
			while (remainingSeconds <= 0) {
				if (currentRound >= getConfig().rounds) {
					phase = 'finished';
					return;
				}
				phase = 'rest';
				remainingSeconds = getConfig().restSeconds;
				if (remainingSeconds > 0) break;
				currentRound++;
				phase = 'exercise';
				remainingSeconds = getConfig().exerciseSeconds;
			}
			if (remainingSeconds > 0) scheduleTick();
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
		get activeConfig(): WorkoutConfig {
			return getConfig();
		},
		start(config?: WorkoutConfig) {
			preloadBell();
			clearTimer();
			activeConfig = config ?? null;
			phase = 'countdown';
			currentRound = 0;
			countdownStepIndex = 0;
			remainingSeconds = 1;
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
			if (!isPaused) return;
			isPaused = false;
			clearTimer();
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
			activeConfig = null;
			phase = 'config';
			currentRound = 0;
			remainingSeconds = 0;
			isPaused = false;
			countdownStepIndex = 0;
		}
	};
}

export const timerStore = createTimerStore();
