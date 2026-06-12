import { useState, useEffect } from "react";
import CustomerDashboard from "./CustomerDashboard";
import SupplierDashboard from "./SupplierDashboard";
import { Icon, Badge, StatCard } from "./components/UI";
import productService from "./services/productService";
import authService from "./services/authService";
import productService from "./services/productService";
import inventoryService from "./services/inventoryService";

// ─── Icons glyphs ───────────────────────────────────────────────────────────
const icons = {
  box: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  truck: "M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM18.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  receipt: "M4 2h16a1 1 0 0 1 1 1v18l-3-2-2 2-2-2-2 2-2-2-3 2V3a1 1 0 0 1 1-1z",
  chart: "M18 20V10M12 20V4M6 20v-6",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35",
  bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
  lock: "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  login: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3",
  plus: "M12 5v14M5 12h14",
  filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  sort: "M3 6h18M7 12h10M11 18h2",
  download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 0-2-2v-4M7 10l5 5 5-5M12 15V3",
  refresh: "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  print: "M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z",
  chevronLeft: "M15 18l-6-6 6-6",
  chevronRight: "M9 18l6-6-6-6",
  moreV: "M12 5v.01M12 12v.01M12 19v.01",
  check: "M20 6L9 17l-5-5",
  alert: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  google: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z",
  sso: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M7 9h10 M7 13h6",
};

// Shared UI components are imported from ./components/UI

const ActionButton = ({ label, icon, variant = "secondary", onClick }) => {
  const isPrimary = variant === "primary";
  return (
    <button
      onClick={onClick}
      style={{
        padding: "9px 16px",
        borderRadius: 8,
        border: isPrimary ? "none" : "1px solid #e5e7eb",
        background: isPrimary ? "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)" : "#fff",
        const ProductsPage = () => {
          const [products, setProducts] = useState([]);
          const [loading, setLoading] = useState(false);
          const [error, setError] = useState(null);

          const load = async () => {
            setError(null);
            setLoading(true);
            try {
              const res = await productService.list();
              setProducts(res);
            } catch (err) {
              setError(err.message || "Failed to load products");
            } finally {
              setLoading(false);
            }
          };

          useEffect(() => {
            load();
          }, []);

          const handleAdd = async () => {
            const name = prompt("Product name:", "New Product");
            if (!name) return;
            const sku = prompt("SKU:", `IP-${Math.floor(Math.random()*9000)+1000}`) || undefined;
            const price = parseFloat(prompt("Price:", "0") || "0");
            const qty = parseInt(prompt("Quantity:", "0") || "0", 10);
            try {
              await productService.create({ sku, name, category: "Uncategorized", price, quantity: qty, status: qty === 0 ? "out_of_stock" : qty < 20 ? "low_stock" : "in_stock" });
              await load();
              alert("Product created");
            } catch (err) {
              alert(err.message || "Failed to create product");
            }
          };

          const handleEdit = async (p) => {
            const name = prompt("Name:", p.name) || p.name;
            const price = parseFloat(prompt("Price:", String(p.price)) || String(p.price));
            const qty = parseInt(prompt("Quantity:", String(p.quantity || 0)) || String(p.quantity || 0), 10);
            try {
              await productService.update(p.id, { name, price, quantity: qty });
              await load();
              alert("Product updated");
            } catch (err) {
              alert(err.message || "Update failed");
            }
          };

          const handleDelete = async (p) => {
            if (!confirm(`Delete product ${p.name}?`)) return;
            try {
              await productService.remove(p.id);
              await load();
              alert("Product deleted");
            } catch (err) {
              alert(err.message || "Delete failed");
            }
          };

          return (
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", background: "#f9fafb" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: "#111827" }}>Product Management</h1>
                  <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: 13 }}>Manage and track your complete inventory in real-time</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={handleAdd} style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontWeight: 700 }}>Add Product</button>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 20 }}>
                <div style={{ background: "linear-gradient(135deg, #fff 0%, #f9fafb 100%)", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 18px" }}>
                  <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 }}>Total Products</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#111827" }}>{products.length}</div>
                </div>
                <div style={{ background: "linear-gradient(135deg, #fff 0%, #f9fafb 100%)", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 18px" }}>
                  <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 }}>Low Stock Items</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#ef4444" }}>{products.filter(p => (p.quantity || 0) > 0 && p.quantity < 20).length}</div>
                </div>
                <div style={{ background: "linear-gradient(135deg, #fff 0%, #f9fafb 100%)", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 18px" }}>
                  <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 }}>Total Value</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#111827" }}>${products.reduce((s,p) => s + (p.price||0)*(p.quantity||0),0).toFixed(2)}</div>
                </div>
                <div style={{ background: "linear-gradient(135deg, #fff 0%, #f9fafb 100%)", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 18px" }}>
                  <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 }}>Out of Stock</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#111827" }}>{products.filter(p => (p.quantity||0)===0).length}</div>
                </div>
              </div>
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }}>
                <div style={{ padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e5e7eb" }}>
                  <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#111827" }}>Inventory</h2>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>{loading ? "Loading..." : `Showing ${products.length} products`}</div>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #e5e7eb", background: "#f9fafb" }}>
                        {["SKU", "Product Name", "Category", "Price", "Stock Level", "Actions"].map(h => (
                          <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: 0.5, textTransform: "uppercase" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p, idx) => (
                        <tr key={p.id} style={{ borderBottom: "1px solid #e5e7eb", transition: "all 0.2s ease", background: idx % 2 === 0 ? "#f9fafb" : "#fff" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#f3f4f6"; }} onMouseLeave={(e) => { e.currentTarget.style.background = idx % 2 === 0 ? "#f9fafb" : "#fff"; }}>
                          <td style={{ padding: "14px 16px", fontWeight: 700, color: "#2563eb", fontSize: 12 }}>{p.sku}</td>
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #e0e7ff 0%, #c7d7fd 100%)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#2563eb", fontWeight: 600, fontSize: 12 }}>
                                {p.sku ? p.sku.slice(0, 1) : "#"}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, color: "#111827" }}>{p.name}</div>
                                <div style={{ fontSize: 12, color: "#9ca3af" }}>{p.category}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "14px 16px", color: "#6b7280" }}>{p.category}</td>
                          <td style={{ padding: "14px 16px", fontWeight: 700, color: "#111827" }}>${(p.price||0).toFixed(2)}</td>
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ width: 40, height: 6, background: "#e5e7eb", borderRadius: 3, overflow: "hidden" }}>
                                <div style={{ height: "100%", background: p.quantity === 0 ? "#ef4444" : p.quantity < 20 ? "#f59e0b" : "#2563eb", width: `${Math.min(100, (p.quantity||0))}%`, borderRadius: 3, transition: "width 0.3s ease" }} />
                              </div>
                              <Badge color={p.quantity === 0 ? "red" : p.quantity < 20 ? "yellow" : "green"}>{p.quantity === 0 ? "OUT OF STOCK" : p.quantity < 20 ? "LOW STOCK" : "IN STOCK"}</Badge>
                            </div>
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ display: "flex", gap: 8 }}>
                              <button onClick={() => handleEdit(p)} style={{ padding: "6px 12px", border: "1px solid #e5e7eb", borderRadius: 6, background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#2563eb", transition: "all 0.2s ease" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#eff6ff"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}>Edit</button>
                              <button onClick={() => handleDelete(p)} style={{ padding: "6px 12px", border: "1px solid #fde2e2", borderRadius: 6, background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#ef4444" }}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #e5e7eb", background: "#f9fafb" }}>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>Page 1</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[icons.chevronLeft, "1", "2", "3", icons.chevronRight].map((item, i) => (
                      <button key={i} style={{ width: 32, height: 32, border: "1px solid #e5e7eb", borderRadius: 6, background: i === 1 ? "#2563eb" : "#fff", color: i === 1 ? "#fff" : "#6b7280", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 13, transition: "all 0.2s ease" }} onMouseEnter={(e) => { if (i !== 1) { e.currentTarget.style.borderColor = "#d1d5db"; } }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; }}>
                        {renderPaginationItem(item, i)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        };
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>IP</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>Inventory Pro</div>
            <div style={{ fontSize: 10, color: "#9ca3af" }}>{roleSubtitle}</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

const TopBar = ({ title, actions = [] }) => (
  <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "14px 24px", borderBottom: "1px solid #e5e7eb", background: "#fff", flexShrink: 0, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }}>
    <span style={{ fontWeight: 800, color: "#111827", fontSize: 14 }}>{title || "Inventory Pro"}</span>
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      {actions.map((action, index) => (
        <ActionButton key={index} label={action.label} icon={action.icon} variant={action.variant || "secondary"} onClick={action.onClick} />
      ))}
      <ActionButton label="Export" icon={<Icon d={icons.download} size={14} />} variant="secondary" onClick={() => console.log("Export action")}/>
      <ActionButton label="Refresh" icon={<Icon d={icons.refresh} size={14} stroke="#fff" />} variant="primary" onClick={() => console.log("Refresh action")}/>
    </div>
  </header>
);

const renderPaginationItem = (item, index) => {
  const isChevron = item === icons.chevronLeft || item === icons.chevronRight;
  if (isChevron) {
    return <Icon d={item} size={14} stroke={index === 1 ? "#fff" : "#6b7280"} />;
  }
  return item;
};

// ─── Pages ────────────────────────────────────────────────────────────────────
const LoginPage = ({ onLogin }) => {
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [identifier, setIdentifier] = useState("admin@demo.local");
  const [password, setPassword] = useState("adminpass");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const token = await authService.login(identifier, password);
      // token contains role and user info
      onLogin(token.role, token.role === "admin" ? "dashboard" : token.role, remember);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(145deg,#e8eeff 0%,#f5f7ff 60%,#edf2ff 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "inherit", padding: 24 }}>
      <div style={{ marginBottom: 24, textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 8px 22px rgba(37, 99, 235, 0.18)" }}>
          <Icon d={icons.grid} size={30} stroke="#fff" strokeWidth={1.5} />
        </div>
        <div style={{ display: "inline-block", marginBottom: 8 }}>
          <div style={{ fontWeight: 800, fontSize: 24, color: "#1a1a2e", letterSpacing: 0.2 }}>Inventory Pro</div>
          <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>demo_v3</div>
        </div>
        <p style={{ margin: "8px 0 0", color: "#666", fontSize: 14 }}>Choose your portal and keep the demo flow smooth.</p>
      </div>
      <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 4px 40px rgba(37,99,235,0.08)", padding: "36px 32px", width: "100%", maxWidth: 380 }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#bbb" }}><Icon d={icons.mail} size={15} /></span>
            <input value={identifier} onChange={e => setIdentifier(e.target.value)} placeholder="email or username" style={{ width: "100%", padding: "11px 12px 11px 38px", borderRadius: 10, border: "1px solid #e0e0e0", fontSize: 13, boxSizing: "border-box", outline: "none" }} />
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>Password</label>
            <a href="#" style={{ fontSize: 13, color: "#2563eb", textDecoration: "none" }}>Forgot password?</a>
          </div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#bbb" }}><Icon d={icons.lock} size={15} /></span>
            <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} style={{ width: "100%", padding: "11px 38px 11px 38px", borderRadius: 10, border: "1px solid #e0e0e0", fontSize: 13, boxSizing: "border-box", outline: "none" }} />
            <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#aaa" }}><Icon d={icons.eye} size={16} /></button>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <input type="checkbox" id="rem" checked={remember} onChange={e => setRemember(e.target.checked)} style={{ width: 15, height: 15, accentColor: "#2563eb" }} />
          <label htmlFor="rem" style={{ fontSize: 13, color: "#555" }}>Remember me on this device</label>
        </div>
        {error && <div style={{ color: "#ef4444", marginBottom: 10 }}>{error}</div>}
        <div style={{ display: "grid", gap: 8 }}>
          <button onClick={handleSignIn} disabled={loading} style={{ width: "100%", padding: "13px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Signing in..." : "Sign In"} <Icon d={icons.login} size={16} stroke="#fff" />
          </button>
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            <button onClick={() => { setIdentifier("customer@demo.local"); setPassword("custpass"); setRemember(true); handleSignIn(); }} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontWeight: 700 }}>Customer Portal</button>
            <button onClick={() => { setIdentifier("supplier@demo.local"); setPassword("suppass"); setRemember(true); handleSignIn(); }} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontWeight: 700 }}>Supplier Portal</button>
          </div>
        </div>

      </div>

    </div>
  );
};

const DashboardPage = () => {
  const barHeights = [55, 40, 65, 85, 60, 70, 90];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const rows = [
    { id: "#TX-94021", name: "MacBook Pro M3", date: "Oct 24, 2023 · 14:20", qty: "12 Units", status: "In Stock", statusColor: "green", amount: "$24,400.00" },
    { id: "#TX-94020", name: "Magic Keyboard", date: "Oct 24, 2023 · 12:45", qty: "2 Units", status: "Low Stock", statusColor: "yellow", amount: "$298.00" },
    { id: "#TX-94019", name: "AirPods Pro", date: "Oct 23, 2023 · 09:11", qty: "5 Units", status: "In Stock", statusColor: "green", amount: "$1,245.00" },
  ];
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", background: "#f9fafb" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: "#111827" }}>Dashboard Overview</h1>
          <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: 13 }}>Real-time inventory status and key metrics</p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, marginBottom: 20 }}>
        <StatCard icon={<Icon d={icons.box} size={18} />} label="Total Products" value="2,450" sub="↑ +4%" subColor="#10b981" />
        <StatCard icon={<Icon d={icons.check} size={18} />} label="Available Stock" value="1,890" sub="Updated 2m ago" subColor="#6b7280" />
        <StatCard icon={<Icon d={icons.alert} size={18} stroke="#dc2626" />} label="Low Stock Items" value="12" sub="↑ +2" subColor="#dc2626" highlight />
        <StatCard icon={<Icon d={icons.receipt} size={18} />} label="Daily Sales" value="$4,200" sub="↑ 12.5%" subColor="#10b981" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 20 }}>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)", transition: "all 0.3s ease" }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)"; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)"; }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#111827" }}>Stock Analytics</h2>
              <div style={{ marginTop: 6, fontSize: 12, color: "#6b7280" }}>Fake inventory trend for demo presentations</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ padding: "6px 12px", border: "1px solid #e5e7eb", borderRadius: 6, background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#6b7280", transition: "all 0.2s ease" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#d1d5db"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; }}>Last 7 Days</button>
              <button style={{ padding: "6px 12px", border: "1px solid #e5e7eb", borderRadius: 6, background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#6b7280", transition: "all 0.2s ease" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#d1d5db"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; }}>Monthly</button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: 18, alignItems: "end" }}>
            <div style={{ position: "relative", minHeight: 240, padding: "8px 0 0" }}>
              <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateRows: "repeat(4, 1fr)", rowGap: 0 }}>
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} style={{ borderTop: "1px solid #eef2ff" }} />
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: 220, padding: "0 8px", position: "relative" }}>
                {barHeights.map((value, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                    <div style={{ width: "100%", minHeight: 18, position: "relative", borderRadius: 999, background: "#eff6ff", overflow: "hidden", boxShadow: "inset 0 1px 2px rgba(15, 23, 42, 0.06)" }}>
                      <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: `${value}%`, background: i === 6 ? "linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%)" : "linear-gradient(180deg, #93c5fd 0%, #60a5fa 100%)", borderRadius: "999px", transition: "all 0.2s ease" }} />
                    </div>
                    <span style={{ fontSize: 11, color: "#111827", fontWeight: 700 }}>{value}%</span>
                    <span style={{ fontSize: 12, color: "#9ca3af" }}>{days[i]}</span>
                  </div>
                ))}
                <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, pointerEvents: "none" }}>
                  <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", top: 0, left: 0 }}>
                    <polyline fill="none" stroke="#2563eb" strokeWidth="1.5" strokeLinejoin="round" points="0,70 16,50 33,62 50,32 66,44 83,36 100,20" />
                  </svg>
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              {[
                { label: "Current Stock", value: "72%", note: "Balanced supply", color: "#2563eb" },
                { label: "Forecast", value: "+8%", note: "Expected growth", color: "#10b981" },
                { label: "Restock Due", value: "2 days", note: "Next replenishment", color: "#f59e0b" },
              ].map((item, idx) => (
                <div key={idx} style={{ background: "#f8fafc", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>{item.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: item.color }}>{item.value}</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{item.note}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6b7280" }}>
            <span>Trend: Balanced stock flow</span>
            <span>Peak stock forecast for Fri</span>
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }}>
          <h2 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 800, color: "#111827" }}>Inventory Health</h2>
          {[
            { pct: "82%", label: "Turnover Rate", sub: "Optimal", color: "#10b981" },
            { pct: "15%", label: "Slow Moving", sub: "Seasonal", color: "#f59e0b" },
            { pct: "3%", label: "Expired/Damaged", sub: "Action needed", color: "#ef4444" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: `conic-gradient(${item.color} ${item.pct.replace("%", "")}deg, #f3f4f6 0deg)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#111827", flexShrink: 0, boxShadow: `0 0 0 2px ${item.color}20` }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: item.color }}>{item.pct}</span>
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>{item.label}</div>
                <div style={{ fontSize: 12, color: "#9ca3af" }}>{item.sub}</div>
              </div>
            </div>
          ))}
          <button style={{ width: "100%", padding: "10px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#f9fafb", cursor: "pointer", fontWeight: 600, fontSize: 13, color: "#6b7280", transition: "all 0.2s ease", marginTop: 4 }} onMouseEnter={(e) => { e.currentTarget.style.background = "#f3f4f6"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "#f9fafb"; }}>View Audit</button>
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#111827" }}>Recent Activity</h2>
          <a href="#" style={{ fontSize: 13, color: "#2563eb", fontWeight: 600, textDecoration: "none", transition: "color 0.2s ease" }} onMouseEnter={(e) => e.target.style.color = "#1d4ed8"} onMouseLeave={(e) => e.target.style.color = "#2563eb"}>View All →</a>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                {["Transaction ID", "Product Name", "Date/Time", "Quantity", "Status", "Amount"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "12px", fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: 0.5, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row.id} style={{ borderBottom: "1px solid #e5e7eb", transition: "all 0.2s ease", background: idx % 2 === 0 ? "#f9fafb" : "#fff" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#f3f4f6"; }} onMouseLeave={(e) => { e.currentTarget.style.background = idx % 2 === 0 ? "#f9fafb" : "#fff"; }}>
                  <td style={{ padding: "12px", color: "#2563eb", fontWeight: 600 }}>{row.id}</td>
                  <td style={{ padding: "12px", fontWeight: 500 }}>{row.name}</td>
                  <td style={{ padding: "12px", color: "#6b7280" }}>{row.date}</td>
                  <td style={{ padding: "12px" }}>{row.qty}</td>
                  <td style={{ padding: "12px" }}><Badge color={row.statusColor}>{row.status}</Badge></td>
                  <td style={{ padding: "12px", fontWeight: 700 }}>{row.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ totalProducts: 0, totalStock: 0, lowStockCount: 0, outOfStockCount: 0 });

  const load = async () => {
    setError(null);
    setLoading(true);
    try {
      const list = await productService.list();
      setProducts(list || []);
      const t = await inventoryService.totals();
      setStats(t);
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await productService.remove(id);
      await load();
    } catch (err) {
      alert(err.message || "Failed to delete");
    }
  };

  const handleEdit = async (p) => {
    try {
      const qty = parseInt(prompt("New quantity:", String(p.quantity || 0)), 10);
      if (Number.isNaN(qty)) return;
      await productService.update(p.id, { quantity: qty });
      await load();
    } catch (err) {
      alert(err.message || "Failed to update");
    }
  };

  const handleAdd = async () => {
    try {
      const name = prompt("Product name:");
      if (!name) return;
      const sku = prompt("SKU:", `SKU-${Math.random().toString(36).slice(2,6).toUpperCase()}`) || "";
      const category = prompt("Category:", "General") || "General";
      const price = parseFloat(prompt("Price (number):", "0")) || 0;
      const quantity = parseInt(prompt("Quantity:", "0"), 10) || 0;
      await productService.create({ sku, name, category, price, quantity, supplierId: null, status: quantity === 0 ? "out_of_stock" : quantity < 20 ? "low_stock" : "in_stock" });
      await load();
    } catch (err) {
      alert(err.message || "Failed to create product");
    }
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", background: "#f9fafb" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: "#111827" }}>Product Management</h1>
          <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: 13 }}>Manage and track your complete inventory in real-time</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleAdd} style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontWeight: 700 }}>Add Product</button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 20 }}>
        <div style={{ background: "linear-gradient(135deg, #fff 0%, #f9fafb 100%)", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>Total Products</div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>{stats.totalProducts}</div>
        </div>
        <div style={{ background: "linear-gradient(135deg, #fff 0%, #f9fafb 100%)", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>Low Stock Items</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#ef4444" }}>{stats.lowStockCount}</div>
        </div>
        <div style={{ background: "linear-gradient(135deg, #fff 0%, #f9fafb 100%)", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>Total Stock</div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>{stats.totalStock}</div>
        </div>
        <div style={{ background: "linear-gradient(135deg, #fff 0%, #f9fafb 100%)", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>Out of Stock</div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>{stats.outOfStockCount}</div>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }}>
        <div style={{ padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e5e7eb" }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#111827" }}>Inventory</h2>
          <div style={{ fontSize: 12, color: "#9ca3af" }}>{loading ? "Loading..." : `Showing ${products.length} products`}</div>
        </div>
        <div style={{ overflowX: "auto" }}>
          {error && <div style={{ padding: 12, color: "#ef4444" }}>{error}</div>}
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e5e7eb", background: "#f9fafb" }}>
                {["SKU", "Product Name", "Category", "Price", "Stock Level", "Actions"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: 0.5, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, idx) => {
                const stockLabel = (p.quantity || 0) === 0 ? "OUT OF STOCK" : (p.quantity || 0) < 20 ? "LOW STOCK" : "IN STOCK";
                const stockColor = stockLabel === "OUT OF STOCK" ? "red" : stockLabel === "LOW STOCK" ? "yellow" : "green";
                const barColor = stockColor === "red" ? "#ef4444" : stockColor === "yellow" ? "#f59e0b" : "#2563eb";
                return (
                  <tr key={p.id} style={{ borderBottom: "1px solid #e5e7eb", transition: "all 0.2s ease", background: idx % 2 === 0 ? "#f9fafb" : "#fff" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#f3f4f6"; }} onMouseLeave={(e) => { e.currentTarget.style.background = idx % 2 === 0 ? "#f9fafb" : "#fff"; }}>
                    <td style={{ padding: "14px 16px", fontWeight: 700, color: "#2563eb", fontSize: 12 }}>{p.sku || "-"}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #e0e7ff 0%, #c7d7fd 100%)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#2563eb", fontWeight: 600, fontSize: 12 }}>
                          {p.sku ? p.sku.slice(0, 1) : "P"}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: "#111827" }}>{p.name}</div>
                          <div style={{ fontSize: 12, color: "#9ca3af" }}>{p.category}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", color: "#6b7280" }}>{p.category}</td>
                    <td style={{ padding: "14px 16px", fontWeight: 700, color: "#111827" }}>${(p.price || 0).toFixed(2)}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 40, height: 6, background: "#e5e7eb", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ height: "100%", background: barColor, width: (p.quantity === 0 ? 5 : p.quantity < 20 ? 30 : 80) + "%", borderRadius: 3, transition: "width 0.3s ease" }} />
                        </div>
                        <Badge color={stockColor}>{stockLabel}</Badge>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <button onClick={() => handleEdit(p)} style={{ padding: "6px 12px", border: "1px solid #e5e7eb", borderRadius: 6, background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#2563eb", transition: "all 0.2s ease", marginRight: 8 }} onMouseEnter={(e) => { e.currentTarget.style.background = "#eff6ff"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}>Edit</button>
                      <button onClick={() => handleDelete(p.id)} style={{ padding: "6px 12px", border: "1px solid #fdecea", borderRadius: 6, background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#b91c1c", transition: "all 0.2s ease" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#fff5f5"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #e5e7eb", background: "#f9fafb" }}>
          <span style={{ fontSize: 12, color: "#6b7280" }}>Page 1</span>
          <div style={{ display: "flex", gap: 4 }}>
            {[icons.chevronLeft, "1", "2", "3", icons.chevronRight].map((item, i) => (
              <button key={i} style={{ width: 32, height: 32, border: "1px solid #e5e7eb", borderRadius: 6, background: i === 1 ? "#2563eb" : "#fff", color: i === 1 ? "#fff" : "#6b7280", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 13, transition: "all 0.2s ease" }} onMouseEnter={(e) => { if (i !== 1) { e.currentTarget.style.borderColor = "#d1d5db"; } }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; }}>
                {renderPaginationItem(item, i)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SuppliersPage = () => {
  const suppliers = [
    { abbr: "AN", name: "Ankit Neupane", category: "Electronics", contact: "Ankit Neupane", phone: "+977 9801 123456", email: "ankit.neupane@gmail.com", status: "ACTIVE", statusColor: "green" },
    { abbr: "SJ", name: "Sujal", category: "Office Supplies", contact: "Sujal", phone: "+977 9814 234567", email: "sujal@gmail.com", status: "ACTIVE", statusColor: "green" },
    { abbr: "GV", name: "Govind", category: "Accessories", contact: "Govind", phone: "+977 9823 345678", email: "govind@gmail.com", status: "LOW STOCK", statusColor: "yellow" },
    { abbr: "SD", name: "Sadveek", category: "Hardware", contact: "Sadveek", phone: "+977 9845 456789", email: "sadveek@gmail.com", status: "SUSPENDED", statusColor: "red" },
  ];
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", background: "#f9fafb" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: "#111827" }}>Supplier Directory</h1>
          <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: 13 }}>Manage and monitor your global network of wholesale partners</p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Total Suppliers", value: "124", sub: "+4 this month", subColor: "#2563eb" },
          { label: "Active Partners", value: "118", sub: "↑ 98%", subColor: "#10b981" },
          { label: "Pending Orders", value: "6", sub: "Needs review", subColor: "#f59e0b" },
          { label: "Categories", value: "12", sub: null },
        ].map((s, i) => (
          <div key={i} style={{ background: "linear-gradient(135deg, #fff 0%, #f9fafb 100%)", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 18px", transition: "all 0.3s ease", cursor: "pointer", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}>
            <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#111827" }}>{s.value}</div>
            {s.sub && <div style={{ fontSize: 12, color: s.subColor, fontWeight: 600, marginTop: 4 }}>{s.sub}</div>}
          </div>
        ))}
      </div>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }}>
        <div style={{ padding: 20, borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#111827" }}>Suppliers</h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e5e7eb", background: "#f9fafb" }}>
                {["Company Name", "Category", "Contact Person", "Phone Number", "Email Address", "Status"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: 0.5, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s, idx) => (
                <tr key={s.abbr} style={{ borderBottom: "1px solid #e5e7eb", transition: "all 0.2s ease", background: idx % 2 === 0 ? "#f9fafb" : "#fff" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#f3f4f6"; }} onMouseLeave={(e) => { e.currentTarget.style.background = idx % 2 === 0 ? "#f9fafb" : "#fff"; }}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #e0e7ff 0%, #c7d7fd 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#2563eb" }}>{s.abbr}</div>
                      <span style={{ fontWeight: 600, color: "#111827" }}>{s.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", color: "#6b7280" }}>{s.category}</td>
                  <td style={{ padding: "14px 16px", color: "#6b7280" }}>{s.contact}</td>
                  <td style={{ padding: "14px 16px", color: "#6b7280", fontSize: 12 }}>{s.phone}</td>
                  <td style={{ padding: "14px 16px", color: "#6b7280", fontSize: 12 }}>{s.email}</td>
                  <td style={{ padding: "14px 16px" }}><Badge color={s.statusColor}>{s.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #e5e7eb", background: "#f9fafb" }}>
          <span style={{ fontSize: 12, color: "#6b7280" }}>Showing 1 to 10 of 124 suppliers</span>
          <div style={{ display: "flex", gap: 4 }}>
            {[icons.chevronLeft, "1", "2", "3", "...", "13", icons.chevronRight].map((item, i) => (
              <button key={i} style={{ minWidth: 32, height: 32, border: "1px solid #e5e7eb", borderRadius: 6, background: i === 1 ? "#2563eb" : "#fff", color: i === 1 ? "#fff" : "#6b7280", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 12, padding: "0 8px", transition: "all 0.2s ease" }} onMouseEnter={(e) => { if (i !== 1) { e.currentTarget.style.borderColor = "#d1d5db"; } }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; }}>
                {renderPaginationItem(item, i)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SalesPage = () => {
  const rows = [
    { id: "#TRX-82910", avatar: "AS", name: "Aarav Shrestha", date: "Oct 24, 2023 • 14:22", amount: "$1,240.00", status: "Completed", statusColor: "green" },
    { id: "#TRX-82909", avatar: "PK", name: "Priya Koirala", date: "Oct 24, 2023 • 12:45", amount: "$45.90", status: "Pending", statusColor: "yellow" },
    { id: "#TRX-82908", avatar: "NR", name: "Nischal Rai", date: "Oct 23, 2023 • 18:10", amount: "$3,102.50", status: "Completed", statusColor: "green" },
    { id: "#TRX-82907", avatar: "MG", name: "Mira Gautam", date: "Oct 23, 2023 • 15:30", amount: "$12.00", status: "Refunded", statusColor: "red" },
    { id: "#TRX-82906", avatar: "ST", name: "Sandeep Thapa", date: "Oct 23, 2023 • 09:12", amount: "$540.00", status: "Completed", statusColor: "green" },
  ];
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", background: "#f9fafb" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: "#111827" }}>Sales Records</h1>
          <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: 13 }}>Track and analyze every transaction in real-time</p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Total Revenue", value: "$124,592.00", sub: "↑ +12.5%", subColor: "#10b981" },
          { label: "Total Orders", value: "1,284", sub: "↑ +8.2%", subColor: "#10b981" },
          { label: "Avg. Order Value", value: "$97.03", sub: "↓ -2.1%", subColor: "#ef4444" },
          { label: "Return Rate", value: "0.42%", sub: "Stable", subColor: "#6b7280" },
        ].map((s, i) => (
          <div key={i} style={{ background: "linear-gradient(135deg, #fff 0%, #f9fafb 100%)", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 18px", transition: "all 0.3s ease", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}>
            <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: s.subColor, fontWeight: 600 }}>
              {s.sub.includes("↑") ? "↑" : s.sub.includes("↓") ? "↓" : ""} {s.sub.replace(/[↑↓]/g, "")}
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }}>
        <div style={{ padding: 20, borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#111827" }}>Transaction History</h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e5e7eb", background: "#f9fafb" }}>
                {["Transaction ID", "Customer", "Date", "Total Amount", "Status", "Actions"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: 0.5, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row.id} style={{ borderBottom: "1px solid #e5e7eb", transition: "all 0.2s ease", background: idx % 2 === 0 ? "#f9fafb" : "#fff" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#f3f4f6"; }} onMouseLeave={(e) => { e.currentTarget.style.background = idx % 2 === 0 ? "#f9fafb" : "#fff"; }}>
                  <td style={{ padding: "14px 16px", color: "#2563eb", fontWeight: 700 }}>{row.id}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #e0e7ff 0%, #c7d7fd 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#2563eb" }}>{row.avatar}</div>
                      <span style={{ fontWeight: 500, color: "#111827" }}>{row.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", color: "#6b7280", fontSize: 12 }}>{row.date}</td>
                  <td style={{ padding: "14px 16px", fontWeight: 700, color: "#111827" }}>{row.amount}</td>
                  <td style={{ padding: "14px 16px" }}><Badge color={row.statusColor}>{row.status}</Badge></td>
                  <td style={{ padding: "14px 16px" }}>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: "#d1d5db", fontSize: 18, padding: 0, transition: "color 0.2s ease" }} onMouseEnter={(e) => e.target.style.color = "#6b7280"} onMouseLeave={(e) => e.target.style.color = "#d1d5db"}>⋮</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #e5e7eb", background: "#f9fafb" }}>
          <span style={{ fontSize: 12, color: "#6b7280" }}>Showing 1–10 of 1,284 results</span>
          <div style={{ display: "flex", gap: 4 }}>
            {[icons.chevronLeft, "1", "2", "3", icons.chevronRight].map((item, i) => (
              <button key={i} style={{ width: 32, height: 32, border: "1px solid #e5e7eb", borderRadius: 6, background: i === 1 ? "#2563eb" : "#fff", color: i === 1 ? "#fff" : "#6b7280", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 13, transition: "all 0.2s ease" }} onMouseEnter={(e) => { if (i !== 1) { e.currentTarget.style.borderColor = "#d1d5db"; } }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; }}>
                {renderPaginationItem(item, i)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportsPage = () => {
  const categories = [
    { name: "Electronics", value: "$120.4k", pct: 100 },
    { name: "Home & Garden", value: "$94.2k", pct: 78 },
    { name: "Automotive", value: "$72.1k", pct: 60 },
    { name: "Office Supplies", value: "$48.8k", pct: 40 },
  ];
  const barData = [
    { label: "ALPHA", h: 80 }, { label: "BETA", h: 100 }, { label: "GAMMA", h: 55 }, { label: "DELTA", h: 70 },
  ];
  const rows = [
    { sku: "EL-TV-85-001", sub: 'Quantum 85" Smart TV', cat: "Electronics", open: 142, sold: 84, soldColor: "#2563eb", status: "In Stock", statusColor: "green", val: "$124,500.00" },
    { sku: "HG-CHR-ERGO-9", sub: "Executive Ergonomic Chair", cat: "Home & Office", open: 85, sold: 72, soldColor: "#2563eb", status: "Low Stock", statusColor: "yellow", val: "$21,600.00" },
  ];
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", background: "#f9fafb" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: "#111827" }}>Reports & Analytics</h1>
          <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: 13 }}>comprehensive operational performance reports</p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Total Sales Revenue", value: "$284,592.00", sub: "+12.4%", subColor: "#10b981" },
          { label: "Stock Turnover Rate", value: "4.8x / Year", sub: "-3.2%", subColor: "#ef4444" },
          { label: "Avg. Lead Time", value: "5.2 Days", sub: "Optimal", subColor: "#2563eb" },
          { label: "Low Stock Alerts", value: "14 SKUs", sub: null, alert: true },
        ].map((s, i) => (
          <div key={i} style={{ background: s.alert ? "linear-gradient(135deg, #fff5f5 0%, #fffbf9 100%)" : "linear-gradient(135deg, #fff 0%, #f9fafb 100%)", border: `1px solid ${s.alert ? "#fee2e2" : "#e5e7eb"}`, borderRadius: 12, padding: "16px 18px", transition: "all 0.3s ease", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}>
            <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 4 }}>{s.value}</div>
            {s.sub && <div style={{ fontSize: 12, color: s.subColor, fontWeight: 600, background: s.subColor === "#2563eb" ? "#eff6ff" : "transparent", padding: s.subColor === "#2563eb" ? "3px 8px" : 0, borderRadius: 4, display: "inline-block" }}>
              {s.sub.includes("+") ? "+" : ""}{s.sub}
            </div>}
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 20 }}>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#111827" }}>Top Selling Categories</h2>
          </div>
          {categories.map(c => (
            <div key={c.name} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                <span style={{ fontWeight: 600, color: "#111827" }}>{c.name}</span>
                <span style={{ fontWeight: 700, color: "#2563eb" }}>{c.value}</span>
              </div>
              <div style={{ height: 8, background: "#e5e7eb", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${c.pct}%`, background: "linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)", borderRadius: 4, transition: "width 0.3s ease" }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }}>
          <h2 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 800, color: "#111827" }}>Supplier Lead Times</h2>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 140, marginBottom: 16 }}>
            {barData.map((b, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ width: "100%", height: `${b.h}%`, background: i === 2 ? "linear-gradient(180deg, #c7d7fd 0%, #a5b4fc 100%)" : "linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%)", borderRadius: "6px 6px 0 0", transition: "all 0.2s ease" }} onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.8"; }} onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }} />
                <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>{b.label}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 12, display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span style={{ color: "#6b7280" }}>Industry Benchmark</span>
            <span style={{ fontWeight: 800, color: "#111827" }}>6.0 Days</span>
          </div>
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }}>
        <div style={{ padding: 20, borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#111827" }}>Inventory Movement Details</h2>
          <a href="#" style={{ fontSize: 13, color: "#2563eb", fontWeight: 600, textDecoration: "none", transition: "color 0.2s ease" }} onMouseEnter={(e) => e.target.style.color = "#1d4ed8"} onMouseLeave={(e) => e.target.style.color = "#2563eb"}>View Full History →</a>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e5e7eb", background: "#f9fafb" }}>
                {["Product SKU", "Category", "Opening Stock", "Units Sold", "Reorder Status", "Valuation"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: 0.5, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={r.sku} style={{ borderBottom: "1px solid #e5e7eb", transition: "all 0.2s ease", background: idx % 2 === 0 ? "#f9fafb" : "#fff" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#f3f4f6"; }} onMouseLeave={(e) => { e.currentTarget.style.background = idx % 2 === 0 ? "#f9fafb" : "#fff"; }}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontWeight: 700, color: "#111827" }}>{r.sku}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>{r.sub}</div>
                  </td>
                  <td style={{ padding: "14px 16px", color: "#6b7280" }}>{r.cat}</td>
                  <td style={{ padding: "14px 16px", fontWeight: 600, color: "#111827" }}>{r.open}</td>
                  <td style={{ padding: "14px 16px", fontWeight: 800, color: r.soldColor, fontSize: 15 }}>{r.sold}</td>
                  <td style={{ padding: "14px 16px" }}><Badge color={r.statusColor}>{r.status}</Badge></td>
                  <td style={{ padding: "14px 16px", fontWeight: 700, color: "#111827" }}>{r.val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── Role-specific placeholder pages ─────────────────────────────────────────
const PurchaseHistoryPage = () => (
  <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", background: "#f9fafb" }}>
    <h1 style={{ fontSize: 22, fontWeight: 800 }}>Purchase History</h1>
    <p style={{ color: "#6b7280" }}>All purchases made by the customer.</p>
    <div style={{ marginTop: 12, background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #e5e7eb" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", color: "#9ca3af" }}><th style={{ padding: 8 }}>Order</th><th>Item</th><th>Date</th><th>Total</th></tr>
        </thead>
        <tbody>
          <tr><td style={{ padding: 8 }}>#ORD-1001</td><td>Wireless Keyboard Pro</td><td>May 12, 2024</td><td>$129.00</td></tr>
          <tr style={{ background: "#f9fafb" }}><td style={{ padding: 8 }}>#ORD-1002</td><td>Ergonomic Office Chair</td><td>May 09, 2024</td><td>$499.98</td></tr>
        </tbody>
      </table>
    </div>
  </div>
);

const RecentPurchasesPage = () => (
  <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", background: "#f9fafb" }}>
    <h1 style={{ fontSize: 22, fontWeight: 800 }}>Recent Purchases</h1>
    <p style={{ color: "#6b7280" }}>Quick view of your latest orders.</p>
    <div style={{ marginTop: 12 }}>
      <ul style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>
        <li style={{ padding: 8 }}>#ORD-1001 — Wireless Keyboard Pro — Delivered</li>
        <li style={{ padding: 8 }}>#ORD-1002 — Ergonomic Office Chair — Shipped</li>
      </ul>
    </div>
  </div>
);

const SuppliedProductsPage = () => (
  <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", background: "#f9fafb" }}>
    <h1 style={{ fontSize: 22, fontWeight: 800 }}>Supplied Products</h1>
    <p style={{ color: "#6b7280" }}>Products you currently supply.</p>
    <div style={{ marginTop: 12, background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #e5e7eb" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", color: "#9ca3af" }}><th style={{ padding: 8 }}>Product</th><th>Current</th><th>Minimum</th><th>Last Delivery</th></tr>
        </thead>
        <tbody>
          <tr><td style={{ padding: 8 }}>Ergonomic Office Chair</td><td>120</td><td>40</td><td>Apr 10, 2024</td></tr>
          <tr style={{ background: "#f9fafb" }}><td style={{ padding: 8 }}>Wireless Keyboard Pro</td><td>18</td><td>20</td><td>May 02, 2024</td></tr>
        </tbody>
      </table>
    </div>
  </div>
);

const RestockRequestsPage = () => (
  <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", background: "#f9fafb" }}>
    <h1 style={{ fontSize: 22, fontWeight: 800 }}>Restock Requests</h1>
    <p style={{ color: "#6b7280" }}>View and manage restock requests.</p>
    <div style={{ marginTop: 12 }}>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>
        <div style={{ padding: 8, borderBottom: "1px dashed #eef2ff" }}>RS-9001 — Wireless Keyboard Pro — Qty 200 — Pending</div>
        <div style={{ padding: 8 }}>RS-9000 — Ergonomic Office Chair — Qty 50 — Completed</div>
      </div>
    </div>
  </div>
);

const SupplyHistoryPage = () => (
  <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", background: "#f9fafb" }}>
    <h1 style={{ fontSize: 22, fontWeight: 800 }}>Supply History</h1>
    <p style={{ color: "#6b7280" }}>Past deliveries and restocks.</p>
    <div style={{ marginTop: 12 }}>
      <ul style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>
        <li style={{ padding: 8 }}>RS-9000 — Ergonomic Office Chair — Completed — Apr 08, 2024</li>
        <li style={{ padding: 8 }}>RS-8999 — Smart Lighting Kit — Completed — Mar 12, 2024</li>
      </ul>
    </div>
  </div>
);

const ProfilePage = ({ role }) => (
  <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", background: "#f9fafb" }}>
    <h1 style={{ fontSize: 22, fontWeight: 800 }}>Profile</h1>
    <p style={{ color: "#6b7280" }}>Basic account information for the current user.</p>
    <div style={{ marginTop: 12, background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #e5e7eb" }}>
      <div style={{ fontWeight: 800 }}>Inventory Pro</div>
      <div style={{ color: "#6b7280", marginTop: 6 }}>Role: {role || "Guest"}</div>
    </div>
  </div>
);

// removed inline customer and supplier dashboards - now in separate files

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("login");
  const [role, setRole] = useState(null);
  const [rememberSession, setRememberSession] = useState(false);

  const allowedPages = {
    admin: ["dashboard", "products", "suppliers", "sales", "reports", "profile"],
    customer: ["customer", "dashboard", "products", "purchase_history", "recent_purchases", "profile"],
    supplier: ["supplier", "dashboard", "supplied_products", "restock_requests", "supply_history", "profile"],
  };

  const getDefaultPage = (role) => {
    if (role === "customer") return "customer";
    if (role === "supplier") return "supplier";
    return "dashboard";
  };

  const isAllowedPage = (target, roleName) => {
    return roleName && allowedPages[roleName]?.includes(target);
  };

  const getSafePage = (target, roleName) => {
    if (!roleName) return "login";
    return isAllowedPage(target, roleName) ? target : getDefaultPage(roleName);
  };

  const handleLogin = (roleName, startPage, remember) => {
    setRole(roleName);
    setPage(getSafePage(startPage, roleName));
    setRememberSession(remember);
    if (remember) {
      const payload = JSON.stringify({ role: roleName, page: getSafePage(startPage, roleName) });
      localStorage.setItem("inventoryAuth", payload);
    } else {
      localStorage.removeItem("inventoryAuth");
    }
  };

  const handleLogout = () => {
    setRole(null);
    setPage("login");
    setRememberSession(false);
    localStorage.removeItem("inventoryAuth");
  };

  useEffect(() => {
    const saved = localStorage.getItem("inventoryAuth");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.role) {
          setRole(parsed.role);
          setPage(getSafePage(parsed.page || getDefaultPage(parsed.role), parsed.role));
          setRememberSession(true);
        }
      } catch (error) {
        localStorage.removeItem("inventoryAuth");
      }
    }
  }, []);

  useEffect(() => {
    if (role && rememberSession) {
      localStorage.setItem("inventoryAuth", JSON.stringify({ role, page }));
    }
  }, [role, page, rememberSession]);

  const setPageAuthorized = (target) => {
    if (!role) {
      if (target === "login") setPage(target);
      return;
    }
    setPage(getSafePage(target, role));
  };

  if (page === "login") {
    return (
      <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <LoginPage onLogin={handleLogin} />
      </div>
    );
  }

  const pageActions = {
    dashboard: [],
    customer: [
      { label: "My Orders", onClick: () => console.log("My Orders") },
      { label: "Account", onClick: () => console.log("Account") },
    ],
    supplier: [
      { label: "Restock Requests", onClick: () => console.log("Restock Requests") },
      { label: "Deliveries", onClick: () => console.log("Deliveries") },
    ],
    products: [
      { label: "All Categories", icon: <Icon d={icons.grid} size={14} />, onClick: () => console.log("All Categories") },
      { label: "Filter", icon: <Icon d={icons.filter} size={14} />, onClick: () => console.log("Filter products") },
    ],
    suppliers: [
      { label: "Filter", icon: <Icon d={icons.filter} size={14} />, onClick: () => console.log("Filter suppliers") },
      { label: "Sort", icon: <Icon d={icons.sort} size={14} />, onClick: () => console.log("Sort suppliers") },
      { label: "Add Supplier", icon: <Icon d={icons.plus} size={14} />, onClick: () => console.log("Add Supplier") },
    ],
    sales: [
      { label: "Last 30 Days", onClick: () => console.log("Last 30 Days") },
      { label: "All Time", onClick: () => console.log("All Time") },
      { label: "Custom Range", onClick: () => console.log("Custom Range") },
    ],
    reports: [
      { label: "Last 30 Days", onClick: () => console.log("Last 30 Days") },
      { label: "Print", icon: <Icon d={icons.print} size={14} />, onClick: () => console.log("Print") },
    ],
  };

  const pageTitles = {
    dashboard: "Dashboard",
    customer: "Customer",
    supplier: "Supplier",
    products: "Products",
    suppliers: "Suppliers",
    sales: "Sales",
    reports: "Reports",
  };

  const currentTitle = pageTitles[page] || "Inventory Pro";
  const currentActions = pageActions[page] || [];

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", display: "flex", height: "100vh", overflow: "hidden", background: "#f9fafb" }}>
      <Sidebar active={page} setPage={setPageAuthorized} onLogout={handleLogout} role={role} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopBar title={currentTitle} actions={currentActions} />
        {page === "dashboard" && <DashboardPage />}
        {page === "customer" && <CustomerDashboard />}
        {page === "supplier" && <SupplierDashboard />}
        {page === "products" && <ProductsPage />}
        {page === "suppliers" && <SuppliersPage />}
        {page === "sales" && <SalesPage />}
        {page === "reports" && <ReportsPage />}
        {page === "purchase_history" && <PurchaseHistoryPage />}
        {page === "recent_purchases" && <RecentPurchasesPage />}
        {page === "supplied_products" && <SuppliedProductsPage />}
        {page === "restock_requests" && <RestockRequestsPage />}
        {page === "supply_history" && <SupplyHistoryPage />}
        {page === "profile" && <ProfilePage role={role} />}
      </div>
    </div>
  );
}
