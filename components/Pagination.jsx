export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  return (
    <div className="flex items-center justify-between mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="hiroma-btn hiroma-btn-secondary disabled:opacity-50"
      >
        Previous
      </button>

      <span className="text-sm text-[var(--hiroma-muted)]">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="hiroma-btn hiroma-btn-secondary disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
