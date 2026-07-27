import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";
import ProductCard from "../components/ProductCard";
import SearchFilterBar from "../components/SearchFilterBar";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";

const PAGE_SIZE = 9;

export default function Products() {
  const { products, loading } = useProducts();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))],
    [products]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesQuery =
        !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      const matchesCategory = !category || p.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [products, query, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function updateQuery(v) {
    setQuery(v);
    setPage(1);
  }

  function updateCategory(v) {
    setCategory(v);
    setPage(1);
  }

  return (
    <>
      <div className="page-banner">
        <div className="container">
          <h1>Our <span style={{ color: "#a8d5b5" }}>Products</span></h1>
          <p>Seven targeted formulas for a complete skin ritual.</p>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active">Products</li>
            </ol>
          </nav>
        </div>
      </div>

      <section className="py-5">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="section-tag">Our Range</span>
            <h2 className="fw-bold mt-2">Skin First Formulas</h2>
            <p className="text-muted">Each product is crafted for a targeted purpose within your daily ritual.</p>
          </div>

          <SearchFilterBar
            query={query}
            onQueryChange={updateQuery}
            category={category}
            onCategoryChange={updateCategory}
            categories={categories}
          />

          {loading ? (
            <Loader label="Loading products…" />
          ) : visible.length === 0 ? (
            <div className="empty-state text-center py-5">
              <i className="ri-search-eye-line"></i>
              <h5 className="mt-3">No products match your search</h5>
              <p className="text-muted">Try a different keyword or clear the category filter.</p>
            </div>
          ) : (
            <>
              <div className="row g-4">
                {visible.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </div>
      </section>

      <section className="py-5 bg-beige">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="section-tag">Ritual Guide</span>
            <h2 className="fw-bold mt-2">How to Build Your Routine</h2>
          </div>
          <div className="row g-4">
            <div className="col-6 col-md-3">
              <div className="routine-step">
                <span className="step-num">01</span>
                <h5>Cleanse</h5>
                <p className="text-muted small mb-0">Start with a SKIN1004 Cleansing Foam morning and night.</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="routine-step">
                <span className="step-num">02</span>
                <h5>Tone</h5>
                <p className="text-muted small mb-0">Apply the Hyalu-Cica Brightening Toner with a cotton pad or fingertips.</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="routine-step">
                <span className="step-num">03</span>
                <h5>Serum</h5>
                <p className="text-muted small mb-0">Press a few drops of Hyalu-Cica First Ampoule into damp skin.</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="routine-step">
                <span className="step-num">04</span>
                <h5>Moisturise + SPF</h5>
                <p className="text-muted small mb-0">Seal with Hyalu-Cica Moisture Cream; add Water-Fit Sun Serum every morning.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container py-4">
          <div className="cta-box">
            <h2>Learn What Makes Us Different</h2>
            <p>Every ingredient we use is chosen for a reason. Find out why.</p>
            <Link to="/why-choose-us" className="btn btn-light btn-lg px-5 rounded-pill text-success fw-bold">
              Why Choose SKIN1004
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
