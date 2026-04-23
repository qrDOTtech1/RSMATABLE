export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24">
      <div className="h-14 bg-[#0a0a0a] border-b border-white/[0.06]" />
      <div className="max-w-lg mx-auto p-4 space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-white/[0.03] border border-white/[0.06] h-32" />
        ))}
      </div>
    </div>
  );
}
