export type TimerPhase = 'config' | 'ready' | 'countdown' | 'exercise' | 'rest' | 'finished';

export interface Config {
	exerciseSeconds: number;
	restSeconds: number;
	rounds: number;
}

export interface TimerState {
	phase: TimerPhase;
	currentRound: number;
	remainingSeconds: number;
	isPaused: boolean;
}
