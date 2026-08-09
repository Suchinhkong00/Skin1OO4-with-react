import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../firebase/config";
import Loader from "../../components/Loader";

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];

const statusLabel = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function formatDate(timestamp) {
  if (!timestamp?.toDate) return "—";
  return timestamp.toDate().toLocaleString(undefined, {
    year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    // No where() clause here — admins see every order, not just their own.
    // Firestore rules allow this because isAdmin() is evaluated per document
    // regardless of query filters, so an unfiltered list query is fine.
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setOrders(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (error) => {
        console.error("Failed to load orders:", error);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  async function handleStatusChange(orderId, newStatus) {
    setUpdatingId(orderId);
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
      toast.success("Order status updated.");
    } catch {
      toast.error("Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  }

  const filtered = statusFilter === "all" ? orders : orders.filter((o) => o.status === statusFilter);

  if (loading) return <Loader label="Loading orders…" />;

  return (
    <section className="py-5 admin-dashboard">
      <div className="container py-4">
        <div className="mb-4">
          <span className="section-tag">Admin</span>
          <h2 className="fw-bold mt-2 mb-0">Orders</h2>
          <p className="text-muted mb-0">{orders.length} total orders</p>
        </div>

        <div className="d-flex flex-wrap gap-2 mb-4">
          <button
            className={"btn btn-sm rounded-pill px-3 " + (statusFilter === "all" ? "btn-primary" : "btn-outline-primary")}
            onClick={() => setStatusFilter("all")}
          >
            All
          </button>
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              className={"btn btn-sm rounded-pill px-3 " + (statusFilter === s ? "btn-primary" : "btn-outline-primary")}
              onClick={() => setStatusFilter(s)}
            >
              {statusLabel[s]}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state text-center py-5">
            <i className="ri-file-list-3-line"></i>
            <h4 className="mt-3">No orders found</h4>
            <p className="text-muted">
              {statusFilter === "all" ? "No orders have been placed yet." : `No orders with status "${statusLabel[statusFilter]}".`}
            </p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {filtered.map((order) => (
              <div className="cart-summary" key={order.id}>
                <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
                  <div>
                    <span className="text-muted small d-block">Order #{order.id.slice(0, 8).toUpperCase()}</span>
                    <span className="text-muted small">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="text-end">
                    <div className="fw-semibold">{order.shipping?.fullName || "Unknown"}</div>
                    <div className="text-muted small">{order.shipping?.phone}</div>
                  </div>
                </div>

                <div className="mb-3">
                  {order.items?.map((item, i) => (
                    <div className="d-flex justify-content-between small mb-1" key={i}>
                      <span className="text-muted">{item.name} × {item.qty}</span>
                      <span>${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="d-flex flex-wrap justify-content-between align-items-center border-top pt-3 gap-3">
                  <div className="fw-bold">Total: ${Number(order.subtotal).toFixed(2)}</div>
                  <div className="d-flex align-items-center gap-2">
                    <label className="text-muted small mb-0">Status</label>
                    <select
                      className="form-control form-control-sm"
                      style={{ width: "auto" }}
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{statusLabel[s]}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="text-muted small mt-2">
                  {order.shipping?.address}, {order.shipping?.city} · {order.paymentMethod === "cod" ? "Cash on Delivery" : "Card"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}