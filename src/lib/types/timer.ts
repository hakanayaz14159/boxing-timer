export type TimerPhase = 'config' | 'countdown' | 'exercise' | 'rest' | 'finished';

export interface WorkoutConfig {
	exerciseSeconds: number;
	restSeconds: number;
	rounds: number;
}

export type Config = WorkoutConfig;

export interface TimerState {
	phase: TimerPhase;
	currentRound: number;
	remainingSeconds: number;
	isPaused: boolean;
}
