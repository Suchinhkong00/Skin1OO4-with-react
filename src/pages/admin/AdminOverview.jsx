import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useProducts } from "../../context/ProductsContext";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader";

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

export default function AdminOverview() {
  const { products } = useProducts();
  const { currentUser } = useAuth();

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

  return (
    <section className="py-5 admin-dashboard">
      <div className="container py-4">
        <div className="mb-4">
          <span className="section-tag">Admin</span>
          <h2 className="fw-bold mt-2 mb-0">Dashboard</h2>
          <p className="text-muted mb-0">Signed in as {currentUser?.email}</p>
        </div>

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

        <div>
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
      </div>
    </section>
  );
}