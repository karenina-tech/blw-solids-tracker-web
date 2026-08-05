import i18n from '@/i18n/config';

function getMonths(language: string): string[] {
	return i18n.t('datePicker.months', { lng: language, returnObjects: true }) as string[];
}

export function formatDate(isoDate: string, language: string = 'en'): string {
	const [y, m, d] = isoDate.split('-').map(Number);
	const months = getMonths(language);
	if (language === 'es') return `${d} de ${months[m - 1]} de ${y}`;
	return `${d} ${months[m - 1]} ${y}`;
}

export function formatOrdinalDate(isoDate: string, language: string = 'en'): string {
	const [, m, d] = isoDate.split('-').map(Number);
	const months = getMonths(language);
	if (language === 'es') return `${d} de ${months[m - 1]}`;
	const suffix =
		d === 1 || d === 21 || d === 31 ? 'st' : d === 2 || d === 22 ? 'nd' : d === 3 || d === 23 ? 'rd' : 'th';
	return `${d}${suffix} ${months[m - 1]}`;
}
