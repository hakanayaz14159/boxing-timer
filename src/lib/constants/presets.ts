import type { PresetId, WorkoutConfig } from '$lib/types/timer';

export interface Preset {
	id: PresetId;
	config: WorkoutConfig;
}

export const BOXING_PRESETS: readonly Preset[] = [
	{
		id: 'seniors',
		config: {
			exerciseSeconds: 3 * 60,
			restSeconds: 60,
			rounds: 3
		}
	},
	{
		id: 'juniors',
		config: {
			exerciseSeconds: 2 * 60,
			restSeconds: 60,
			rounds: 3
		}
	},
	{
		id: 'upper-mini',
		config: {
			exerciseSeconds: 90,
			restSeconds: 60,
			rounds: 3
		}
	},
	{
		id: 'lower-mini',
		config: {
			exerciseSeconds: 60,
			restSeconds: 60,
			rounds: 3
		}
	},
	{
		id: 'group-class',
		config: {
			exerciseSeconds: 3 * 60,
			restSeconds: 60,
			rounds: 15
		}
	},
	{
		id: 'private-lesson',
		config: {
			exerciseSeconds: 2 * 60,
			restSeconds: 60,
			rounds: 12
		}
	}
];
