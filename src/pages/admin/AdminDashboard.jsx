import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useProducts } from "../../context/ProductsContext";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader";
import ProductForm from "./ProductForm";

export default function AdminDashboard() {
  const { products, loading, usingFallback, deleteProduct, seedFirestoreWithSampleProducts } = useProducts();
  const { currentUser } = useAuth();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [editingProduct, setEditingProduct] = useState(null); // null = closed, {} = new, {...} = editing
  const [deletingId, setDeletingId] = useState(null);
  const [seeding, setSeeding] = useState(false);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))],
    [products]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesQuery = !q || p.name.toLowerCase().includes(q);
      const matchesCategory = !category || p.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [products, query, category]);

  async function handleDelete(product) {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setDeletingId(product.id);
    try {
      await deleteProduct(product.id);
      toast.success(`${product.name} deleted.`);
    } catch {
      toast.error("Failed to delete product.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSeed() {
    setSeeding(true);
    try {
      await seedFirestoreWithSampleProducts();
      toast.success("Sample products imported to Firestore.");
    } catch {
      toast.error("Failed to import sample products.");
    } finally {
      setSeeding(false);
    }
  }

  return (
    <section className="py-5 admin-dashboard">
      <div className="container py-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <span className="section-tag">Admin</span>
            <h2 className="fw-bold mt-2 mb-0">Product Dashboard</h2>
            <p className="text-muted mb-0">Signed in as {currentUser?.email}</p>
          </div>
          <button
            className="btn btn-primary rounded-pill px-4"
            onClick={() => setEditingProduct({})}
            disabled={usingFallback}
            title={usingFallback ? "Import sample products first, or add one manually — this still works." : undefined}
          >
            <i className="ri-add-line me-1"></i> Add Product
          </button>
        </div>

       {usingFallback && (
        <div className="alert alert-warning d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div>
            <strong>No products in Firestore yet.</strong> You're viewing local sample data —
            editing and deleting are disabled until real products exist in the database.
          </div>
          <button
            className="btn btn-sm btn-outline-primary rounded-pill px-3"
            onClick={handleSeed}
            disabled={seeding}
          >
            {seeding ? "Importing…" : "Import Sample Products to Firestore"}
          </button>
        </div>
      )}
        <div className="row g-3 mb-4 search-filter-bar">
          <div className="col-md-7">
            <div className="search-input-wrap">
              <i className="ri-search-line"></i>
              <input
                type="search" className="form-control" placeholder="Search by name…"
                value={query} onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-5">
            <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <Loader label="Loading products…" />
        ) : (
          <div className="table-responsive admin-table-wrap">
            <table className="table align-middle admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const imageSrc = /^https?:\/\//i.test(p.image)
                    ? p.image
                    : `${import.meta.env.BASE_URL}${p.image.replace(/^\/+/, "")}`;
                  return (
                    <tr key={p.id}>
                      <td><img src={imageSrc} alt={p.name} className="admin-thumb" /></td>
                      <td>{p.name}</td>
                      <td>{p.category}</td>
                      <td>${Number(p.price).toFixed(2)}</td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-primary rounded-pill me-2" onClick={() => setEditingProduct(p)} disabled={usingFallback} title={usingFallback ? "Import sample products first to enable editing." : undefined}>
                          Edit
                        </button>
                        <button className="btn btn-sm btn-outline-danger rounded-pill" onClick={() => handleDelete(p)} disabled={usingFallback || deletingId === p.id} title={usingFallback ? "Import sample products first to enable deleting." : undefined}>
                          {deletingId === p.id ? "Deleting…" : "Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center text-muted py-4">No products match your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editingProduct !== null && (
        <ProductForm product={editingProduct} onClose={() => setEditingProduct(null)} />
      )}
    </section>
  );
}