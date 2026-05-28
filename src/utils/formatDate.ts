const MONTHS = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
];

export function formatDate(isoDate: string): string {
	const [y, m, d] = isoDate.split('-').map(Number);
	return `${d} ${MONTHS[m - 1]} ${y}`;
}

export function formatOrdinalDate(isoDate: string): string {
	const [, m, d] = isoDate.split('-').map(Number);
	const suffix =
		d === 1 || d === 21 || d === 31 ? 'st' : d === 2 || d === 22 ? 'nd' : d === 3 || d === 23 ? 'rd' : 'th';
	return `${d}${suffix} ${MONTHS[m - 1]}`;
}
