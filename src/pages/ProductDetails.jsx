import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import { useProducts } from "../context/ProductsContext";
import { useCart } from "../context/CartContext";
import Loader from "../components/Loader";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (loading) return <Loader label="Loading product…" />;

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <h2>Product not found</h2>
        <p className="text-muted">This product may have been removed.</p>
        <Link to="/products" className="btn btn-primary rounded-pill px-4">Back to Products</Link>
      </div>
    );
  }

  const imageSrc = /^https?:\/\//i.test(product.image)
    ? product.image
    : `${import.meta.env.BASE_URL}${product.image.replace(/^\/+/, "")}`;

  function handleAdd() {
    addToCart(product.id, quantity);
    toast.success(`${quantity} × ${product.name} added to cart`);
  }

  function handleBuyNow() {
    addToCart(product.id, quantity);
    toast.success(`${quantity} × ${product.name} added to cart`);
    navigate("/cart");
  }

  return (
    <section className="py-5">
      <div className="container py-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/products">Products</Link></li>
            <li className="breadcrumb-item active">{product.name}</li>
          </ol>
        </nav>

        <div className="row g-5 align-items-center mt-2">
          <div className="col-lg-6">
            <div className="product-img-wrap" style={{ borderRadius: "16px" }}>
              <img
                src={imageSrc}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.onerror = null; // prevent infinite loop if the fallback itself somehow errors
                  e.currentTarget.src =
                    "data:image/svg+xml;charset=UTF-8," +
                    encodeURIComponent(
                      `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">
                        <rect width="100%" height="100%" fill="#f5ede3"/>
                        <text x="50%" y="50%" font-family="sans-serif" font-size="20"
                              fill="#9b9186" text-anchor="middle" dominant-baseline="middle">
                          Image not available
                        </text>
                      </svg>`
                    );
                }}
              />
              {product.badge && (
                <span className={"product-badge" + (product.badge === "New" ? " new" : "")}>
                  {product.badge}
                </span>
              )}
            </div>
          </div>
          <div className="col-lg-6">
            <span className="section-tag">{product.category}</span>
            <h1 className="fw-bold mt-2">{product.name}</h1>
            <p className="product-price fs-3 mt-2">${Number(product.price).toFixed(2)}</p>
            <p className="text-success fw-semibold">✓ In Stock</p>
            <p className="text-muted lh-lg">{product.description}</p>

            <div className="mt-3">
              <p className="mb-1"> Free delivery on orders over $50</p>
              <p className="mb-1"> 7-day return policy</p>
              <p className="mb-0"> Secure checkout</p>
            </div>

            <div className="d-flex align-items-center gap-3 mt-4">
              <label className="fw-semibold mb-0">Quantity</label>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="fw-bold">{quantity}</span>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <div className="d-grid gap-3 d-md-flex mt-4">
              <button className="btn btn-outline-primary btn-lg rounded-pill px-4" onClick={handleAdd}>
                Add to Cart
              </button>
              <button className="btn btn-primary btn-lg rounded-pill px-4" onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>

            <div className="mt-4">
              <button
                type="button"
                className="btn btn-link text-decoration-none ps-0"
                onClick={() => navigate(-1)}
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}