import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../firebase/config";
import Loader from "../../components/Loader";

function formatDate(timestamp) {
  if (!timestamp?.toDate) return "—";
  return timestamp.toDate().toLocaleString(undefined, {
    year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setMessages(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsubscribe;
  }, []);

  async function handleOpen(msg) {
    setOpenId(openId === msg.id ? null : msg.id);
    if (msg.status === "new") {
      try {
        await updateDoc(doc(db, "messages", msg.id), { status: "read" });
      } catch {
        // non-critical — just leave it marked "new" if this fails
      }
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this message? This cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, "messages", id));
      toast.success("Message deleted.");
    } catch {
      toast.error("Failed to delete message.");
    }
  }

  const unreadCount = messages.filter((m) => m.status === "new").length;

  if (loading) return <Loader label="Loading messages…" />;

  return (
    <section className="py-5 admin-dashboard">
      <div className="container py-4">
        <div className="mb-4">
          <span className="section-tag">Admin</span>
          <h2 className="fw-bold mt-2 mb-0">Contact Messages</h2>
          <p className="text-muted mb-0">
            {messages.length} total {unreadCount > 0 && `· ${unreadCount} unread`}
          </p>
        </div>

        {messages.length === 0 ? (
          <div className="empty-state text-center py-5">
            <i className="ri-mail-line"></i>
            <h4 className="mt-3">No messages yet</h4>
            <p className="text-muted">Contact form submissions will show up here.</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {messages.map((msg) => (
              <div className="cart-summary" key={msg.id}>
                <div
                  className="d-flex flex-wrap justify-content-between align-items-start gap-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleOpen(msg)}
                >
                  <div>
                    <div className="d-flex align-items-center gap-2">
                      {msg.status === "new" && (
                        <span className="product-badge new" style={{ position: "static" }}>New</span>
                      )}
                      <strong>{msg.name}</strong>
                      <span className="text-muted small">— {msg.subject}</span>
                    </div>
                    <span className="text-muted small">{msg.email} {msg.phone && `· ${msg.phone}`}</span>
                  </div>
                  <span className="text-muted small">{formatDate(msg.createdAt)}</span>
                </div>

                {openId === msg.id && (
                  <div className="mt-3 pt-3 border-top">
                    <p className="mb-3">{msg.message}</p>
                    <button
                      className="btn btn-sm btn-outline-danger rounded-pill"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(msg.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}