'use client';

import { useTranslation } from 'react-i18next';

type Props = {
	onStart: () => void;
};

export function GreetingCard({ onStart }: Props) {
	const { t } = useTranslation();
	return (
		<div className='bg-white rounded-2xl shadow-md p-8 text-center mb-4'>
			<p className='text-2xl mb-3'>👋</p>
			<h2 className='text-base font-semibold text-slate-700 mb-2'>{t('greeting.welcome')}</h2>
			<p className='text-sm text-slate-500 mb-4'>{t('greeting.body')}</p>
			<button
				onClick={onStart}
				className='bg-seed-600 hover:bg-seed-500 text-white text-sm font-medium px-6 py-2 rounded-xl transition-colors'>
				{t('greeting.cta')}
			</button>
			<p className='text-xs text-slate-400 mt-4'>{t('greeting.madeBy')}</p>
		</div>
	);
}
