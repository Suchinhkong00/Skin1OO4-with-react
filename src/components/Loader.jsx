export default function Loader({ label = "Loading…" }) {
  return (
    <div className="loader-wrap" role="status" aria-live="polite">
      <div className="spinner" />
      <p className="loader-label">{label}</p>
    </div>
  );
}
