export const SANTA_CRUZ_NEIGHBORHOODS = [
	'Santa Cruz — Downtown',
	'Santa Cruz — Westside',
	'Santa Cruz — Eastside',
	'Santa Cruz — Midtown',
	'Live Oak',
	'Capitola',
	'Soquel',
	'Aptos',
	'Watsonville',
	'Freedom',
	'Scotts Valley',
	'Felton',
	'Ben Lomond',
	'Boulder Creek',
	'Davenport',
	'Bonny Doon'
] as const;

export type Neighborhood = (typeof SANTA_CRUZ_NEIGHBORHOODS)[number];
