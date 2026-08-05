'use client';

import { useTranslation } from 'react-i18next';

const DEVELOPER_NAME = 'Karenina';
const DEVELOPER_URL = 'https://kareninatech.com';
const AGENCY_NAME = 'tuik';
const AGENCY_URL = 'https://tuik.ai';

const linkClass =
	'font-medium text-slate-500 hover:text-slate-700 transition-colors';

export function BrandFooter() {
	const { t } = useTranslation();
	return (
		<p className='text-center text-[11px] text-slate-400 mt-2' aria-label='Site credit'>
			{t('app.footer.builtBy')}{' '}
			<a
				href={DEVELOPER_URL}
				target='_blank'
				rel='noopener noreferrer'
				aria-label={`${DEVELOPER_NAME} portfolio (opens in a new tab)`}
				className={linkClass}>
				{DEVELOPER_NAME}
			</a>{' '}
			@{' '}
			<a
				href={AGENCY_URL}
				target='_blank'
				rel='noopener noreferrer'
				aria-label={`${AGENCY_NAME} agency website (opens in a new tab)`}
				className={linkClass}>
				{AGENCY_NAME}
			</a>
		</p>
	);
}
