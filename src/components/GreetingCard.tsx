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
			<h2 className='text-2xl font-bold text-accent-700 mb-3'>{t('greeting.welcome')}</h2>
			<p className='text-base leading-relaxed text-slate-600 mb-5'>{t('greeting.body')}</p>
			<button
				onClick={onStart}
				className='bg-seed-600 hover:bg-seed-500 text-white text-base font-semibold px-7 py-2.5 rounded-xl transition-colors'>
				{t('greeting.cta')}
			</button>
		</div>
	);
}
