import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductsContext";
import { useOrders } from "../context/OrdersContext";
import Loader from "../components/Loader";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { products, loading } = useProducts();
  const { createOrder } = useOrders();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "cod",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <Loader label="Loading checkout…" />;

  const lines = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      return product ? { ...item, product } : null;
    })
    .filter(Boolean);

  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);

  function validate() {
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required.";
    if (!form.phone.trim()) next.phone = "Phone number is required.";
    if (!form.address.trim()) next.address = "Address is required.";
    if (!form.city.trim()) next.city = "City is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (lines.length === 0 || !validate()) return;
    setSubmitting(true);
    try {
      const items = lines.map(({ product, qty }) => ({
        productId: product.id,
        name: product.name,
        price: product.price,
        qty,
      }));
      await createOrder({
        items,
        subtotal,
        shipping: {
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
        },
        paymentMethod: form.paymentMethod,
      });
      clearCart();
      toast.success("Order placed! Track it in your order history.");
      navigate("/orders", { replace: true });
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="page-banner">
        <div className="container">
          <h1>Checkout</h1>
          <p>Enter your shipping details to complete your order.</p>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/cart">Cart</Link></li>
              <li className="breadcrumb-item active">Checkout</li>
            </ol>
          </nav>
        </div>
      </div>

      <section className="py-5">
        <div className="container py-4">
          {lines.length === 0 ? (
            <div className="empty-state text-center py-5">
              <i className="ri-shopping-cart-2-line"></i>
              <h4 className="mt-3">Your cart is empty</h4>
              <p className="text-muted">Add a few products before checking out.</p>
              <Link to="/products" className="btn btn-primary rounded-pill px-4">Browse Products</Link>
            </div>
          ) : (
            <div className="row g-4">
              <div className="col-lg-7">
                <span className="section-tag">Shipping</span>
                <h3 className="fw-bold mt-2 mb-4">Delivery Details</h3>
                <form onSubmit={handleSubmit} noValidate>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text" className="form-control"
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      />
                      {errors.fullName && <div className="form-msg error mt-1">{errors.fullName}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel" className="form-control"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                      {errors.phone && <div className="form-msg error mt-1">{errors.phone}</div>}
                    </div>
                    <div className="col-12">
                      <label className="form-label">Street Address</label>
                      <input
                        type="text" className="form-control"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                      />
                      {errors.address && <div className="form-msg error mt-1">{errors.address}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">City</label>
                      <input
                        type="text" className="form-control"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                      />
                      {errors.city && <div className="form-msg error mt-1">{errors.city}</div>}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="form-label d-block">Payment Method</label>
                    <div className="d-flex flex-column gap-2">
                      <label className="d-flex align-items-center gap-2">
                        <input
                          type="radio" name="paymentMethod" value="cod"
                          checked={form.paymentMethod === "cod"}
                          onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                        />
                        Cash on Delivery
                      </label>
                      <label className="d-flex align-items-center gap-2">
                        <input
                          type="radio" name="paymentMethod" value="card"
                          checked={form.paymentMethod === "card"}
                          onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                        />
                        Card (demo only — no real payment is processed)
                      </label>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill mt-4" disabled={submitting}>
                    {submitting ? "Placing order…" : "Place Order"}
                  </button>
                </form>
              </div>

              <div className="col-lg-5">
                <div className="cart-summary">
                  <h5 className="fw-bold mb-3">Order Summary</h5>
                  {lines.map(({ product, qty }) => (
                    <div className="d-flex justify-content-between mb-2" key={product.id}>
                      <span className="text-muted small">{product.name} × {qty}</span>
                      <span className="small">${(product.price * qty).toFixed(2)}</span>
                    </div>
                  ))}
                  <hr />
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Shipping</span>
                    <span className="text-success">Free</span>
                  </div>
                  <div className="d-flex justify-content-between fw-bold fs-5">
                    <span>Total</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}