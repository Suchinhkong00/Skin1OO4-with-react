import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductsContext";
import Loader from "../components/Loader";

export default function Cart() {
  const { cart, updateQty, removeFromCart, clearCart } = useCart();
  const { products, loading } = useProducts();

  if (loading) return <Loader label="Loading your cart…" />;

  const lines = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      return product ? { ...item, product } : null;
    })
    .filter(Boolean);

  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);

  return (
    <>
      <div className="page-banner">
        <div className="container">
          <h1>Your <span style={{ color: "#a8d5b5" }}>Cart</span></h1>
          <p>Review your ritual before checkout.</p>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active">Cart</li>
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
              <p className="text-muted">Add a few products to start your ritual.</p>
              <Link to="/products" className="btn btn-primary rounded-pill px-4">Browse Products</Link>
            </div>
          ) : (
            <div className="row g-4">
              <div className="col-lg-8">
                {lines.map(({ product, qty }) => (
                  <div className="cart-item" key={product.id}>
                    <img src={product.image} alt={product.name} className="cart-item-img" />
                    <div className="cart-item-body">
                      <h5>{product.name}</h5>
                      <p className="text-muted small mb-2">${product.price.toFixed(2)} each</p>
                      <div className="qty-control">
                        <button onClick={() => updateQty(product.id, qty - 1)} aria-label="Decrease quantity">−</button>
                        <span>{qty}</span>
                        <button onClick={() => updateQty(product.id, qty + 1)} aria-label="Increase quantity">+</button>
                      </div>
                    </div>
                    <div className="cart-item-total">
                      <span>${(product.price * qty).toFixed(2)}</span>
                      <button className="remove-btn" onClick={() => removeFromCart(product.id)} aria-label="Remove item">
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </div>
                ))}
                <button className="btn btn-outline-secondary btn-sm rounded-pill mt-3" onClick={clearCart}>
                  Clear Cart
                </button>
              </div>

              <div className="col-lg-4">
                <div className="cart-summary">
                  <h5 className="fw-bold mb-3">Order Summary</h5>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Shipping</span>
                    <span className="text-success">Free</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
                    <span>Total</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <button className="btn btn-primary btn-lg w-100 rounded-pill">Checkout</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
