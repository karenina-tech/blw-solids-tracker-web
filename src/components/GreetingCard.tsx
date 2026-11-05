'use client';

import { HandHeart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Props = {
	onStart: () => void;
};

export function GreetingCard({ onStart }: Props) {
	const { t } = useTranslation();
	return (
		<div data-sheet className='sheet-gradient rounded-2xl p-8 text-center'>
			<HandHeart className='w-8 h-8 text-seed-600 mx-auto mb-3' aria-hidden />
			<h2 className='text-base font-semibold text-slate-700 mb-2'>{t('greeting.welcome')}</h2>
			<p className='text-sm text-slate-500 mb-4'>{t('greeting.body')}</p>
			<button
				onClick={onStart}
				className='bg-seed-600 hover:bg-seed-500 text-white text-sm font-medium px-6 py-2 rounded-xl transition-colors'>
				{t('greeting.cta')}
			</button>
		</div>
	);
}
