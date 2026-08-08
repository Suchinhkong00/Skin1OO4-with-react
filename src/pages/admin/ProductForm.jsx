import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useProducts } from "../../context/ProductsContext";

const emptyForm = { name: "", price: "", category: "", image: "", description: "", badge: "" };

export default function ProductForm({ product, onClose }) {
  const isEditing = Boolean(product?.id);
  const { products, createProduct, updateProduct } = useProducts();
  const [form, setForm] = useState(
    isEditing
      ? {
          name: product.name || "",
          price: product.price ?? "",
          category: product.category || "",
          image: product.image || "",
          description: product.description || "",
          badge: product.badge || "",
        }
      : emptyForm
  );
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Existing categories are read straight from real product data — the same
  // source the Products page filter and the footer links use — so there's
  // one single source of truth for what categories exist at all.
  const existingCategories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))].sort(),
    [products]
  );

  const [addingNewCategory, setAddingNewCategory] = useState(
    isEditing && form.category && !existingCategories.includes(form.category)
  );

  function handleCategorySelect(e) {
    const v = e.target.value;
    if (v === "__new__") {
      setAddingNewCategory(true);
      setForm({ ...form, category: "" });
    } else {
      setAddingNewCategory(false);
      setForm({ ...form, category: v });
    }
  }

  function validate() {
    const next = {};

    if (!form.name.trim()) next.name = "Product name is required.";

    const priceNum = Number(form.price);
    if (form.price === "" || !Number.isFinite(priceNum) || priceNum <= 0) {
      next.price = "Enter a valid price greater than 0.";
    }

    if (!form.category.trim()) next.category = "Category is required.";

    const image = form.image.trim();
    if (!image) {
      next.image = "Image path or URL is required.";
    } else if (!/^https?:\/\//i.test(image) && !image.startsWith("/") && !image.startsWith("images/")) {
      next.image = 'Must be a full URL (https://...) or a local path (e.g. "/images/example.webp").';
    }

    if (!form.description.trim()) next.description = "Description is required.";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = { ...form, category: form.category.trim() };
      if (isEditing) {
        await updateProduct(product.id, payload);
        toast.success("Product updated.");
      } else {
        await createProduct(payload);
        toast.success("Product created.");
      }
      onClose();
    } catch {
      toast.error("Failed to save product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold mb-0">{isEditing ? "Edit Product" : "Add Product"}</h4>
          <button className="btn-close" onClick={onClose} aria-label="Close"></button>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label">Product Name</label>
            <input
              type="text" className="form-control"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <div className="form-msg error mt-1">{errors.name}</div>}
          </div>
          <div className="row g-3">
            <div className="col-6">
              <label className="form-label">Price (USD)</label>
              <input
                type="number" step="0.01" min="0" className="form-control"
                value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
              {errors.price && <div className="form-msg error mt-1">{errors.price}</div>}
            </div>
            <div className="col-6">
              <label className="form-label">Category</label>
              {addingNewCategory ? (
                <div className="d-flex gap-2">
                  <input
                    type="text" className="form-control" placeholder="New category name"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    autoFocus
                  />
                  <button
                    type="button" className="btn btn-outline-secondary"
                    onClick={() => { setAddingNewCategory(false); setForm({ ...form, category: "" }); }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <select className="form-control" value={form.category} onChange={handleCategorySelect}>
                  <option value="" disabled>Select a category</option>
                  {existingCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="__new__">+ Add new category</option>
                </select>
              )}
              {errors.category && <div className="form-msg error mt-1">{errors.category}</div>}
            </div>
          </div>
          <div className="mb-3 mt-3">
            <label className="form-label">Image Path or URL</label>
            <input
              type="text" className="form-control" placeholder="/images/example.webp"
              value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
            />
            {errors.image && <div className="form-msg error mt-1">{errors.image}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Badge <span className="text-muted fw-normal">(optional: "New" or "Bestseller")</span></label>
            <input
              type="text" className="form-control"
              value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Description</label>
            <textarea
              className="form-control" rows="3"
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            {errors.description && <div className="form-msg error mt-1">{errors.description}</div>}
          </div>
          <div className="d-flex gap-2 justify-content-end">
            <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary rounded-pill px-4" disabled={submitting}>
              {submitting ? "Saving…" : isEditing ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}