import type { PresetId, WorkoutConfig } from '$lib/types/timer';

export interface Preset {
	id: PresetId;
	config: WorkoutConfig;
}

export const BOXING_PRESETS: readonly Preset[] = [
	{
		id: 'amateur',
		config: {
			exerciseSeconds: 3 * 60,
			restSeconds: 1 * 60,
			rounds: 3
		}
	},
	{
		id: 'pro-6',
		config: {
			exerciseSeconds: 3 * 60,
			restSeconds: 1 * 60,
			rounds: 6
		}
	},
	{
		id: 'pro-8',
		config: {
			exerciseSeconds: 3 * 60,
			restSeconds: 1 * 60,
			rounds: 8
		}
	},
	{
		id: 'pro-12',
		config: {
			exerciseSeconds: 3 * 60,
			restSeconds: 1 * 60,
			rounds: 12
		}
	},
	{
		id: 'womens-pro',
		config: {
			exerciseSeconds: 2 * 60,
			restSeconds: 1 * 60,
			rounds: 10
		}
	},
	{
		id: 'fitness',
		config: {
			exerciseSeconds: 2 * 60,
			restSeconds: 30,
			rounds: 5
		}
	}
];
