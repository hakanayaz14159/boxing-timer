export type TimerPhase = 'config' | 'countdown' | 'exercise' | 'rest' | 'finished';

/** Phases that occupy time on the workout timeline. */
export type ActivePhase = Extract<TimerPhase, 'countdown' | 'exercise' | 'rest'>;

export interface WorkoutConfig {
	exerciseSeconds: number;
	restSeconds: number;
	rounds: number;
}

export type PresetId =
	| 'seniors'
	| 'juniors'
	| 'upper-mini'
	| 'lower-mini'
	| 'group-class'
	| 'private-lesson';
