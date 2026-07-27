export default function SearchFilterBar({ query, onQueryChange, category, onCategoryChange, categories }) {
  return (
    <div className="row g-3 mb-4 search-filter-bar">
      <div className="col-md-7">
        <div className="search-input-wrap">
          <i className="ri-search-line"></i>
          <input
            type="search"
            className="form-control"
            placeholder="Search products…"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            aria-label="Search products"
          />
        </div>
      </div>
      <div className="col-md-5">
        <select
          className="form-control"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
