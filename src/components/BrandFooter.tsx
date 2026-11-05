'use client';

import { useTranslation } from 'react-i18next';

const DEVELOPER_NAME = 'Karenina';
const DEVELOPER_URL = 'https://kareninatech.com';
const AGENCY_NAME = 'tuik';
const AGENCY_URL = 'https://tuik.ai';

const linkClass =
	'font-medium text-slate-700 hover:text-slate-900 transition-colors';

export function BrandFooter() {
	const { t } = useTranslation();
	return (
		<span className='text-base text-slate-600'>
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
		</span>
	);
}
