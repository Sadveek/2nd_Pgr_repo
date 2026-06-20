import { useState, useEffect } from "react";
import CustomerDashboard from "./CustomerDashboard";
import SupplierDashboard from "./SupplierDashboard";
import { Icon, Badge, StatCard, Sidebar } from "./components/UI";
import mockData from "./mockData";
import productService from "./services/productService";
import supplierService from "./services/supplierService";
import restockService from "./services/restockService";
import authService from "./services/authService";
import inventoryService from "./services/inventoryService";
import dashboardService from "./services/dashboardService";
import {
  APP_FONT_STACK,
  APP_ACCENT_GRADIENT,
  APP_ACCENT_SHADOW,
  APP_CONTROL_INPUT_STYLE,
  APP_CONTROL_SELECT_STYLE,
  APP_CONTROL_BUTTON_STYLE,
  Pagination,
} from "./components/UI";


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
  x: "M18 6 6 18M6 6l12 12",
  google: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z",
  sso: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M7 9h10 M7 13h6",
};

const ITEMS_PER_PAGE = 100;

// Shared UI components are imported from ./components/UI

const ActionButton = ({ label, icon, variant = "secondary", onClick }) => {
  const isPrimary = variant === "primary";
  return (
    <button
      onClick={onClick}
        style={{
          padding: "10px 18px",
          borderRadius: 10,
          border: `1px solid ${isPrimary ? "#6d5efc" : "#111827"}`,
          background: isPrimary ? APP_ACCENT_GRADIENT : "#fff",
          color: isPrimary ? "#fff" : "#111827",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontWeight: 700,
        fontSize: 14,
        letterSpacing: 0,
        boxShadow: isPrimary ? APP_ACCENT_SHADOW : "0 1px 2px rgba(15, 23, 42, 0.04)",
        cursor: "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = isPrimary ? "0 12px 22px rgba(92, 88, 255, 0.22)" : "0 3px 8px rgba(15, 23, 42, 0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = isPrimary ? APP_ACCENT_SHADOW : "0 1px 2px rgba(15, 23, 42, 0.04)";
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

const TopBar = ({ title, onExport, onRefresh }) => (
  <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "14px 24px", borderBottom: "1px solid #e5e7eb", background: "#fff", flexShrink: 0, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }}>
    <span style={{ fontWeight: 800, color: "#111827", fontSize: 15, letterSpacing: 0.1 }}>{title || "Inventory Pro"}</span>
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <ActionButton label="Export" icon={<Icon d={icons.download} size={14} />} variant="secondary" onClick={onExport} />
      <button
        type="button"
        onClick={onRefresh}
        style={{
          padding: "10px 18px",
          borderRadius: 10,
          border: "1px solid #6d5efc",
          background: APP_ACCENT_GRADIENT,
          color: "#fff",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          fontWeight: 700,
          fontSize: 14,
          letterSpacing: 0,
          boxShadow: APP_ACCENT_SHADOW,
          cursor: "pointer",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 12px 22px rgba(92, 88, 255, 0.22)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = APP_ACCENT_SHADOW;
        }}
      >
        <Icon d={icons.refresh} size={14} stroke="#fff" />
        <span>Refresh</span>
      </button>
    </div>
  </header>
);

const downloadJson = (filename, payload) => {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const useAdminSnapshot = () => {
  const [snapshot, setSnapshot] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const data = await dashboardService.getAdminSnapshot();
      if (mounted) setSnapshot(data);
    };
    load();
    const handleDbChange = () => load();
    window.addEventListener("inventory-db-changed", handleDbChange);
    return () => {
      mounted = false;
      window.removeEventListener("inventory-db-changed", handleDbChange);
    };
  }, []);

  return snapshot;
};

// ─── Pages ────────────────────────────────────────────────────────────────────
const LoginPage = ({ onLogin }) => {
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [identifier, setIdentifier] = useState("admin@demo.local");
  const [password, setPassword] = useState("adminpass");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignIn = async (loginIdentifier = identifier, loginPassword = password, loginRemember = remember) => {
    setError(null);
    setLoading(true);
    try {
      const token = await authService.login(loginIdentifier, loginPassword);
      // token contains role and user info
      onLogin(token.role, token.role === "admin" ? "dashboard" : token.role, loginRemember);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(145deg,#e8eeff 0%,#f5f7ff 60%,#edf2ff 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: APP_FONT_STACK, padding: 24 }}>
      <div style={{ marginBottom: 24, textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: APP_ACCENT_GRADIENT, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: APP_ACCENT_SHADOW }}>
          <Icon d={icons.grid} size={30} stroke="#fff" strokeWidth={1.5} />
        </div>
        <div style={{ display: "inline-block", marginBottom: 8 }}>
          <div style={{ fontWeight: 900, fontSize: 24, color: "#1a1a2e", letterSpacing: 0.2 }}>Inventory Pro</div>
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
            <label style={{ fontSize: 13, fontWeight: 700, color: "#333" }}>Password</label>
            <button type="button" style={{ fontSize: 13, color: "#2563eb", textDecoration: "none", background: "none", border: "none", padding: 0, cursor: "pointer" }}>Forgot password?</button>
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
          <button onClick={handleSignIn} disabled={loading} style={{ width: "100%", padding: "13px", background: APP_ACCENT_GRADIENT, color: "#fff", border: "1px solid #6d5efc", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading ? 0.7 : 1, boxShadow: APP_ACCENT_SHADOW }}>
            {loading ? "Signing in..." : "Sign In"} <Icon d={icons.login} size={16} stroke="#fff" />
          </button>
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            <button onClick={() => onLogin("customer", "customer", true)} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px solid #6d5efc", background: "#fff", cursor: "pointer", fontWeight: 700, color: "#5b49ff" }}>Customer Portal</button>
            <button onClick={() => onLogin("supplier", "supplier", true)} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px solid #6d5efc", background: "#fff", cursor: "pointer", fontWeight: 700, color: "#5b49ff" }}>Supplier Portal</button>
          </div>
        </div>

      </div>

    </div>
  );
};

const DashboardPage = () => {
  const snapshot = useAdminSnapshot();
  const barHeights = [55, 40, 65, 85, 60, 70, 90];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const rows = snapshot?.salesRows || [
    { id: "#TX-94021", name: "MacBook Pro M3", date: "Oct 24, 2023 · 14:20", qty: "12 Units", status: "In Stock", statusColor: "green", amount: "$24,400.00" },
    { id: "#TX-94020", name: "Magic Keyboard", date: "Oct 24, 2023 · 12:45", qty: "2 Units", status: "Low Stock", statusColor: "yellow", amount: "$298.00" },
    { id: "#TX-94019", name: "AirPods Pro", date: "Oct 23, 2023 · 09:11", qty: "5 Units", status: "In Stock", statusColor: "green", amount: "$1,245.00" },
  ];
  const totalProducts = snapshot?.totalProducts ?? 2450;
  const totalStock = snapshot?.totalStock ?? 1890;
  const lowStockCount = snapshot?.lowStockCount ?? 12;
  const outOfStockCount = snapshot?.outOfStockCount ?? 0;
  const dailySales = snapshot?.totalRevenue ?? 4200;
  const healthySkuCount = Math.max(0, totalProducts - lowStockCount - outOfStockCount);
  const turnoverRate = totalProducts > 0 ? Math.round((healthySkuCount / totalProducts) * 100) : 0;
  const slowMovingRate = totalProducts > 0 ? Math.round((lowStockCount / totalProducts) * 100) : 0;
  const expiredDamagedRate = totalProducts > 0 ? Math.round((outOfStockCount / totalProducts) * 100) : 0;
  const inventoryHealth = [
    { pct: turnoverRate, label: "Turnover Rate", sub: "Healthy SKUs", color: "#10b981" },
    { pct: slowMovingRate, label: "Slow Moving", sub: "Low stock", color: "#f59e0b" },
    { pct: expiredDamagedRate, label: "Expired/Damaged", sub: "Out of stock", color: "#ef4444" },
  ];
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", background: "#f9fafb", fontFamily: APP_FONT_STACK }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, lineHeight: 1.08, letterSpacing: -0.2, color: "#111827" }}>Dashboard Overview</h1>
          <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: 13, fontWeight: 400 }}>Real-time inventory status and key metrics</p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, marginBottom: 20 }}>
        <StatCard icon={<Icon d={icons.box} size={18} />} label="Total Products" value={Number(totalProducts).toLocaleString()} sub="Live from inventory" subColor="#10b981" />
        <StatCard icon={<Icon d={icons.check} size={18} />} label="Available Stock" value={Number(totalStock).toLocaleString()} sub="Updated from store" subColor="#6b7280" />
        <StatCard icon={<Icon d={icons.alert} size={18} stroke="#dc2626" />} label="Low Stock Items" value={Number(lowStockCount).toLocaleString()} sub="Needs reorder" subColor="#dc2626" highlight />
        <StatCard icon={<Icon d={icons.receipt} size={18} />} label="Daily Sales" value={`${Number(dailySales || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} sub="Synced from orders" subColor="#10b981" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 20 }}>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)", transition: "all 0.3s ease" }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)"; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)"; }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111827" }}>Stock Analytics</h2>
              <div style={{ marginTop: 6, fontSize: 12, color: "#6b7280", fontWeight: 400 }}>Live inventory trend from the shared store</div>
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
                    <span style={{ fontSize: 11, color: "#111827", fontWeight: 600 }}>{value}%</span>
                    <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 400 }}>{days[i]}</span>
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
                { label: "Current Stock", value: `${turnoverRate}%`, note: `${healthySkuCount.toLocaleString()} healthy SKUs`, color: "#2563eb" },
                { label: "Forecast", value: `${Math.max(0, 100 - turnoverRate)}%`, note: "Expected pressure", color: "#10b981" },
                { label: "Restock Due", value: `${lowStockCount + outOfStockCount}`, note: "SKUs needing reorder", color: "#f59e0b" },
              ].map((item, idx) => (
                <div key={idx} style={{ background: "#f8fafc", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 6 }}>{item.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: item.color }}>{item.value}</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4, fontWeight: 400 }}>{item.note}</div>
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
          <h2 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#111827" }}>Inventory Health</h2>
          {inventoryHealth.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", background: `conic-gradient(${item.color} 0deg ${Math.max(0, Math.min(100, item.pct)) * 3.6}deg, #f3f4f6 ${Math.max(0, Math.min(100, item.pct)) * 3.6}deg 360deg)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 0 0 1px ${item.color}20` }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 0 0 1px rgba(15,23,42,0.04)" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: item.color }}>{item.pct}%</span>
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: "#111827" }}>{item.label}</div>
                <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 400 }}>{item.sub}</div>
              </div>
            </div>
          ))}
          <button style={{ width: "100%", padding: "10px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#f9fafb", cursor: "pointer", fontWeight: 600, fontSize: 13, color: "#6b7280", transition: "all 0.2s ease", marginTop: 4 }} onMouseEnter={(e) => { e.currentTarget.style.background = "#f3f4f6"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "#f9fafb"; }}>View Audit</button>
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111827" }}>Recent Activity</h2>
          <button type="button" style={{ fontSize: 13, color: "#2563eb", fontWeight: 600, textDecoration: "none", background: "none", border: "none", padding: 0, cursor: "pointer", transition: "color 0.2s ease" }} onMouseEnter={(e) => e.currentTarget.style.color = "#1d4ed8"} onMouseLeave={(e) => e.currentTarget.style.color = "#2563eb"}>View All →</button>
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

const ProductsPage = ({ role = "admin" }) => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ totalProducts: 0, totalStock: 0, lowStockCount: 0, outOfStockCount: 0 });
  const [editMode, setEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [productPage, setProductPage] = useState(1);
  const canEdit = role === "admin";
  const columns = canEdit
    ? ["SKU", "Product Name", "Category", "Supplier", "Price", "Stock Level", "Actions"]
    : ["Product Name", "Stock Level"];

  const load = async () => {
    setError(null);
    setLoading(true);
    try {
      const [list, supplierList] = await Promise.all([productService.list(), supplierService.list()]);
      setProducts(list || []);
      setSuppliers(supplierList || []);
      const t = await inventoryService.totals();
      setStats(t);
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const handleDbChange = () => load();
    window.addEventListener("inventory-db-changed", handleDbChange);
    return () => window.removeEventListener("inventory-db-changed", handleDbChange);
  }, []);

  const sortedProducts = [...products].sort((a, b) => {
    const aPriority = (a.quantity || 0) > 0 ? 0 : 1;
    const bPriority = (b.quantity || 0) > 0 ? 0 : 1;
    if (aPriority !== bPriority) return aPriority - bPriority;
    return String(a.name || "").localeCompare(String(b.name || ""));
  });
  const categoryOptions = ["all", ...new Set(products.map((product) => product.category).filter(Boolean))];
  const filteredProducts = sortedProducts.filter((product) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !query ||
      String(product.name || "").toLowerCase().includes(query) ||
      String(product.sku || "").toLowerCase().includes(query) ||
      String(product.category || "").toLowerCase().includes(query);
    const matchesCategory = categoryFilter === "all" || String(product.category || "").toLowerCase() === categoryFilter.toLowerCase();
    const stockLabel = (product.quantity || 0) === 0 ? "out_of_stock" : (product.quantity || 0) < 20 ? "low_stock" : "in_stock";
    const matchesStock = stockFilter === "all" || stockFilter === stockLabel;
    return matchesQuery && matchesCategory && matchesStock;
  });
  const productPageCount = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const visibleProducts = filteredProducts.slice((productPage - 1) * ITEMS_PER_PAGE, productPage * ITEMS_PER_PAGE);

  useEffect(() => {
    setProductPage(1);
  }, [searchQuery, categoryFilter, stockFilter]);

  useEffect(() => {
    setProductPage((current) => Math.min(current, productPageCount));
  }, [productPageCount]);

  const handleDelete = async (id) => {
    if (!canEdit) return;
    if (!window.confirm("Delete this product?")) return;
    try {
      await productService.remove(id);
      await load();
    } catch (err) {
      alert(err.message || "Failed to delete");
    }
  };

  const handleEdit = async (p) => {
    if (!canEdit) return;
    try {
      const qty = parseInt(prompt("New quantity:", String(p.quantity || 0)), 10);
      if (Number.isNaN(qty)) return;
      await productService.update(p.id, { quantity: qty });
      await load();
    } catch (err) {
      alert(err.message || "Failed to update");
    }
  };

  const handleLinkSupplier = async (product) => {
    if (!canEdit) return;
    if (!suppliers.length) {
      alert("No suppliers available to link.");
      return;
    }
    const chosen = prompt(
      `Enter supplier ID, company name, or contact name:\n${suppliers.map((supplier) => `${supplier.id}: ${supplier.companyName || supplier.contactName || "Supplier"}`).join("\n")}`,
      product.supplierId || suppliers[0].id
    );
    if (!chosen) return;
    const supplier = suppliers.find((item) => {
      const value = chosen.trim().toLowerCase();
      return (
        String(item.id || "").toLowerCase() === value ||
        String(item.companyName || "").toLowerCase() === value ||
        String(item.contactName || "").toLowerCase() === value
      );
    });
    if (!supplier) {
      alert("Supplier not found.");
      return;
    }
    try {
      await productService.update(product.id, { supplierId: supplier.id });
      await load();
    } catch (err) {
      alert(err.message || "Failed to link supplier");
    }
  };

  const handleAdd = async () => {
    if (!canEdit) return;
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

  const handleRequest = async (product) => {
    if (!canEdit) return;
    try {
      const quantity = parseInt(prompt("Restock quantity:", String(Math.max(25, Number(product.quantity || 0) * 5 || 25))), 10);
      if (Number.isNaN(quantity) || quantity <= 0) return;
      const priorityInput = prompt("Priority (low, medium, high):", "medium") || "medium";
      const normalizedPriority = ["low", "medium", "high"].includes(priorityInput.trim().toLowerCase())
        ? priorityInput.trim().toLowerCase()
        : "medium";
      const reason = prompt("Request reason (optional):", "Manual request from admin") || "Manual request from admin";
      await restockService.createManualRequest({
        productId: product.id,
        productName: product.name,
        supplierId: product.supplierId,
        quantity,
        priority: normalizedPriority.charAt(0).toUpperCase() + normalizedPriority.slice(1),
        reason,
      });
      await load();
    } catch (err) {
      alert(err.message || "Failed to create request");
    }
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", background: "#f9fafb" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, lineHeight: 1.08, letterSpacing: -0.2, color: "#111827" }}>{canEdit ? "Product Management" : "Product Catalog"}</h1>
          <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: 13 }}>
            {canEdit ? "Manage and track your complete inventory in real-time" : "View the live inventory catalog. Stock data stays synced with the admin portal."}
          </p>
        </div>
        {canEdit ? (
          <div style={{ display: 'flex', gap: 8, flexWrap: "wrap" }}>
            <button onClick={handleAdd} style={{ padding: "11px 16px", borderRadius: 10, border: "1px solid #111827", background: "#fff", cursor: "pointer", fontWeight: 600, color: "#111827", letterSpacing: 0, boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)" }}>Add Product</button>
            <button
              onClick={() => setEditMode((value) => !value)}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #111827",
                background: editMode ? "#111827" : "#fff",
                cursor: "pointer",
                fontWeight: 600,
                color: editMode ? "#fff" : "#111827",
              }}
            >
              {editMode ? "Exit Edit Mode" : "Edit Mode"}
            </button>
          </div>
        ) : null}
      </div>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)", marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr repeat(2, minmax(150px, 1fr)) auto", gap: 12, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}><Icon d={icons.search} size={14} /></span>
            <input
              type="text"
              placeholder="Search product name, SKU, or category"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              style={{ ...APP_CONTROL_INPUT_STYLE, paddingLeft: 38 }}
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            style={APP_CONTROL_SELECT_STYLE}
          >
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>
          <select
            value={stockFilter}
            onChange={(event) => setStockFilter(event.target.value)}
            style={APP_CONTROL_SELECT_STYLE}
          >
            <option value="all">All Stock</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setCategoryFilter("all");
              setStockFilter("all");
            }}
            style={APP_CONTROL_BUTTON_STYLE}
          >
            Reset Filters
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 20 }}>
        <div style={{ background: "linear-gradient(135deg, #fff 0%, #f9fafb 100%)", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>Total Products</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{stats.totalProducts}</div>
        </div>
        <div style={{ background: "linear-gradient(135deg, #fff 0%, #f9fafb 100%)", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>Low Stock Items</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#ef4444" }}>{stats.lowStockCount}</div>
        </div>
        <div style={{ background: "linear-gradient(135deg, #fff 0%, #f9fafb 100%)", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>Total Stock</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{stats.totalStock}</div>
        </div>
        <div style={{ background: "linear-gradient(135deg, #fff 0%, #f9fafb 100%)", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>Out of Stock</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{stats.outOfStockCount}</div>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }}>
        <div style={{ padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e5e7eb" }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111827" }}>Inventory</h2>
          <div style={{ fontSize: 12, color: "#9ca3af" }}>{loading ? "Loading..." : `Showing ${filteredProducts.length} products`}</div>
        </div>
        <div style={{ overflowX: "auto" }}>
          {error && <div style={{ padding: 12, color: "#ef4444" }}>{error}</div>}
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e5e7eb", background: "#f9fafb" }}>
                {columns.map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: 0.5, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleProducts.map((p, idx) => {
                const stockLabel = (p.quantity || 0) === 0 ? "OUT OF STOCK" : (p.quantity || 0) < 20 ? "LOW STOCK" : "IN STOCK";
                const stockColor = stockLabel === "OUT OF STOCK" ? "red" : stockLabel === "LOW STOCK" ? "yellow" : "green";
                const barColor = stockColor === "red" ? "#ef4444" : stockColor === "yellow" ? "#f59e0b" : "#2563eb";
                return (
                  <tr key={p.id} style={{ borderBottom: "1px solid #e5e7eb", transition: "all 0.2s ease", background: idx % 2 === 0 ? "#f9fafb" : "#fff" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#f3f4f6"; }} onMouseLeave={(e) => { e.currentTarget.style.background = idx % 2 === 0 ? "#f9fafb" : "#fff"; }}>
                    {canEdit ? (
                      <>
                        <td style={{ padding: "14px 16px", fontWeight: 700, color: "#111827", fontSize: 12 }}>{p.sku || "-"}</td>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 36, height: 36, background: "#f3f4f6", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#111827", fontWeight: 600, fontSize: 12 }}>
                              {p.sku ? p.sku.slice(0, 1) : "P"}
                            </div>
                            <div>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                <div style={{ fontWeight: 600, color: "#111827" }}>{p.name}</div>
                                {!p.supplierId ? (
                                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#991b1b", fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 999, border: "1px solid #fecaca", background: "#fef2f2" }}>
                                    <Icon d={icons.x} size={11} stroke="#b91c1c" />
                                    Not linked
                                  </span>
                                ) : null}
                              </div>
                              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{p.category}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "14px 16px", color: "#6b7280" }}>{p.category}</td>
                        <td style={{ padding: "14px 16px" }}>
                          {p.supplierId ? (
                            <Badge color="gray">{suppliers.find((supplier) => supplier.id === p.supplierId)?.companyName || "Linked supplier"}</Badge>
                          ) : (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#991b1b", fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 999, border: "1px solid #fecaca", background: "#fef2f2" }}>
                              <Icon d={icons.x} size={11} stroke="#b91c1c" />
                              Not linked
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "14px 16px", fontWeight: 700, color: "#111827" }}>${(p.price || 0).toFixed(2)}</td>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 40, height: 6, background: "#e5e7eb", borderRadius: 3, overflow: "hidden" }}>
                              <div style={{ height: "100%", background: barColor, width: (p.quantity === 0 ? 5 : p.quantity < 20 ? 30 : 80) + "%", borderRadius: 3, transition: "width 0.3s ease" }} />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                              <Badge color={stockColor}>{stockLabel}</Badge>
                              <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>{Number(p.quantity || 0).toLocaleString()} units</span>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          {editMode ? (
                            <>
                              <button onClick={() => handleLinkSupplier(p)} style={{ padding: "6px 12px", border: "1px solid #111827", borderRadius: 6, background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#111827", transition: "all 0.2s ease", marginRight: 8 }}>Link Supplier</button>
                              <button onClick={() => handleRequest(p)} style={{ padding: "6px 12px", border: "1px solid #111827", borderRadius: 6, background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#111827", transition: "all 0.2s ease", marginRight: 8 }}>Request</button>
                              <button onClick={() => handleEdit(p)} style={{ padding: "6px 12px", border: "1px solid #111827", borderRadius: 6, background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#111827", transition: "all 0.2s ease", marginRight: 8 }}>Edit</button>
                              <button onClick={() => handleDelete(p.id)} style={{ padding: "6px 12px", border: "1px solid #111827", borderRadius: 6, background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#111827", transition: "all 0.2s ease" }}>Delete</button>
                            </>
                          ) : (
                            <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 700 }}>Edit mode required</span>
                          )}
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: "14px 16px", fontWeight: 600, color: "#111827" }}>{p.name}</td>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 40, height: 6, background: "#e5e7eb", borderRadius: 3, overflow: "hidden" }}>
                              <div style={{ height: "100%", background: barColor, width: (p.quantity === 0 ? 5 : p.quantity < 20 ? 30 : 80) + "%", borderRadius: 3, transition: "width 0.3s ease" }} />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                              <Badge color={stockColor}>{stockLabel}</Badge>
                              <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>{Number(p.quantity || 0).toLocaleString()} units</span>
                            </div>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #e5e7eb", background: "#f9fafb", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "#6b7280" }}>
            Showing {filteredProducts.length ? (productPage - 1) * ITEMS_PER_PAGE + 1 : 0}-{Math.min(productPage * ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} products
          </span>
          <Pagination currentPage={productPage} totalPages={productPageCount} onPageChange={setProductPage} />
        </div>
      </div>
    </div>
  );
};

const SuppliersPage = () => {
  const snapshot = useAdminSnapshot();
  const [suppliers, setSuppliers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [supplierPage, setSupplierPage] = useState(1);
  const load = async () => {
    const supplierList = await supplierService.list();
    setSuppliers(supplierList || []);
  };
  useEffect(() => {
    load();
    const handleDbChange = () => load();
    window.addEventListener("inventory-db-changed", handleDbChange);
    return () => window.removeEventListener("inventory-db-changed", handleDbChange);
  }, []);
  const rows = (suppliers.length ? suppliers : snapshot?.supplierRows || []).map((supplier, index) => {
    const displayName = supplier.companyName || supplier.name || supplier.contactName || "Supplier";
    return {
      id: supplier.id || String(index),
      abbr: (displayName.split(" ").map((part) => part[0]).join("").slice(0, 2) || "SP").toUpperCase(),
      name: displayName,
      category: supplier.category || "General",
      contact: supplier.contactName || displayName,
      phone: supplier.phone || supplier.contactPhone || "-",
      email: supplier.email || "-",
      status: supplier.status || "ACTIVE",
      statusColor: supplier.statusColor || "green",
    };
  });
  const supplierPageCount = Math.max(1, Math.ceil(rows.length / ITEMS_PER_PAGE));
  const visibleSuppliers = rows.slice((supplierPage - 1) * ITEMS_PER_PAGE, supplierPage * ITEMS_PER_PAGE);

  useEffect(() => {
    setSupplierPage((current) => Math.min(current, supplierPageCount));
  }, [supplierPageCount]);
  const handleAddSupplier = async () => {
    const companyName = prompt("Supplier company name:");
    if (!companyName) return;
    const contactName = prompt("Contact name:", companyName) || companyName;
    const category = prompt("Category:", "General") || "General";
    const phone = prompt("Phone number:", "") || "";
    const email = prompt("Email address:", "") || "";
    await supplierService.create({ companyName, contactName, category, phone, email, status: "ACTIVE" });
    await load();
  };
  const handleEditSupplier = async (supplier) => {
    const companyName = prompt("Supplier company name:", supplier.name || supplier.companyName || "");
    if (!companyName) return;
    const contactName = prompt("Contact name:", supplier.contact || supplier.contactName || "") || supplier.contact || supplier.contactName || "";
    const category = prompt("Category:", supplier.category || "General") || supplier.category || "General";
    const phone = prompt("Phone number:", supplier.phone || "") || supplier.phone || "";
    const email = prompt("Email address:", supplier.email || "") || supplier.email || "";
    await supplierService.update(supplier.id, { companyName, contactName, category, phone, email });
    await load();
  };
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", background: "#f9fafb" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, lineHeight: 1.08, letterSpacing: -0.2, color: "#111827" }}>Supplier Directory</h1>
          <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: 13, fontWeight: 400 }}>Manage and monitor your global network of wholesale partners</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" onClick={handleAddSupplier} style={APP_CONTROL_BUTTON_STYLE}>Add Supplier</button>
          <button type="button" onClick={() => setEditMode((value) => !value)} style={{ ...APP_CONTROL_BUTTON_STYLE, background: editMode ? APP_ACCENT_GRADIENT : "#fff", color: editMode ? "#fff" : "#111827", border: `1px solid ${editMode ? "#6d5efc" : "#111827"}`, boxShadow: editMode ? APP_ACCENT_SHADOW : APP_CONTROL_BUTTON_STYLE.boxShadow }}>{editMode ? "Exit Edit Mode" : "Edit Mode"}</button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Total Suppliers", value: Number(snapshot?.supplierCount ?? 124).toLocaleString(), sub: "Live from store", subColor: "#2563eb" },
          { label: "Active Partners", value: Number(snapshot?.activeSuppliers ?? 118).toLocaleString(), sub: "Synced status", subColor: "#10b981" },
          { label: "Pending Orders", value: Number(Math.max(0, (snapshot?.supplierCount ?? 124) - (snapshot?.activeSuppliers ?? 118))).toLocaleString(), sub: "Needs review", subColor: "#f59e0b" },
          { label: "Categories", value: Number(snapshot?.categories?.length ?? 12).toLocaleString(), sub: null },
        ].map((s, i) => (
          <div key={i} style={{ background: "linear-gradient(135deg, #fff 0%, #f9fafb 100%)", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 18px", transition: "all 0.3s ease", cursor: "pointer", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}>
            <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#111827" }}>{s.value}</div>
            {s.sub && <div style={{ fontSize: 12, color: s.subColor, fontWeight: 600, marginTop: 4 }}>{s.sub}</div>}
          </div>
        ))}
      </div>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }}>
        <div style={{ padding: 20, borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111827" }}>Suppliers</h2>
          <Badge color="gray">{rows.length} suppliers</Badge>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e5e7eb", background: "#f9fafb" }}>
                {["Company Name", "Category", "Contact Person", "Phone Number", "Email Address", "Status", "Actions"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: 0.5, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
                {visibleSuppliers.map((s, idx) => (
                <tr key={s.abbr} style={{ borderBottom: "1px solid #e5e7eb", transition: "all 0.2s ease", background: idx % 2 === 0 ? "#f9fafb" : "#fff" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#f3f4f6"; }} onMouseLeave={(e) => { e.currentTarget.style.background = idx % 2 === 0 ? "#f9fafb" : "#fff"; }}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "#111827" }}>{s.abbr}</div>
                      <span style={{ fontWeight: 600, color: "#111827" }}>{s.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", color: "#6b7280" }}>{s.category}</td>
                  <td style={{ padding: "14px 16px", color: "#6b7280" }}>{s.contact}</td>
                  <td style={{ padding: "14px 16px", color: "#6b7280", fontSize: 12 }}>{s.phone}</td>
                  <td style={{ padding: "14px 16px", color: "#6b7280", fontSize: 12 }}>{s.email}</td>
                  <td style={{ padding: "14px 16px" }}><Badge color={s.statusColor}>{s.status}</Badge></td>
                  <td style={{ padding: "14px 16px" }}>
                    {editMode ? (
                      <button type="button" onClick={() => handleEditSupplier(s)} style={{ padding: "6px 12px", border: "1px solid #111827", borderRadius: 6, background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#111827" }}>
                        Edit Contact
                      </button>
                    ) : (
                      <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 700 }}>Edit mode required</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #e5e7eb", background: "#f9fafb", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "#6b7280" }}>
            Showing {rows.length ? (supplierPage - 1) * ITEMS_PER_PAGE + 1 : 0}-{Math.min(supplierPage * ITEMS_PER_PAGE, rows.length)} of {rows.length} suppliers
          </span>
          <Pagination currentPage={supplierPage} totalPages={supplierPageCount} onPageChange={setSupplierPage} />
        </div>
      </div>
    </div>
  );
};

const SalesPage = () => {
  const snapshot = useAdminSnapshot();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [salesPage, setSalesPage] = useState(1);
  const rows = snapshot?.salesRows || [
    { id: "#TRX-82910", avatar: "AS", name: "Aarav Shrestha", date: "Oct 24, 2023 • 14:22", amount: "$1,240.00", status: "Completed", statusColor: "green" },
    { id: "#TRX-82909", avatar: "PK", name: "Priya Koirala", date: "Oct 24, 2023 • 12:45", amount: "$45.90", status: "Pending", statusColor: "yellow" },
    { id: "#TRX-82908", avatar: "NR", name: "Nischal Rai", date: "Oct 23, 2023 • 18:10", amount: "$3,102.50", status: "Completed", statusColor: "green" },
    { id: "#TRX-82907", avatar: "MG", name: "Mira Gautam", date: "Oct 23, 2023 • 15:30", amount: "$12.00", status: "Refunded", statusColor: "red" },
    { id: "#TRX-82906", avatar: "ST", name: "Sandeep Thapa", date: "Oct 23, 2023 • 09:12", amount: "$540.00", status: "Completed", statusColor: "green" },
  ];
  const filteredRows = rows.filter((row) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !query ||
      String(row.id || "").toLowerCase().includes(query) ||
      String(row.name || "").toLowerCase().includes(query) ||
      String(row.amount || "").toLowerCase().includes(query);
    const matchesStatus = statusFilter === "all" || String(row.status || "").toLowerCase() === statusFilter;
    return matchesQuery && matchesStatus;
  });
  const salesPageCount = Math.max(1, Math.ceil(filteredRows.length / ITEMS_PER_PAGE));
  const visibleRows = filteredRows.slice((salesPage - 1) * ITEMS_PER_PAGE, salesPage * ITEMS_PER_PAGE);

  useEffect(() => {
    setSalesPage(1);
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    setSalesPage((current) => Math.min(current, salesPageCount));
  }, [salesPageCount]);
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", background: "#f9fafb" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, lineHeight: 1.08, letterSpacing: -0.2, color: "#111827" }}>Sales Records</h1>
          <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: 13, fontWeight: 400 }}>Track and analyze every transaction in real-time</p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Total Revenue", value: `${Number(snapshot?.totalRevenue ?? 124592).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, sub: "+12.5%", subColor: "#10b981" },
          { label: "Total Orders", value: Number(snapshot?.totalOrders ?? 1284).toLocaleString(), sub: "Synced from orders", subColor: "#10b981" },
          { label: "Avg. Order Value", value: `${Number(snapshot?.avgOrderValue ?? 97.03).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, sub: "Current average", subColor: "#2563eb" },
          { label: "Return Rate", value: "0.42%", sub: "Stable", subColor: "#6b7280" },
        ].map((s, i) => (
          <div key={i} style={{ background: "linear-gradient(135deg, #fff 0%, #f9fafb 100%)", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 18px", transition: "all 0.3s ease", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}>
            <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: s.subColor, fontWeight: 600 }}>
              {s.sub.includes("↑") ? "↑" : s.sub.includes("↓") ? "↓" : ""} {s.sub.replace(/[↑↓]/g, "")}
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)", marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr repeat(2, minmax(150px, 1fr))", gap: 12, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}><Icon d={icons.search} size={14} /></span>
            <input
              type="text"
              placeholder="Search transaction ID, customer, or amount"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              style={{ ...APP_CONTROL_INPUT_STYLE, paddingLeft: 38 }}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            style={APP_CONTROL_SELECT_STYLE}
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
          </select>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
            }}
            style={{ ...APP_CONTROL_BUTTON_STYLE, border: "1px solid #dbeafe", background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)", color: "#1d4ed8" }}
          >
            Reset Filters
          </button>
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }}>
        <div style={{ padding: 20, borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111827" }}>Transaction History</h2>
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
              {visibleRows.map((row, idx) => (
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
        <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #e5e7eb", background: "#f9fafb", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "#6b7280" }}>
            Showing {filteredRows.length ? (salesPage - 1) * ITEMS_PER_PAGE + 1 : 0}-{Math.min(salesPage * ITEMS_PER_PAGE, filteredRows.length)} of {Number(snapshot?.totalOrders ?? filteredRows.length).toLocaleString()} results
          </span>
          <Pagination currentPage={salesPage} totalPages={salesPageCount} onPageChange={setSalesPage} />
        </div>
      </div>
    </div>
  );
};

const ReportsPage = () => {
  const snapshot = useAdminSnapshot();
  const [reportQuery, setReportQuery] = useState("");
  const [reportCategory, setReportCategory] = useState("all");
  const [reportStatus, setReportStatus] = useState("all");
  const [reportPage, setReportPage] = useState(1);
  const categories = (snapshot?.categories || ["Electronics", "Home & Garden", "Automotive", "Office Supplies"])
    .slice(0, 4)
    .map((name, index) => ({
      name,
      value: index === 0 ? "$120.4k" : index === 1 ? "$94.2k" : index === 2 ? "$72.1k" : "$48.8k",
      pct: [100, 78, 60, 40][index] || 25,
    }));
  const barData = [
    { label: "ALPHA", h: 80 }, { label: "BETA", h: 100 }, { label: "GAMMA", h: 55 }, { label: "DELTA", h: 70 },
  ];
  const rows = snapshot?.reportRows || [
    { sku: "EL-TV-85-001", sub: 'Quantum 85" Smart TV', cat: "Electronics", open: 142, sold: 84, soldColor: "#2563eb", status: "In Stock", statusColor: "green", val: "$124,500.00" },
    { sku: "HG-CHR-ERGO-9", sub: "Executive Ergonomic Chair", cat: "Home & Office", open: 85, sold: 72, soldColor: "#2563eb", status: "Low Stock", statusColor: "yellow", val: "$21,600.00" },
  ];
  const filteredRows = rows.filter((row) => {
    const query = reportQuery.trim().toLowerCase();
    const matchesQuery =
      !query ||
      String(row.sku || "").toLowerCase().includes(query) ||
      String(row.sub || "").toLowerCase().includes(query) ||
      String(row.cat || "").toLowerCase().includes(query);
    const matchesCategory = reportCategory === "all" || String(row.cat || "").toLowerCase() === reportCategory.toLowerCase();
    const matchesStatus = reportStatus === "all" || String(row.status || "").toLowerCase() === reportStatus.toLowerCase();
    return matchesQuery && matchesCategory && matchesStatus;
  });
  const reportPageCount = Math.max(1, Math.ceil(filteredRows.length / ITEMS_PER_PAGE));
  const visibleReportRows = filteredRows.slice((reportPage - 1) * ITEMS_PER_PAGE, reportPage * ITEMS_PER_PAGE);

  useEffect(() => {
    setReportPage(1);
  }, [reportQuery, reportCategory, reportStatus]);

  useEffect(() => {
    setReportPage((current) => Math.min(current, reportPageCount));
  }, [reportPageCount]);
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", background: "#f9fafb" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, lineHeight: 1.08, letterSpacing: -0.2, color: "#111827" }}>Reports & Analytics</h1>
          <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: 13 }}>Comprehensive operational performance reports</p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Total Sales Revenue", value: `${Number(snapshot?.totalRevenue ?? 284592).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, sub: "+12.4%", subColor: "#10b981" },
          { label: "Stock Turnover Rate", value: "4.8x / Year", sub: "-3.2%", subColor: "#ef4444" },
          { label: "Avg. Lead Time", value: "5.2 Days", sub: "Optimal", subColor: "#2563eb" },
          { label: "Low Stock Alerts", value: `${Number(snapshot?.lowStockCount ?? 14).toLocaleString()} SKUs`, sub: null, alert: true },
        ].map((s, i) => (
          <div key={i} style={{ background: s.alert ? "linear-gradient(135deg, #fff5f5 0%, #fffbf9 100%)" : "linear-gradient(135deg, #fff 0%, #f9fafb 100%)", border: `1px solid ${s.alert ? "#fee2e2" : "#e5e7eb"}`, borderRadius: 12, padding: "16px 18px", transition: "all 0.3s ease", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}>
            <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 4 }}>{s.value}</div>
            {s.sub && <div style={{ fontSize: 12, color: s.subColor, fontWeight: 600, background: s.subColor === "#2563eb" ? "#eff6ff" : "transparent", padding: s.subColor === "#2563eb" ? "3px 8px" : 0, borderRadius: 4, display: "inline-block" }}>
              {s.sub.includes("+") ? "+" : ""}{s.sub}
            </div>}
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 20 }}>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111827" }}>Top Selling Categories</h2>
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
          <h2 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#111827" }}>Supplier Lead Times</h2>
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
            <span style={{ fontWeight: 600, color: "#111827" }}>6.0 Days</span>
          </div>
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)", marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr repeat(2, minmax(150px, 1fr))", gap: 12, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}><Icon d={icons.search} size={14} /></span>
            <input
              type="text"
              placeholder="Search report SKU, category, or product"
              value={reportQuery}
              onChange={(event) => setReportQuery(event.target.value)}
              style={{ ...APP_CONTROL_INPUT_STYLE, paddingLeft: 38 }}
            />
          </div>
          <select
            value={reportCategory}
            onChange={(event) => setReportCategory(event.target.value)}
            style={APP_CONTROL_SELECT_STYLE}
          >
            <option value="all">All Categories</option>
            {categories.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          <select
            value={reportStatus}
            onChange={(event) => setReportStatus(event.target.value)}
            style={APP_CONTROL_SELECT_STYLE}
          >
            <option value="all">All Status</option>
            <option value="in stock">In Stock</option>
            <option value="low stock">Low Stock</option>
            <option value="out of stock">Out of Stock</option>
          </select>
        </div>
        <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={() => {
              setReportQuery("");
              setReportCategory("all");
              setReportStatus("all");
            }}
            style={{ ...APP_CONTROL_BUTTON_STYLE, border: "1px solid #dbeafe", background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)", color: "#1d4ed8" }}
          >
            Reset Filters
          </button>
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }}>
        <div style={{ padding: 20, borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111827" }}>Inventory Movement Details</h2>
          <button type="button" style={{ fontSize: 13, color: "#2563eb", fontWeight: 600, textDecoration: "none", background: "none", border: "none", padding: 0, cursor: "pointer" }}>View Full History →</button>
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
              {visibleReportRows.map((r, idx) => (
                <tr key={r.sku} style={{ borderBottom: "1px solid #e5e7eb", transition: "all 0.2s ease", background: idx % 2 === 0 ? "#f9fafb" : "#fff" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#f3f4f6"; }} onMouseLeave={(e) => { e.currentTarget.style.background = idx % 2 === 0 ? "#f9fafb" : "#fff"; }}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontWeight: 700, color: "#111827" }}>{r.sku}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>{r.sub}</div>
                  </td>
                  <td style={{ padding: "14px 16px", color: "#6b7280" }}>{r.cat}</td>
                  <td style={{ padding: "14px 16px", fontWeight: 600, color: "#111827" }}>{r.open}</td>
                  <td style={{ padding: "14px 16px", fontWeight: 600, color: r.soldColor, fontSize: 15 }}>{r.sold}</td>
                  <td style={{ padding: "14px 16px" }}><Badge color={r.statusColor}>{r.status}</Badge></td>
                  <td style={{ padding: "14px 16px", fontWeight: 700, color: "#111827" }}>{r.val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #e5e7eb", background: "#f9fafb", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "#6b7280" }}>
            Showing {filteredRows.length ? (reportPage - 1) * ITEMS_PER_PAGE + 1 : 0}-{Math.min(reportPage * ITEMS_PER_PAGE, filteredRows.length)} of {filteredRows.length} rows
          </span>
          <Pagination currentPage={reportPage} totalPages={reportPageCount} onPageChange={setReportPage} />
        </div>
      </div>
    </div>
  );
};

// ─── Role-specific placeholder pages ─────────────────────────────────────────
const PurchaseHistoryPage = () => (
  <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", background: "#f9fafb" }}>
    <h1 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.08, letterSpacing: -0.2 }}>Purchase History</h1>
    <p style={{ color: "#6b7280", fontWeight: 400 }}>All purchases made by the customer.</p>
    <div style={{ marginTop: 12, background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #e5e7eb" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", color: "#9ca3af" }}><th style={{ padding: 8 }}>Order</th><th>Item</th><th>Date</th><th>Amount</th></tr>
        </thead>
        <tbody>
          <tr><td style={{ padding: 8 }}>#ORD-1001</td><td>Wireless Keyboard Pro</td><td>May 12, 2024</td><td style={{ fontWeight: 700 }}>$129.00</td></tr>
          <tr style={{ background: "#f9fafb" }}><td style={{ padding: 8 }}>#ORD-1002</td><td>Ergonomic Office Chair</td><td>May 09, 2024</td><td style={{ fontWeight: 700 }}>$499.98</td></tr>
        </tbody>
      </table>
    </div>
  </div>
);

const RecentPurchasesPage = () => (
  <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", background: "#f9fafb" }}>
    <h1 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.08, letterSpacing: -0.2 }}>Recent Purchases</h1>
    <p style={{ color: "#6b7280", fontWeight: 400 }}>Quick view of your latest orders.</p>
    <div style={{ marginTop: 12 }}>
      <ul style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>
        <li style={{ padding: 8 }}>#ORD-1001 — Wireless Keyboard Pro — Delivered</li>
        <li style={{ padding: 8 }}>#ORD-1002 — Ergonomic Office Chair — Shipped</li>
      </ul>
    </div>
  </div>
);

const SuppliedProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const load = async () => {
    const [productList, supplierList] = await Promise.all([productService.list(), supplierService.list()]);
    setProducts(productList || []);
    setSuppliers(supplierList || []);
  };

  useEffect(() => {
    load();
    const handleDbChange = () => load();
    window.addEventListener("inventory-db-changed", handleDbChange);
    return () => window.removeEventListener("inventory-db-changed", handleDbChange);
  }, []);

  const rows = products.map((product) => {
    const supplier = suppliers.find((item) => item.id === product.supplierId);
    const stockLabel = (product.quantity || 0) === 0 ? "OUT OF STOCK" : (product.quantity || 0) < 20 ? "LOW STOCK" : "IN STOCK";
    const stockColor = stockLabel === "OUT OF STOCK" ? "red" : stockLabel === "LOW STOCK" ? "yellow" : "green";
    return {
      id: product.id,
      product: product.name,
      current: Number(product.quantity || 0).toLocaleString(),
      minimum: product.quantity === 0 ? 0 : Math.max(20, Math.round((product.quantity || 0) * 0.3)),
      lastDelivery: supplier ? `${supplier.companyName} supply` : "Shared inventory",
      badge: stockColor,
      status: stockLabel,
    };
  });

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", background: "#f9fafb" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.08, letterSpacing: -0.2, margin: 0 }}>Supplied Products</h1>
          <p style={{ color: "#6b7280", margin: "6px 0 0" }}>Live supplier inventory synced from the admin product store.</p>
        </div>
        <Badge color="blue">View only</Badge>
      </div>
      <div style={{ marginTop: 12, background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #e5e7eb" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", color: "#9ca3af" }}>
              <th style={{ padding: 8 }}>Product</th>
              <th style={{ padding: 8 }}>Current</th>
              <th style={{ padding: 8 }}>Minimum</th>
              <th style={{ padding: 8 }}>Supplier</th>
              <th style={{ padding: 8 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id} style={{ background: index % 2 === 0 ? "#fff" : "#f9fafb" }}>
                <td style={{ padding: 8, fontWeight: 600 }}>{row.product}</td>
                <td style={{ padding: 8 }}>{row.current}</td>
                <td style={{ padding: 8 }}>{row.minimum}</td>
                <td style={{ padding: 8 }}>{row.lastDelivery}</td>
                <td style={{ padding: 8 }}><Badge color={row.badge}>{row.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const RestockRequestsPage = () => (
  <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", background: "#f9fafb" }}>
    <h1 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.08, letterSpacing: -0.2 }}>Restock Requests</h1>
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
    <h1 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.08, letterSpacing: -0.2 }}>Supply History</h1>
    <p style={{ color: "#6b7280" }}>Past deliveries and restocks.</p>
    <div style={{ marginTop: 12, background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #e5e7eb" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", color: "#9ca3af" }}>
            <th style={{ padding: 8 }}>Request</th>
            <th style={{ padding: 8 }}>Product</th>
            <th style={{ padding: 8 }}>Date</th>
            <th style={{ padding: 8 }}>Amount</th>
            <th style={{ padding: 8 }}>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: 8 }}>RS-9000</td>
            <td style={{ padding: 8 }}>Ergonomic Office Chair</td>
            <td style={{ padding: 8 }}>Apr 08, 2024</td>
            <td style={{ padding: 8, fontWeight: 700 }}>$12,500.00</td>
            <td style={{ padding: 8 }}><Badge color="green">Completed</Badge></td>
          </tr>
          <tr style={{ background: "#f9fafb" }}>
            <td style={{ padding: 8 }}>RS-8999</td>
            <td style={{ padding: 8 }}>Smart Lighting Kit</td>
            <td style={{ padding: 8 }}>Mar 12, 2024</td>
            <td style={{ padding: 8, fontWeight: 700 }}>$8,900.00</td>
            <td style={{ padding: 8 }}><Badge color="green">Completed</Badge></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const ProfilePage = ({ role }) => (
  <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", background: "#f9fafb" }}>
    <h1 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.08, letterSpacing: -0.2 }}>Profile</h1>
    <p style={{ color: "#6b7280" }}>Basic account information for the current user.</p>
    <div style={{ marginTop: 12, background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #e5e7eb" }}>
      <div style={{ fontWeight: 700 }}>Inventory Pro</div>
      <div style={{ color: "#6b7280", marginTop: 6 }}>Role: {role || "Guest"}</div>
    </div>
  </div>
);

// removed inline customer and supplier dashboards - now in separate files

// ─── App ──────────────────────────────────────────────────────────────────────
const allowedPages = {
  admin: ["dashboard", "products", "suppliers", "sales", "reports", "profile"],
  customer: ["customer", "products", "purchase_history", "recent_purchases", "profile"],
  supplier: ["supplier", "supplied_products", "restock_requests", "supply_history", "profile"],
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

export default function App() {
  const [page, setPage] = useState("login");
  const [role, setRole] = useState(null);
  const [rememberSession, setRememberSession] = useState(false);

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div style={{ fontFamily: APP_FONT_STACK }}>
        <LoginPage onLogin={handleLogin} />
      </div>
    );
  }

  const pageTitles = {
    dashboard: "Dashboard",
    customer: "Customer",
    supplier: "Supplier",
    products: "Products",
    suppliers: "Suppliers",
    sales: "Sales",
    reports: "Reports",
    purchase_history: "Purchase History",
    recent_purchases: "Recent Purchases",
    supplied_products: "Supplied Products",
    restock_requests: "Restock Requests",
    supply_history: "Supply History",
    profile: "Profile",
  };

  const currentTitle = pageTitles[page] || "Inventory Pro";

  const handleExport = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      page,
      role,
      db: mockData.read(),
    };
    downloadJson(`inventory-export-${page}.json`, payload);
  };

  const handleRefresh = () => {
    window.dispatchEvent(new Event("inventory-db-changed"));
  };

  return (
    <div style={{ fontFamily: APP_FONT_STACK, display: "flex", height: "100vh", overflow: "hidden", background: "#f9fafb" }}>
      <Sidebar active={page} setPage={setPageAuthorized} onLogout={handleLogout} role={role} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopBar title={currentTitle} onExport={handleExport} onRefresh={handleRefresh} />
        {role === "customer" ? (
          <CustomerDashboard page={page} />
        ) : role === "supplier" ? (
          <SupplierDashboard page={page} />
        ) : (
          <>
            {page === "dashboard" && <DashboardPage />}
            {page === "products" && <ProductsPage role={role} />}
            {page === "suppliers" && <SuppliersPage />}
            {page === "sales" && <SalesPage />}
            {page === "reports" && <ReportsPage />}
            {page === "profile" && <ProfilePage role={role} />}
          </>
        )}
      </div>
    </div>
  );
}








