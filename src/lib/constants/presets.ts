import type { WorkoutConfig } from '$lib/types/timer';

export interface Preset {
	id: string;
	label: string;
	config: WorkoutConfig;
}

/**
 * Common boxing timer presets based on official rules.
 * - Amateur: 3×3 min, 1 min rest (Olympic/elite standard)
 * - Pro Men: 3 min rounds, 1 min rest
 * - Pro Women: 2 min rounds, 1 min rest
 * - Fitness: shorter rounds for bag work
 */
export const BOXING_PRESETS: Preset[] = [
	{
		id: 'amateur',
		label: 'Amateur (3×3)',
		config: {
			exerciseSeconds: 3 * 60,
			restSeconds: 1 * 60,
			rounds: 3
		}
	},
	{
		id: 'pro-6',
		label: 'Pro 6 rounds',
		config: {
			exerciseSeconds: 3 * 60,
			restSeconds: 1 * 60,
			rounds: 6
		}
	},
	{
		id: 'pro-8',
		label: 'Pro 8 rounds',
		config: {
			exerciseSeconds: 3 * 60,
			restSeconds: 1 * 60,
			rounds: 8
		}
	},
	{
		id: 'pro-12',
		label: 'Pro 12 rounds',
		config: {
			exerciseSeconds: 3 * 60,
			restSeconds: 1 * 60,
			rounds: 12
		}
	},
	{
		id: 'womens-pro',
		label: "Women's Pro",
		config: {
			exerciseSeconds: 2 * 60,
			restSeconds: 1 * 60,
			rounds: 10
		}
	},
	{
		id: 'fitness',
		label: 'Fitness (2×5)',
		config: {
			exerciseSeconds: 2 * 60,
			restSeconds: 30,
			rounds: 5
		}
	}
];
