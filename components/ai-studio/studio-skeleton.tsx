export function StudioSkeleton() {
  return (
    <div className="flex h-screen w-full bg-[#090b11] text-[#f3f4f8] antialiased overflow-hidden">
      {/* Skeleton Sidebar */}
      <aside className="w-64 border-r border-[rgba(87,241,239,0.15)] bg-[#07090e]/95 p-4 flex flex-col justify-between hidden md:flex shrink-0">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[rgba(87,241,239,0.12)]">
            <div className="h-9 w-9 rounded-xl bg-[rgba(87,241,239,0.1)] border border-[rgba(87,241,239,0.3)] animate-pulse" />
            <div className="space-y-1">
              <div className="h-3.5 w-20 bg-[rgba(87,241,239,0.2)] rounded animate-pulse" />
              <div className="h-2.5 w-28 bg-white/10 rounded" />
            </div>
          </div>
          <div className="h-9 w-full rounded-xl bg-[rgba(87,241,239,0.15)] border border-[rgba(87,241,239,0.3)] animate-pulse" />
          <div className="space-y-2 pt-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-8 w-full rounded-xl bg-white/5 border border-white/5" />
            ))}
          </div>
        </div>
        <div className="h-10 w-full rounded-xl bg-[rgba(14,18,29,0.8)] border border-[rgba(87,241,239,0.2)] animate-pulse" />
      </aside>

      {/* Skeleton Stage */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-12 border-b border-[rgba(87,241,239,0.15)] bg-[#090b11] px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-3 w-16 bg-white/10 rounded" />
            <div className="h-3 w-3 bg-white/10 rounded" />
            <div className="h-3 w-32 bg-[rgba(87,241,239,0.3)] rounded animate-pulse" />
          </div>
          <div className="h-6 w-44 rounded-full bg-[rgba(14,18,29,0.8)] border border-[rgba(87,241,239,0.2)] animate-pulse" />
        </header>

        <main className="flex-1 p-6 overflow-hidden flex flex-col gap-6">
          <div className="h-20 w-full rounded-2xl bg-[rgba(14,18,29,0.7)] border border-[rgba(87,241,239,0.2)] animate-pulse" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-[rgba(14,18,29,0.7)] border border-[rgba(87,241,239,0.2)] animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4 flex-1">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-44 rounded-2xl bg-[rgba(14,18,29,0.7)] border border-[rgba(87,241,239,0.2)] animate-pulse" />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
