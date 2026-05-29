interface TooltipProps {
  text: string;
  width?: string;
  noWrap?: boolean;
}

export function Tooltip({ text, width = 'w-44', noWrap = false }: TooltipProps) {
  return (
    <div className={`absolute right-8 top-1/2 -translate-y-1/2 ${noWrap ? 'w-auto whitespace-nowrap' : width}
                     bg-white border border-slate-200 text-slate-600 text-[11px]
                     rounded-lg px-2.5 py-1.5 shadow-sm leading-relaxed
                     opacity-0 group-hover:opacity-100 transition-opacity duration-150
                     pointer-events-none z-50 text-left`}>
      {text}
      <div className="absolute right-[-5px] top-1/2 -translate-y-1/2 border-[5px] border-transparent border-l-slate-200" />
      <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 border-[4px] border-transparent border-l-white" />
    </div>
  );
}
