import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useProducts } from "../context/ProductsContext";
import { useCart } from "../context/CartContext";
import Loader from "../components/Loader";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { addToCart } = useCart();

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
    addToCart(product.id, 1);
    toast.success(`${product.name} added to cart`);
  }

  function handleBuyNow() {
    addToCart(product.id, 1);
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
              <img src={imageSrc} alt={product.name} />
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
            <p className="text-muted lh-lg">{product.description}</p>
            <div className="d-flex flex-wrap gap-3 mt-4">
              <button className="btn btn-outline-primary btn-lg rounded-pill px-4" onClick={handleAdd}>
                Add to Cart
              </button>
              <button className="btn btn-primary btn-lg rounded-pill px-4" onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}