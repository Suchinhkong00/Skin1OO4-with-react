import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useProducts } from "../../context/ProductsContext";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader";
import ProductForm from "./ProductForm";

const statusLabel = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function formatDate(timestamp) {
  if (!timestamp?.toDate) return "—";
  return timestamp.toDate().toLocaleDateString(undefined, {
    year: "numeric", month: "short", day: "numeric",
  });
}

export default function AdminDashboard() {
  const { products, loading, usingFallback, deleteProduct, seedFirestoreWithSampleProducts } = useProducts();
  const { currentUser } = useAuth();
  const [query_, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [seeding, setSeeding] = useState(false);

  // Lightweight, dashboard-only listeners for the stat cards and Recent
  // Orders — same unfiltered-query pattern already used in AdminOrders.jsx
  // and AdminCustomers.jsx (admins can read every order/user/message doc
  // per the existing Firestore rules, no query filter needed).
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const unsubOrders = onSnapshot(
      query(collection(db, "orders"), orderBy("createdAt", "desc")),
      (snap) => setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      () => {}
    );
    const unsubMessages = onSnapshot(
      collection(db, "messages"),
      (snap) => setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      () => {}
    );
    const unsubUsers = onSnapshot(
      collection(db, "users"),
      (snap) => {
        setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setStatsLoading(false);
      },
      () => setStatsLoading(false)
    );
    return () => {
      unsubOrders();
      unsubMessages();
      unsubUsers();
    };
  }, []);

  const stats = useMemo(() => {
    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const unreadMessages = messages.filter((m) => m.status === "new").length;
    const totalCustomers = users.filter((u) => u.role !== "admin").length;
    // Excludes cancelled orders — a cancelled order was never actually
    // fulfilled, so counting it would overstate real sales.
    const totalSales = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + (Number(o.subtotal) || 0), 0);

    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalCustomers,
      pendingOrders,
      unreadMessages,
      totalSales,
    };
  }, [products, orders, messages, users]);

  const recentOrders = orders.slice(0, 5);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))],
    [products]
  );

  const filtered = useMemo(() => {
    const q = query_.trim().toLowerCase();
    return products.filter((p) => {
      const matchesQuery = !q || p.name.toLowerCase().includes(q);
      const matchesCategory = !category || p.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [products, query_, category]);

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
        <div className="mb-4">
          <span className="section-tag">Admin</span>
          <h2 className="fw-bold mt-2 mb-0">Dashboard</h2>
          <p className="text-muted mb-0">Signed in as {currentUser?.email}</p>
        </div>

        {/* STAT CARDS */}
        {statsLoading ? (
          <Loader label="Loading stats…" />
        ) : (
          <div className="row g-3 mb-5">
            <div className="col-6 col-md-4 col-lg-2">
              <div className="admin-stat-card">
                <div className="stat-icon"><i className="ri-price-tag-3-line"></i></div>
                <span className="stat-value">{stats.totalProducts}</span>
                <span className="stat-caption">Total Products</span>
              </div>
            </div>
            <div className="col-6 col-md-4 col-lg-2">
              <div className="admin-stat-card">
                <div className="stat-icon"><i className="ri-file-list-3-line"></i></div>
                <span className="stat-value">{stats.totalOrders}</span>
                <span className="stat-caption">Total Orders</span>
              </div>
            </div>
            <div className="col-6 col-md-4 col-lg-2">
              <div className="admin-stat-card">
                <div className="stat-icon"><i className="ri-group-line"></i></div>
                <span className="stat-value">{stats.totalCustomers}</span>
                <span className="stat-caption">Total Customers</span>
              </div>
            </div>
            <div className="col-6 col-md-4 col-lg-2">
              <div className="admin-stat-card">
                <div className="stat-icon"><i className="ri-hourglass-line"></i></div>
                <span className="stat-value">{stats.pendingOrders}</span>
                <span className="stat-caption">Pending Orders</span>
              </div>
            </div>
            <div className="col-6 col-md-4 col-lg-2">
              <div className="admin-stat-card">
                <div className="stat-icon"><i className="ri-mail-line"></i></div>
                <span className="stat-value">{stats.unreadMessages}</span>
                <span className="stat-caption">Unread Messages</span>
              </div>
            </div>
            <div className="col-6 col-md-4 col-lg-2">
              <div className="admin-stat-card">
                <div className="stat-icon"><i className="ri-money-dollar-circle-line"></i></div>
                <span className="stat-value">${stats.totalSales.toFixed(2)}</span>
                <span className="stat-caption">Total Sales</span>
              </div>
            </div>
          </div>
        )}

        {/* RECENT ORDERS */}
        <div className="mb-5">
          <h5 className="fw-bold mb-3">Recent Orders</h5>
          {recentOrders.length === 0 ? (
            <div className="empty-state text-center py-4">
              <i className="ri-file-list-3-line"></i>
              <p className="text-muted mb-0">No orders yet.</p>
            </div>
          ) : (
            <div className="table-responsive admin-table-wrap">
              <table className="table align-middle admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.id}>
                      <td>#{o.id.slice(0, 8).toUpperCase()}</td>
                      <td>{o.shipping?.fullName || "—"}</td>
                      <td>${Number(o.subtotal).toFixed(2)}</td>
                      <td>{formatDate(o.createdAt)}</td>
                      <td>
                        <span className="product-badge" style={{ position: "static" }}>
                          {statusLabel[o.status] || o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* PRODUCT MANAGEMENT */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <h5 className="fw-bold mb-0">Products</h5>
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
                value={query_} onChange={(e) => setQuery(e.target.value)}
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
                        <button
                          className="btn btn-sm btn-outline-primary rounded-pill me-2"
                          onClick={() => setEditingProduct(p)}
                          disabled={usingFallback}
                          title={usingFallback ? "Import sample products first to enable editing." : undefined}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger rounded-pill"
                          onClick={() => handleDelete(p)}
                          disabled={usingFallback || deletingId === p.id}
                          title={usingFallback ? "Import sample products first to enable deleting." : undefined}
                        >
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