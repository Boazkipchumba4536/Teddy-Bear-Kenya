export default function Loading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-3xl bg-sand flex items-center justify-center text-2xl animate-pulse">
          🧸
        </div>
        <p className="text-sm font-medium text-ink-light">Loading…</p>
      </div>
    </div>
  );
}
