'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

export function PrivacyNote() {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);
	const closeButtonRef = useRef<HTMLButtonElement>(null);
	const titleId = useId();

	useEffect(() => {
		if (!open) return;
		closeButtonRef.current?.focus();

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setOpen(false);
		};
		document.addEventListener('keydown', onKeyDown);
		return () => document.removeEventListener('keydown', onKeyDown);
	}, [open]);

	return (
		<>
			<button
				type='button'
				onClick={() => setOpen(true)}
				className='py-1 font-medium hover:text-slate-900 transition-colors'>
				{t('app.footer.privacyLabel')}
			</button>

			{open &&
				createPortal(
					<div
						className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40'
						onClick={() => setOpen(false)}>
						<div
							role='dialog'
							aria-modal='true'
							aria-labelledby={titleId}
							onClick={(e) => e.stopPropagation()}
							className='bg-white rounded-xl shadow-lg max-w-sm w-full p-5 text-left'>
							<div className='flex items-start justify-between gap-3 mb-2'>
								<h2 id={titleId} className='text-base font-semibold text-slate-800'>
									{t('app.footer.privacyLabel')}
								</h2>
								<button
									ref={closeButtonRef}
									type='button'
									onClick={() => setOpen(false)}
									aria-label={t('common.close')}
									className='text-slate-500 hover:text-slate-700 text-2xl leading-none shrink-0 px-1'>
									×
								</button>
							</div>
							<p className='text-base text-slate-600 leading-relaxed'>{t('app.footer.privacy')}</p>
						</div>
					</div>,
					document.body
				)}
		</>
	);
}
