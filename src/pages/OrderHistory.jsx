import { Link } from "react-router-dom";
import { useOrders } from "../context/OrdersContext";
import Loader from "../components/Loader";

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

export default function OrderHistory() {
  const { orders, loading } = useOrders();

  if (loading) return <Loader label="Loading your orders…" />;

  return (
    <>
      <div className="page-banner">
        <div className="container">
          <h1>Order <span style={{ color: "#a8d5b5" }}>History</span></h1>
          <p>Track everything you've ordered from SKIN1004.</p>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active">Orders</li>
            </ol>
          </nav>
        </div>
      </div>

      <section className="py-5">
        <div className="container py-4">
          {orders.length === 0 ? (
            <div className="empty-state text-center py-5">
              <i className="ri-file-list-3-line"></i>
              <h4 className="mt-3">No orders yet</h4>
              <p className="text-muted">Once you place an order, it'll show up here.</p>
              <Link to="/products" className="btn btn-primary rounded-pill px-4">Browse Products</Link>
            </div>
          ) : (
            <div className="d-flex flex-column gap-4">
              {orders.map((order) => (
                <div className="cart-summary" key={order.id}>
                  <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                    <div>
                      <span className="text-muted small d-block">Order #{order.id.slice(0, 8).toUpperCase()}</span>
                      <span className="text-muted small">{formatDate(order.createdAt)}</span>
                    </div>
                    <span className="product-badge" style={{ position: "static" }}>
                      {statusLabel[order.status] || order.status}
                    </span>
                  </div>
                  <div className="mb-3">
                    {order.items.map((item, i) => (
                      <div className="d-flex justify-content-between small mb-1" key={i}>
                        <span className="text-muted">{item.name} × {item.qty}</span>
                        <span>${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="d-flex justify-content-between fw-bold border-top pt-3">
                    <span>Total</span>
                    <span>${Number(order.subtotal).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}