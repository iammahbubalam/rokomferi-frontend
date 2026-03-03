export default function Loading() {
    return (
        <div className="fixed inset-0 z-[50] flex flex-col items-center justify-center bg-canvas/40 backdrop-blur-sm pointer-events-none transition-all duration-300">
            <div className="w-8 h-8 border-[1px] border-primary/20 border-t-primary/80 rounded-full animate-spin mb-4" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary/60 font-serif italic">Loading</span>
        </div>
    );
}
