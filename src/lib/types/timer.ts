export type TimerPhase = 'config' | 'ready' | 'countdown' | 'exercise' | 'rest' | 'finished';

export interface WorkoutConfig {
	exerciseSeconds: number;
	restSeconds: number;
	rounds: number;
}

export interface Config extends WorkoutConfig {}

export interface TimerState {
	phase: TimerPhase;
	currentRound: number;
	remainingSeconds: number;
	isPaused: boolean;
}
