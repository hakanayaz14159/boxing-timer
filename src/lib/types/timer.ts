export type TimerPhase = 'config' | 'countdown' | 'exercise' | 'rest' | 'finished';

/** Phases that occupy time on the workout timeline. */
export type ActivePhase = Extract<TimerPhase, 'countdown' | 'exercise' | 'rest'>;

export interface WorkoutConfig {
	exerciseSeconds: number;
	restSeconds: number;
	rounds: number;
}

export type PresetId = 'amateur' | 'pro-6' | 'pro-8' | 'pro-12' | 'womens-pro' | 'fitness';
