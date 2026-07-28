import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const imageSrc = /^https?:\/\//i.test(product.image)
    ? product.image
    : `${import.meta.env.BASE_URL}${product.image.replace(/^\/+/, "")}`;

  function handleAdd(e) {
    e.preventDefault();
    addToCart(product.id, 1);
    toast.success(`${product.name} added to cart`);
  }

  return (
    <div className="col-sm-6 col-lg-4">
      <div className="product-card h-100">
        <Link to={`/products/${product.id}`} className="product-img-wrap d-block">
          <img src={imageSrc} alt={product.name} />
          {product.badge && (
            <span className={"product-badge" + (product.badge === "New" ? " new" : "")}>
              {product.badge}
            </span>
          )}
        </Link>
        <div className="product-body">
          <Link to={`/products/${product.id}`} className="text-reset">
            <h3 className="product-name">{product.name}</h3>
          </Link>
          <p className="product-price">${Number(product.price).toFixed(2)}</p>
          <p className="product-desc">{product.description}</p>
          <span className="text-success fw-bold">{product.category}</span>
          <button className="btn btn-primary btn-sm rounded-pill mt-3 w-100" onClick={handleAdd}>
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}