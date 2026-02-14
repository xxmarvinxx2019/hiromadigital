export default function StatCard({ title }) {
  return (
    <div className="hiroma-card">
      <h4>{title}</h4>
      <p className="mt-2 text-sm text-[var(--hiroma-muted)]">—</p>
    </div>
  );
}
