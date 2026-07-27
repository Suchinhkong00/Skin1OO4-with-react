export default function Pagination({ page, totalPages, onPageChange }) {

  if (totalPages <= 1) return null;

  const pages = Array.from(
    { length: totalPages },
    (_, i) => i + 1
  );

  return (
    <nav aria-label="Product pages">
      <div className="custom-pagination">

        <button
          className="pagination-btn arrow"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          ‹
        </button>


        {pages.map((p) => (
          <button
            key={p}
            className={
              "pagination-btn " +
              (p === page ? "active" : "")
            }
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}


        <button
          className="pagination-btn arrow"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
        >
          ›
        </button>

      </div>
    </nav>
  );
}