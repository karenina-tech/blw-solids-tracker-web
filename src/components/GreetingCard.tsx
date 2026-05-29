type Props = {
  onStart: () => void;
};

export function GreetingCard({ onStart }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-8 text-center mb-4">
      <p className="text-2xl mb-3">👋</p>
      <h2 className="text-base font-semibold text-slate-700 mb-2">Welcome!</h2>
      <p className="text-sm text-slate-500 mb-4">
        When I started introducing solids to my daughter, I looked for a tool to help me create a plan, but I couldn't find one. Now that I have the time, I decided to build it myself to help you on your own BLW journey!
      </p>
      <button
        onClick={onStart}
        className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-6 py-2 rounded-xl transition-colors"
      >
        Let's get started
      </button>
      <p className="text-xs text-slate-400 mt-4">
        Made with 💚 by Karenina{' '}
        
      </p>
     
    </div>
  );
}
