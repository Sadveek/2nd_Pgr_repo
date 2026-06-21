import { useState, useEffect } from "react";
import CustomerDashboard from "./CustomerDashboard";
import SupplierDashboard from "./SupplierDashboard";
import { Icon, Badge, StatCard, Sidebar } from "./components/UI";
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
  APP_PAGE_BACKGROUND,
  APP_CONTROL_INPUT_STYLE,
  APP_CONTROL_BUTTON_STYLE,
  ThemeSelect,
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
const formatRs = (amount, digits = 2) => `Rs. ${Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;

// Shared UI components are imported from ./components/UI

const Modal = ({ open, title, subtitle, children, footer, onClose, width = 560 }) => {
  useEffect(() => {
    if (!open) return undefined;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="presentation"
      onMouseDown={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 80,
        background: "rgba(15, 23, 42, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: width,
          maxHeight: "calc(100vh - 40px)",
          background: "#fff",
          borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.4)",
          boxShadow: "0 30px 80px rgba(15, 23, 42, 0.28)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ padding: "18px 20px", borderBottom: "1px solid #e5e7eb", background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>{title}</div>
              {subtitle ? <div style={{ marginTop: 4, fontSize: 13, color: "#6b7280" }}>{subtitle}</div> : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                background: "#fff",
                cursor: "pointer",
                color: "#6b7280",
                fontSize: 18,
                lineHeight: 1,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Close dialog"
            >
              ×
            </button>
          </div>
        </div>
        <div style={{ padding: 20, overflowY: "auto", flex: 1 }}>{children}</div>
        {footer ? <div style={{ padding: "16px 20px", borderTop: "1px solid #e5e7eb", background: "#f9fafb" }}>{footer}</div> : null}
      </div>
    </div>
  );
};

const SearchableSelect = ({ label, placeholder = "Search...", value, onChange, options, emptyText = "No matches found", helperText, disabled = false, allowEmptyOption = false, emptyOptionLabel = "No supplier selected" }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selected = options.find((option) => option.value === value);
  const selectableOptions = allowEmptyOption
    ? [{ value: "", label: emptyOptionLabel, description: "Leave this product unlinked" }, ...options]
    : options;

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const filtered = selectableOptions.filter((option) => {
    const searchText = `${option.label || ""} ${option.value || ""} ${option.description || ""}`.toLowerCase();
    return !query.trim() || searchText.includes(query.trim().toLowerCase());
  });

  const displayValue = selected ? selected.label : allowEmptyOption ? emptyOptionLabel : placeholder;

  return (
    <div style={{ display: "grid", gap: 6, position: "relative" }}>
      {label ? <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{label}</label> : null}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        style={{
          ...APP_CONTROL_INPUT_STYLE,
          textAlign: "left",
          cursor: disabled ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          color: selected ? "#111827" : "#94a3b8",
          background: disabled ? "#f8fafc" : "#fff",
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayValue}</span>
        <span style={{ color: "#94a3b8", fontSize: 12 }}>▾</span>
      </button>
      {helperText ? <div style={{ fontSize: 12, color: "#6b7280" }}>{helperText}</div> : null}
      {open ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: label ? 62 : 42,
            zIndex: 3,
            border: "1px solid #cbd5e1",
            borderRadius: 14,
            background: "#fff",
            boxShadow: "0 20px 40px rgba(15, 23, 42, 0.12)",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: 10, borderBottom: "1px solid #e5e7eb", background: "#f9fafb" }}>
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Type to search..."
              style={{ ...APP_CONTROL_INPUT_STYLE, padding: "10px 12px" }}
            />
          </div>
          <div style={{ maxHeight: 240, overflowY: "auto" }}>
            {filtered.length ? (
              filtered.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value || null);
                    setOpen(false);
                  }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "12px 14px",
                    border: "none",
                    background: option.value === value ? "#eff6ff" : "#fff",
                    cursor: "pointer",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{option.label}</div>
                  <div style={{ marginTop: 3, fontSize: 12, color: "#6b7280" }}>
                    {option.description || option.value}
                  </div>
                </button>
              ))
            ) : (
              <div style={{ padding: 14, fontSize: 13, color: "#6b7280" }}>{emptyText}</div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

const TopBar = ({ title, onRefresh }) => (
  <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "14px 24px", borderBottom: "1px solid #e5e7eb", background: "#fff", flexShrink: 0, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }}>
    <span style={{ fontWeight: 800, color: "#111827", fontSize: 15, letterSpacing: 0.1 }}>{title || "Inventory Pro"}</span>
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
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
            <button onClick={() => onLogin("customer", "products", true)} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px solid #6d5efc", background: "#fff", cursor: "pointer", fontWeight: 700, color: "#5b49ff" }}>Customer Portal</button>
            <button onClick={() => onLogin("supplier", "restock_requests", true)} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px solid #6d5efc", background: "#fff", cursor: "pointer", fontWeight: 700, color: "#5b49ff" }}>Supplier Portal</button>
          </div>
        </div>

      </div>

    </div>
  );
};

const getNiceScaleMax = (value) => {
  const numeric = Math.max(0, Number(value || 0));
  if (numeric === 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(numeric));
  const normalized = numeric / magnitude;
  const nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return nice * magnitude;
};

const DashboardPage = () => {
  const snapshot = useAdminSnapshot();
  const revenueSeries = snapshot?.revenueSeries?.length ? snapshot.revenueSeries : Array.from({ length: 7 }, (_, index) => ({ label: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index], value: 0 }));
  const days = revenueSeries.map((item) => item.label);
  const chartValues = revenueSeries.map((item) => Number(item.value || 0));
  const chartMax = getNiceScaleMax(Math.max(0, ...chartValues));
  const chartTop = 12;
  const chartBottom = 88;
  const chartLeft = 6;
  const chartRight = 94;
  const chartPoints = chartValues.map((value, index) => {
    const x = revenueSeries.length > 1 ? chartLeft + (index / (revenueSeries.length - 1)) * (chartRight - chartLeft) : 50;
    const ratio = chartMax > 0 ? value / chartMax : 0;
    const y = chartBottom - ratio * (chartBottom - chartTop);
    return { x, y, value };
  });
  const chartLinePoints = chartPoints.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ");
  const chartAreaPoints = [
    `${chartLeft},${chartBottom}`,
    ...chartPoints.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`),
    `${chartRight},${chartBottom}`,
  ].join(" ");
  const chartTicks = Array.from({ length: 5 }, (_, index) => {
    const value = (chartMax / 4) * index;
    const ratio = chartMax > 0 ? value / chartMax : 0;
    const y = chartBottom - ratio * (chartBottom - chartTop);
    return { value, y };
  }).reverse();
  const rows = snapshot?.salesRows || [
    { id: "#TX-94021", name: "MacBook Pro M3", date: "Oct 24, 2023 · 14:20", qty: "12 Units", status: "In Stock", statusColor: "green", amount: "Rs. 24,400.00" },
    { id: "#TX-94020", name: "Magic Keyboard", date: "Oct 24, 2023 · 12:45", qty: "2 Units", status: "Low Stock", statusColor: "yellow", amount: "Rs. 298.00" },
    { id: "#TX-94019", name: "AirPods Pro", date: "Oct 23, 2023 · 09:11", qty: "5 Units", status: "In Stock", statusColor: "green", amount: "Rs. 1,245.00" },
  ];
  const totalProducts = snapshot?.totalProducts ?? 2450;
  const totalStock = snapshot?.totalStock ?? 1890;
  const lowStockCount = snapshot?.lowStockCount ?? 12;
  const outOfStockCount = snapshot?.outOfStockCount ?? 0;
  const dailySales = snapshot?.dailyRevenue ?? snapshot?.totalRevenue ?? 4200;
  const revenueModeLabel = snapshot?.revenueModeEnabled ? "Fake revenue enabled" : "Live revenue enabled";
  const peakSeriesIndex = revenueSeries.reduce((bestIndex, item, index, list) => (Number(item.value || 0) > Number(list[bestIndex]?.value || 0) ? index : bestIndex), 0);
  const peakSeriesValue = revenueSeries[peakSeriesIndex]?.value || 0;
  const healthySkuCount = Math.max(0, totalProducts - lowStockCount - outOfStockCount);
  const turnoverRate = totalProducts > 0 ? Math.round((healthySkuCount / totalProducts) * 100) : 0;
  const slowMovingRate = totalProducts > 0 ? Math.round((lowStockCount / totalProducts) * 100) : 0;
  const expiredDamagedRate = totalProducts > 0 ? Math.round((outOfStockCount / totalProducts) * 100) : 0;
  const inventoryHealth = [
    { pct: turnoverRate, label: "Healthy SKUs", sub: "Turnover Rate", color: "#10b981" },
    { pct: slowMovingRate, label: "Slow Moving", sub: "Low stock", color: "#f59e0b" },
    { pct: expiredDamagedRate, label: "Out of Stock", sub: "Expired/Damaged", color: "#ef4444" },
  ];
  const handleMakeAudit = () => {
    if (!snapshot) return;
    downloadJson(`inventory-audit-${new Date().toISOString().slice(0, 10)}.json`, {
      generatedAt: new Date().toISOString(),
      totals: {
        totalProducts,
        totalStock,
        lowStockCount,
        outOfStockCount,
        healthySkuCount,
      },
      percentages: {
        healthySkuRate: turnoverRate,
        slowMovingRate,
        expiredDamagedRate,
      },
      inventoryHealth,
      revenue: {
        totalRevenue: snapshot?.totalRevenue ?? 0,
        dailyRevenue: snapshot?.dailyRevenue ?? 0,
        modeEnabled: Boolean(snapshot?.revenueModeEnabled),
      },
      topCategories: snapshot?.categories || [],
      recentSales: snapshot?.salesRows || [],
      stockRows: snapshot?.reportRows || [],
    });
  };
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
        <StatCard icon={<Icon d={icons.receipt} size={18} />} label="Daily Sales" value={formatRs(dailySales || 0)} sub="Synced from orders" subColor="#10b981" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 20 }}>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)", transition: "all 0.3s ease" }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)"; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)"; }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111827" }}>Revenue Analytics</h2>
              <div style={{ marginTop: 6, fontSize: 12, color: "#6b7280", fontWeight: 400 }}>7-day revenue snapshot powered by the profile toggle</div>
            </div>
            <Badge color={snapshot?.revenueModeEnabled ? "blue" : "gray"}>{revenueModeLabel}</Badge>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: 18, alignItems: "end" }}>
            <div style={{ minHeight: 320, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ position: "relative", flex: 1, minHeight: 240, borderRadius: 16, background: "linear-gradient(180deg, #f8fbff 0%, #ffffff 100%)", border: "1px solid #e9eef8", overflow: "hidden" }}>
                <div style={{ position: "absolute", left: 12, right: 14, top: 14, bottom: 44 }}>
                  <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ display: "block" }}>
                    <defs>
                      <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.34" />
                        <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.04" />
                      </linearGradient>
                      <linearGradient id="revenueLine" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#60a5fa" />
                        <stop offset="100%" stopColor="#2563eb" />
                      </linearGradient>
                    </defs>
                    {chartTicks.map((tick) => (
                      <line key={tick.value} x1="0" x2="100" y1={tick.y} y2={tick.y} stroke="#eef2ff" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                    ))}
                    <polygon points={chartAreaPoints} fill="url(#revenueFill)" />
                    <polyline fill="none" stroke="url(#revenueLine)" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" points={chartLinePoints} vectorEffect="non-scaling-stroke" />
                    {chartPoints.map((point, index) => (
                      <g key={index}>
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r="1.6"
                          fill="#fff"
                          stroke="#2563eb"
                          strokeWidth="1.3"
                          vectorEffect="non-scaling-stroke"
                        />
                      </g>
                    ))}
                  </svg>
                </div>
                <div style={{ position: "absolute", left: 12, right: 14, bottom: 24, display: "grid", gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))`, gap: 6, pointerEvents: "none" }}>
                  {chartPoints.map((point, index) => (
                    <div key={`amount-${days[index]}-${index}`} style={{ textAlign: "center", fontSize: 12, color: "#111827", fontWeight: 700, lineHeight: 1.1 }}>
                      {formatRs(point.value || 0, 0)}
                    </div>
                  ))}
                </div>
                <div style={{ position: "absolute", left: 12, right: 14, bottom: 8, display: "grid", gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))`, gap: 6 }}>
                  {days.map((day, index) => (
                    <div key={day + index} style={{ textAlign: "center", fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>{day}</div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              {[
                { label: "7-Day Total", value: formatRs(snapshot?.totalRevenue ?? 0), note: "Combined weekly revenue", color: "#2563eb" },
                { label: "Daily Average", value: formatRs((snapshot?.totalRevenue ?? 0) / 7, 0), note: "Average per day", color: "#10b981" },
                { label: "Peak Day", value: formatRs(peakSeriesValue || 0, 0), note: days[peakSeriesIndex] || "This week", color: "#f59e0b" },
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
            <span>Mode: {revenueModeLabel}</span>
            <span>Peak day: {days[peakSeriesIndex] || "N/A"}</span>
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
          <button
            type="button"
            onClick={handleMakeAudit}
            disabled={!snapshot}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #dbe2ea",
              borderRadius: 8,
              background: snapshot ? "linear-gradient(135deg, #fff 0%, #eff6ff 100%)" : "#f9fafb",
              cursor: snapshot ? "pointer" : "not-allowed",
              fontWeight: 600,
              fontSize: 13,
              color: snapshot ? "#1d4ed8" : "#9ca3af",
              transition: "all 0.2s ease",
              marginTop: 4,
            }}
            onMouseEnter={(e) => {
              if (!snapshot) return;
              e.currentTarget.style.background = "#e0efff";
            }}
            onMouseLeave={(e) => {
              if (!snapshot) return;
              e.currentTarget.style.background = "linear-gradient(135deg, #fff 0%, #eff6ff 100%)";
            }}
          >
            Make Audit
          </button>
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
  const [dialog, setDialog] = useState(null);
  const [dialogForm, setDialogForm] = useState({});
  const canEdit = role === "admin";
  const columns = canEdit
    ? ["SKU", "Product Name", "Category", "Supplier", "Price", "Stock Level", "Actions"]
    : ["Product Name", "Stock Level"];
  const supplierOptions = suppliers.map((supplier) => {
    const companyName = supplier.companyName || supplier.name || supplier.contactName || "Supplier";
    const contactName = supplier.contactName || supplier.contact || "";
    return {
      value: supplier.id,
      label: companyName,
      description: contactName ? `${contactName}${supplier.email ? ` • ${supplier.email}` : ""}` : supplier.email || supplier.phone || "Supplier",
    };
  });

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
    setDialog({ type: "edit-quantity", product: p });
    setDialogForm({ quantity: String(p.quantity || 0) });
  };

  const handleLinkSupplier = async (product) => {
    if (!canEdit) return;
    if (!suppliers.length) {
      alert("No suppliers available to link.");
      return;
    }
    setDialog({ type: "link-supplier", product });
    setDialogForm({ supplierId: product.supplierId || suppliers[0].id });
  };

  const handleAdd = async () => {
    if (!canEdit) return;
    setDialog({ type: "add-product" });
    setDialogForm({
      name: "",
      sku: `SKU-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      category: "General",
      price: "0",
      quantity: "0",
      supplierId: "",
    });
  };

  const handleRequest = async (product) => {
    if (!canEdit) return;
    setDialog({ type: "request-restock", product });
    setDialogForm({
      quantity: String(Math.max(25, Number(product.quantity || 0) * 5 || 25)),
      priority: "medium",
      reason: "Manual request from admin",
    });
  };

  const closeDialog = () => {
    setDialog(null);
    setDialogForm({});
  };

  const submitDialog = async (event) => {
    event.preventDefault();
    if (!dialog?.type) return;
    try {
      if (dialog.type === "add-product") {
        const name = dialogForm.name.trim();
        if (!name) {
          alert("Product name is required.");
          return;
        }
        const quantity = parseInt(dialogForm.quantity, 10) || 0;
        const price = parseFloat(dialogForm.price) || 0;
        await productService.create({
          sku: dialogForm.sku.trim(),
          name,
          category: dialogForm.category.trim() || "General",
          price,
          quantity,
          supplierId: dialogForm.supplierId || null,
          status: quantity === 0 ? "out_of_stock" : quantity < 20 ? "low_stock" : "in_stock",
        });
      }
      if (dialog.type === "edit-quantity") {
        const quantity = parseInt(dialogForm.quantity, 10);
        if (Number.isNaN(quantity)) {
          alert("Please enter a valid quantity.");
          return;
        }
        await productService.update(dialog.product.id, { quantity });
      }
      if (dialog.type === "link-supplier") {
        if (!dialogForm.supplierId) {
          alert("Please choose a supplier.");
          return;
        }
        await productService.update(dialog.product.id, { supplierId: dialogForm.supplierId });
      }
      if (dialog.type === "request-restock") {
        const quantity = parseInt(dialogForm.quantity, 10);
        if (Number.isNaN(quantity) || quantity <= 0) {
          alert("Please enter a valid restock quantity.");
          return;
        }
        const priority = ["low", "medium", "high"].includes(String(dialogForm.priority || "").trim().toLowerCase())
          ? String(dialogForm.priority || "").trim().toLowerCase()
          : "medium";
        await restockService.createManualRequest({
          productId: dialog.product.id,
          productName: dialog.product.name,
          supplierId: dialog.product.supplierId,
          quantity,
          priority: priority.charAt(0).toUpperCase() + priority.slice(1),
          reason: (dialogForm.reason || "Manual request from admin").trim() || "Manual request from admin",
        });
      }
      closeDialog();
      await load();
    } catch (err) {
      alert(err.message || "Something went wrong");
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
          <ThemeSelect
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={categoryOptions.map((category) => ({
              value: category,
              label: category === "all" ? "All Categories" : category,
            }))}
          />
          <ThemeSelect
            value={stockFilter}
            onChange={setStockFilter}
            options={[
              { value: "all", label: "All Stock" },
              { value: "in_stock", label: "In Stock" },
              { value: "low_stock", label: "Low Stock" },
              { value: "out_of_stock", label: "Out of Stock" },
            ]}
          />
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
          <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>Total Stock</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{stats.totalStock}</div>
        </div>
        <div style={{ background: "linear-gradient(135deg, #fff 0%, #fffbeb 100%)", border: "1px solid #fed7aa", borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ fontSize: 12, color: "#b45309", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>Low Stock Items</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#d97706" }}>{stats.lowStockCount}</div>
        </div>
        <div style={{ background: "linear-gradient(135deg, #fff 0%, #fef2f2 100%)", border: "1px solid #fecaca", borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ fontSize: 12, color: "#b91c1c", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>Out of Stock</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#dc2626" }}>{stats.outOfStockCount}</div>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }}>
        <div style={{ padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e5e7eb" }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111827" }}>Inventory</h2>
          <div style={{ fontSize: 12, color: "#9ca3af" }}>{loading ? "Loading..." : `Showing ${filteredProducts.length} products`}</div>
        </div>
        <div style={{ overflowX: "auto" }}>
          {error && <div style={{ padding: 12, color: "#ef4444" }}>{error}</div>}
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, tableLayout: "fixed" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e5e7eb", background: "#f9fafb" }}>
                {columns.map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "12px 16px",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#9ca3af",
                      letterSpacing: 0.5,
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                      width:
                        h === "SKU" ? 120 :
                        h === "Product Name" ? 280 :
                        h === "Category" ? 140 :
                        h === "Supplier" ? 160 :
                        h === "Price" ? 120 :
                        h === "Stock Level" ? 150 :
                        h === "Actions" ? 240 :
                        "auto",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleProducts.map((p, idx) => {
                const stockLabel = (p.quantity || 0) === 0 ? "OUT OF STOCK" : (p.quantity || 0) < 20 ? "LOW STOCK" : "IN STOCK";
                const stockColor = stockLabel === "OUT OF STOCK" ? "red" : stockLabel === "LOW STOCK" ? "yellow" : "green";
                return (
                  <tr key={p.id} style={{ borderBottom: "1px solid #e5e7eb", transition: "all 0.2s ease", background: idx % 2 === 0 ? "#f9fafb" : "#fff" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#f3f4f6"; }} onMouseLeave={(e) => { e.currentTarget.style.background = idx % 2 === 0 ? "#f9fafb" : "#fff"; }}>
                    {canEdit ? (
                      <>
                        <td style={{ padding: "14px 16px", fontWeight: 700, color: "#111827", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis" }}>{p.sku || "-"}</td>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                            <div style={{ width: 36, height: 36, background: "#f3f4f6", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "#111827", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                              {p.sku ? p.sku.slice(0, 1) : "P"}
                            </div>
                            <div style={{ minWidth: 0, maxWidth: 260 }}>
                              <div style={{ fontWeight: 700, color: "#111827", lineHeight: 1.25, whiteSpace: "normal", wordBreak: "break-word" }}>{p.name}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "14px 16px", color: "#6b7280", whiteSpace: "nowrap" }}>{p.category}</td>
                        <td style={{ padding: "14px 16px" }}>
                          {p.supplierId ? (
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "#047857", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 999, border: "1px solid #a7f3d0", background: "#ecfdf5" }}>
                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                                Linked
                              </span>
                            </div>
                          ) : (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#991b1b", fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 999, border: "1px solid #fecaca", background: "#fef2f2" }}>
                              <Icon d={icons.x} size={11} stroke="#b91c1c" />
                              Unlinked
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "14px 16px", fontWeight: 700, color: "#111827", whiteSpace: "nowrap" }}>{formatRs(p.price)}</td>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: stockColor === "red" ? "#b91c1c" : stockColor === "yellow" ? "#b45309" : "#047857", padding: "3px 8px", borderRadius: 999, border: `1px solid ${stockColor === "red" ? "#fecaca" : stockColor === "yellow" ? "#fed7aa" : "#a7f3d0"}`, background: stockColor === "red" ? "#fef2f2" : stockColor === "yellow" ? "#fffbeb" : "#ecfdf5", width: "fit-content" }}>
                              {stockLabel}
                            </span>
                            <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>{Number(p.quantity || 0).toLocaleString()} units</span>
                          </div>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          {editMode ? (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                              <button onClick={() => handleLinkSupplier(p)} style={{ ...APP_CONTROL_BUTTON_STYLE, padding: "8px 12px", fontSize: 12 }}>Link</button>
                              <button onClick={() => handleRequest(p)} style={{ ...APP_CONTROL_BUTTON_STYLE, padding: "8px 12px", fontSize: 12 }}>Request</button>
                              <button onClick={() => handleEdit(p)} style={{ ...APP_CONTROL_BUTTON_STYLE, padding: "8px 12px", fontSize: 12 }}>Edit</button>
                              <button onClick={() => handleDelete(p.id)} style={{ ...APP_CONTROL_BUTTON_STYLE, padding: "8px 12px", fontSize: 12 }}>Delete</button>
                            </div>
                          ) : (
                            <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 700 }}>Edit mode required</span>
                          )}
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: "14px 16px", fontWeight: 700, color: "#111827" }}>{p.name}</td>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: stockColor === "red" ? "#b91c1c" : stockColor === "yellow" ? "#b45309" : "#047857", padding: "3px 8px", borderRadius: 999, border: `1px solid ${stockColor === "red" ? "#fecaca" : stockColor === "yellow" ? "#fed7aa" : "#a7f3d0"}`, background: stockColor === "red" ? "#fef2f2" : stockColor === "yellow" ? "#fffbeb" : "#ecfdf5", width: "fit-content" }}>
                              {stockLabel}
                            </span>
                            <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>{Number(p.quantity || 0).toLocaleString()} units</span>
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

      <Modal
        open={Boolean(dialog)}
        title={
          dialog?.type === "add-product"
            ? "Add Product"
            : dialog?.type === "edit-quantity"
              ? "Update Quantity"
              : dialog?.type === "link-supplier"
                ? "Link Supplier"
                : dialog?.type === "request-restock"
                  ? "Create Restock Request"
                  : ""
        }
        subtitle={
          dialog?.type === "add-product"
            ? "Create a new inventory item and optionally link it to a supplier."
            : dialog?.type === "edit-quantity"
              ? dialog?.product?.name
              : dialog?.type === "link-supplier"
                ? dialog?.product?.name
                : dialog?.type === "request-restock"
                  ? `${dialog?.product?.name} will be queued for procurement`
                  : ""
        }
        onClose={closeDialog}
        width={dialog?.type === "request-restock" ? 540 : 680}
      >
        <form onSubmit={submitDialog} style={{ display: "grid", gap: 16 }}>
          {dialog?.type === "add-product" ? (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 }}>
                <div style={{ display: "grid", gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Product name</label>
                  <input value={dialogForm.name || ""} onChange={(event) => setDialogForm((current) => ({ ...current, name: event.target.value }))} style={APP_CONTROL_INPUT_STYLE} placeholder="Enter a product name" />
                </div>
                <div style={{ display: "grid", gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>SKU</label>
                  <input value={dialogForm.sku || ""} onChange={(event) => setDialogForm((current) => ({ ...current, sku: event.target.value }))} style={APP_CONTROL_INPUT_STYLE} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14 }}>
                <div style={{ display: "grid", gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Category</label>
                  <input value={dialogForm.category || ""} onChange={(event) => setDialogForm((current) => ({ ...current, category: event.target.value }))} style={APP_CONTROL_INPUT_STYLE} placeholder="General" />
                </div>
                <div style={{ display: "grid", gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Price</label>
                  <input type="number" min="0" step="0.01" value={dialogForm.price || "0"} onChange={(event) => setDialogForm((current) => ({ ...current, price: event.target.value }))} style={APP_CONTROL_INPUT_STYLE} />
                </div>
                <div style={{ display: "grid", gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Quantity</label>
                  <input type="number" min="0" step="1" value={dialogForm.quantity || "0"} onChange={(event) => setDialogForm((current) => ({ ...current, quantity: event.target.value }))} style={APP_CONTROL_INPUT_STYLE} />
                </div>
              </div>
              <SearchableSelect
                label="Supplier"
                placeholder="Select a supplier"
                value={dialogForm.supplierId || ""}
                onChange={(value) => setDialogForm((current) => ({ ...current, supplierId: value }))}
                options={supplierOptions}
                helperText="Optional, but recommended for stock and sourcing workflows."
                emptyText="No suppliers available."
                allowEmptyOption
                emptyOptionLabel="No supplier / Unlinked"
                disabled={!supplierOptions.length}
              />
            </>
          ) : null}

          {dialog?.type === "edit-quantity" ? (
            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>New quantity</label>
              <input type="number" min="0" step="1" value={dialogForm.quantity || "0"} onChange={(event) => setDialogForm((current) => ({ ...current, quantity: event.target.value }))} style={APP_CONTROL_INPUT_STYLE} />
            </div>
          ) : null}

          {dialog?.type === "link-supplier" ? (
            <SearchableSelect
              label="Supplier"
              placeholder="Search by company, contact, or supplier ID"
              value={dialogForm.supplierId || ""}
              onChange={(value) => setDialogForm((current) => ({ ...current, supplierId: value }))}
              options={supplierOptions}
              helperText="This is better than typing s_1, s_2, etc. because it prevents mismatches."
              emptyText="No matching suppliers."
              allowEmptyOption
              emptyOptionLabel="No supplier / Unlinked"
            />
          ) : null}

          {dialog?.type === "request-restock" ? (
            <div style={{ display: "grid", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 }}>
                <div style={{ display: "grid", gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Restock quantity</label>
                  <input type="number" min="1" step="1" value={dialogForm.quantity || "1"} onChange={(event) => setDialogForm((current) => ({ ...current, quantity: event.target.value }))} style={APP_CONTROL_INPUT_STYLE} />
                </div>
                <div style={{ display: "grid", gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Priority</label>
                  <ThemeSelect
                    value={dialogForm.priority || "medium"}
                    onChange={(value) => setDialogForm((current) => ({ ...current, priority: value }))}
                    options={[
                      { value: "low", label: "Low" },
                      { value: "medium", label: "Medium" },
                      { value: "high", label: "High" },
                    ]}
                  />
                </div>
              </div>
              <div style={{ display: "grid", gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Reason</label>
                <textarea value={dialogForm.reason || ""} onChange={(event) => setDialogForm((current) => ({ ...current, reason: event.target.value }))} rows={4} style={{ ...APP_CONTROL_INPUT_STYLE, resize: "vertical", minHeight: 110 }} />
              </div>
            </div>
          ) : null}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, flexWrap: "wrap", paddingTop: 4 }}>
            <button type="button" onClick={closeDialog} style={APP_CONTROL_BUTTON_STYLE}>
              Cancel
            </button>
            <button type="submit" style={{ ...APP_CONTROL_BUTTON_STYLE, border: "1px solid #6d5efc", background: APP_ACCENT_GRADIENT, color: "#fff", boxShadow: APP_ACCENT_SHADOW }}>
              {dialog?.type === "add-product"
                ? "Create Product"
                : dialog?.type === "edit-quantity"
                  ? "Save Quantity"
                  : dialog?.type === "link-supplier"
                    ? "Link Supplier"
                    : "Create Request"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const SuppliersPage = () => {
  const snapshot = useAdminSnapshot();
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [supplierPage, setSupplierPage] = useState(1);
  const [dialog, setDialog] = useState(null);
  const [dialogForm, setDialogForm] = useState({});
  const load = async () => {
    const [supplierList, productList] = await Promise.all([supplierService.list(), productService.list()]);
    setSuppliers(supplierList || []);
    setProducts(productList || []);
  };
  useEffect(() => {
    load();
    const handleDbChange = () => load();
    window.addEventListener("inventory-db-changed", handleDbChange);
    return () => window.removeEventListener("inventory-db-changed", handleDbChange);
  }, []);
  const rows = (suppliers.length ? suppliers : snapshot?.supplierRows || []).map((supplier, index) => {
    const displayName = supplier.companyName || supplier.name || supplier.contactName || "Supplier";
    const linkedItems = products.filter((product) => String(product.supplierId || "") === String(supplier.id || ""));
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
      linkedItems,
    };
  });
  const supplierCategories = ["all", ...new Set(rows.map((row) => row.category).filter(Boolean))];
  const filteredRows = rows.filter((row) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !query ||
      String(row.name || "").toLowerCase().includes(query) ||
      String(row.contact || "").toLowerCase().includes(query) ||
      String(row.email || "").toLowerCase().includes(query) ||
      String(row.phone || "").toLowerCase().includes(query);
    const matchesCategory = categoryFilter === "all" || String(row.category || "").toLowerCase() === categoryFilter.toLowerCase();
    return matchesQuery && matchesCategory;
  });
  const supplierPageCount = Math.max(1, Math.ceil(filteredRows.length / ITEMS_PER_PAGE));
  const visibleSuppliers = filteredRows.slice((supplierPage - 1) * ITEMS_PER_PAGE, supplierPage * ITEMS_PER_PAGE);

  useEffect(() => {
    setSupplierPage((current) => Math.min(current, supplierPageCount));
  }, [supplierPageCount]);

  useEffect(() => {
    setSupplierPage(1);
  }, [searchQuery, categoryFilter]);
  const handleAddSupplier = async () => {
    setDialog({ type: "add-supplier" });
    setDialogForm({
      companyName: "",
      contactName: "",
      category: "General",
      phone: "",
      email: "",
    });
  };
  const handleEditSupplier = async (supplier) => {
    setDialog({ type: "edit-supplier", supplier });
    setDialogForm({
      companyName: supplier.name || supplier.companyName || "",
      contactName: supplier.contact || supplier.contactName || "",
      category: supplier.category || "General",
      phone: supplier.phone || "",
      email: supplier.email || "",
    });
  };
  const handleViewSupplierItems = (supplier) => {
    setDialog({
      type: "view-supplier-items",
      supplier,
      items: products.filter((product) => String(product.supplierId || "") === String(supplier.id || "")),
    });
  };
  const closeDialog = () => {
    setDialog(null);
    setDialogForm({});
  };
  const submitDialog = async (event) => {
    event.preventDefault();
    try {
      const companyName = (dialogForm.companyName || "").trim();
      if (!companyName) {
        alert("Supplier company name is required.");
        return;
      }
      const payload = {
        companyName,
        contactName: (dialogForm.contactName || companyName).trim() || companyName,
        category: (dialogForm.category || "General").trim() || "General",
        phone: (dialogForm.phone || "").trim(),
        email: (dialogForm.email || "").trim(),
      };
      if (dialog?.type === "add-supplier") {
        await supplierService.create({ ...payload, status: "ACTIVE" });
      } else if (dialog?.type === "edit-supplier") {
        await supplierService.update(dialog.supplier.id, payload);
      }
      closeDialog();
      await load();
    } catch (err) {
      alert(err.message || "Failed to save supplier");
    }
  };
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", background: "#f9fafb" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, lineHeight: 1.08, letterSpacing: -0.2, color: "#111827" }}>Supplier Directory</h1>
          <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: 13, fontWeight: 400 }}>Manage and monitor your global network of wholesale partners</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={handleAddSupplier} style={{ padding: "11px 16px", borderRadius: 10, border: "1px solid #111827", background: "#fff", cursor: "pointer", fontWeight: 600, color: "#111827", letterSpacing: 0, boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)" }}>Add Supplier</button>
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
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)", marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr repeat(2, minmax(150px, 1fr)) auto", gap: 12, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}><Icon d={icons.search} size={14} /></span>
            <input
              type="text"
              placeholder="Search supplier name, contact, phone, or email"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              style={{ ...APP_CONTROL_INPUT_STYLE, paddingLeft: 38 }}
            />
          </div>
          <ThemeSelect
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={supplierCategories.map((category) => ({
              value: category,
              label: category === "all" ? "All Categories" : category,
            }))}
          />
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setCategoryFilter("all");
            }}
            style={{ ...APP_CONTROL_BUTTON_STYLE, border: "1px solid #dbeafe", background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)", color: "#1d4ed8" }}
          >
            Reset Filters
          </button>
          <div />
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }}>
        <div style={{ padding: 20, borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111827" }}>Suppliers</h2>
          <Badge color="gray">{filteredRows.length} suppliers</Badge>
        </div>
        <div style={{ overflowX: "auto", maxHeight: 460, overflowY: "auto" }}>
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
                  <td style={{ padding: "14px 16px" }}>
                    {s.linkedItems.length ? (
                      <Badge color={s.statusColor}>
                        {s.linkedItems.length} linked
                      </Badge>
                    ) : (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "#b91c1c", fontSize: 11, fontWeight: 700, padding: "4px 8px", borderRadius: 999, border: "1px solid #fecaca", background: "#fef2f2" }}>
                        <Icon d={icons.x} size={11} stroke="#b91c1c" />
                        Unlinked
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <button
                        type="button"
                        onMouseDown={(event) => event.stopPropagation()}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          handleViewSupplierItems(s);
                        }}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          border: "1px solid #dbeafe",
                          background: "#eff6ff",
                          color: "#1d4ed8",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        title="View linked items"
                      >
                        <Icon d={icons.eye} size={13} stroke="#1d4ed8" />
                      </button>
                      {editMode ? (
                        <button type="button" onClick={() => handleEditSupplier(s)} style={{ padding: "6px 12px", border: "1px solid #111827", borderRadius: 6, background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#111827" }}>
                          Edit Contact
                        </button>
                      ) : (
                        <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 700 }}>Edit mode required</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #e5e7eb", background: "#f9fafb", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "#6b7280" }}>
            Showing {filteredRows.length ? (supplierPage - 1) * ITEMS_PER_PAGE + 1 : 0}-{Math.min(supplierPage * ITEMS_PER_PAGE, filteredRows.length)} of {filteredRows.length} suppliers
          </span>
          <Pagination currentPage={supplierPage} totalPages={supplierPageCount} onPageChange={setSupplierPage} />
        </div>
      </div>

      <Modal
        open={dialog?.type === "add-supplier" || dialog?.type === "edit-supplier"}
        title={dialog?.type === "add-supplier" ? "Add Supplier" : "Edit Supplier"}
        subtitle={dialog?.type === "add-supplier" ? "Create a new supplier profile." : dialog?.supplier?.companyName || dialog?.supplier?.name || ""}
        onClose={closeDialog}
        width={640}
      >
        <form onSubmit={submitDialog} style={{ display: "grid", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 }}>
            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Company name</label>
              <input value={dialogForm.companyName || ""} onChange={(event) => setDialogForm((current) => ({ ...current, companyName: event.target.value }))} style={APP_CONTROL_INPUT_STYLE} placeholder="Acme Electronics" />
            </div>
            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Contact name</label>
              <input value={dialogForm.contactName || ""} onChange={(event) => setDialogForm((current) => ({ ...current, contactName: event.target.value }))} style={APP_CONTROL_INPUT_STYLE} placeholder="Primary contact" />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14 }}>
            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Category</label>
              <input value={dialogForm.category || ""} onChange={(event) => setDialogForm((current) => ({ ...current, category: event.target.value }))} style={APP_CONTROL_INPUT_STYLE} placeholder="General" />
            </div>
            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Phone</label>
              <input value={dialogForm.phone || ""} onChange={(event) => setDialogForm((current) => ({ ...current, phone: event.target.value }))} style={APP_CONTROL_INPUT_STYLE} placeholder="+1 555 123 4567" />
            </div>
            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Email</label>
              <input type="email" value={dialogForm.email || ""} onChange={(event) => setDialogForm((current) => ({ ...current, email: event.target.value }))} style={APP_CONTROL_INPUT_STYLE} placeholder="supplier@example.com" />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, flexWrap: "wrap", paddingTop: 4 }}>
            <button type="button" onClick={closeDialog} style={APP_CONTROL_BUTTON_STYLE}>
              Cancel
            </button>
            <button type="submit" style={{ ...APP_CONTROL_BUTTON_STYLE, border: "1px solid #6d5efc", background: APP_ACCENT_GRADIENT, color: "#fff", boxShadow: APP_ACCENT_SHADOW }}>
              {dialog?.type === "add-supplier" ? "Create Supplier" : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={dialog?.type === "view-supplier-items"}
        title={dialog?.supplier?.companyName || dialog?.supplier?.name || "Linked Items"}
        subtitle="Items currently assigned to this supplier."
        onClose={closeDialog}
        width={720}
      >
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <Badge color={dialog?.items?.length ? "green" : "red"}>
              {dialog?.items?.length || 0} linked items
            </Badge>
            <span style={{ fontSize: 12, color: "#6b7280" }}>{dialog?.supplier?.email || dialog?.supplier?.phone || ""}</span>
          </div>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, overflow: "hidden" }}>
            {dialog?.items?.length ? dialog.items.map((item, index) => {
              const stockLabel = (item.quantity || 0) === 0 ? "Out of stock" : (item.quantity || 0) < 20 ? "Low stock" : "In stock";
              const stockColor = stockLabel === "Out of stock" ? "red" : stockLabel === "Low stock" ? "yellow" : "green";
              return (
                <div key={item.id} style={{ padding: "12px 14px", background: index % 2 === 0 ? "#fff" : "#f9fafb", borderBottom: index === dialog.items.length - 1 ? "none" : "1px solid #eef2f7", display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 700, color: "#111827" }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{item.sku || "No SKU"} • {item.category || "General"}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 700 }}>{Number(item.quantity || 0).toLocaleString()} units</span>
                    <Badge color={stockColor}>{stockLabel}</Badge>
                  </div>
                </div>
              );
            }) : (
              <div style={{ padding: 18, color: "#6b7280", fontSize: 13 }}>No linked items yet.</div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

const SalesPage = () => {
  const snapshot = useAdminSnapshot();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [salesPage, setSalesPage] = useState(1);
  const rows = snapshot?.salesRows || [
    { id: "#TRX-82910", avatar: "AS", name: "Aarav Shrestha", date: "Oct 24, 2023 • 14:22", amount: "Rs. 1,240.00", status: "Completed", statusColor: "green" },
    { id: "#TRX-82909", avatar: "PK", name: "Priya Koirala", date: "Oct 24, 2023 • 12:45", amount: "Rs. 45.90", status: "Pending", statusColor: "yellow" },
    { id: "#TRX-82908", avatar: "NR", name: "Nischal Rai", date: "Oct 23, 2023 • 18:10", amount: "Rs. 3,102.50", status: "Completed", statusColor: "green" },
    { id: "#TRX-82907", avatar: "MG", name: "Mira Gautam", date: "Oct 23, 2023 • 15:30", amount: "Rs. 12.00", status: "Refunded", statusColor: "red" },
    { id: "#TRX-82906", avatar: "ST", name: "Sandeep Thapa", date: "Oct 23, 2023 • 09:12", amount: "Rs. 540.00", status: "Completed", statusColor: "green" },
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
          { label: "Total Revenue", value: formatRs(snapshot?.totalRevenue ?? 124592), sub: "+12.5%", subColor: "#10b981" },
          { label: "Total Orders", value: Number(snapshot?.totalOrders ?? 1284).toLocaleString(), sub: "Synced from orders", subColor: "#10b981" },
          { label: "Avg. Order Value", value: formatRs(snapshot?.avgOrderValue ?? 97.03), sub: "Current average", subColor: "#2563eb" },
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
          <ThemeSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: "all", label: "All Status" },
              { value: "completed", label: "Completed" },
              { value: "pending", label: "Pending" },
              { value: "refunded", label: "Refunded" },
            ]}
          />
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
  const [reportPage, setReportPage] = useState(1);
  const categories = (snapshot?.categoryBreakdown?.length
    ? snapshot.categoryBreakdown
    : (snapshot?.categories || ["Electronics", "Home & Garden", "Automotive", "Office Supplies"]).map((name, index) => ({
        name,
        value: index === 0 ? "Rs. 120.4k" : index === 1 ? "Rs. 94.2k" : index === 2 ? "Rs. 72.1k" : "Rs. 48.8k",
        pct: [100, 78, 60, 40][index] || 25,
      }))).slice(0, 4);
  const rows = snapshot?.autoRestockRows || [
    { id: "AR-1001", sku: "IP-4402-WHT", product: "Wireless Keyboard Pro", supplier: "Sujal Supplies", date: "May 12, 2024", quantity: 180, currentStock: 18, reason: "Auto restock triggered: critical stock level", status: "Pending", statusColor: "yellow" },
    { id: "AR-1002", sku: "IP-1105-GRY", product: "Smart Lighting Kit", supplier: "Govind Hardware", date: "May 11, 2024", quantity: 100, currentStock: 0, reason: "Auto restock triggered: out of stock", status: "Pending", statusColor: "yellow" },
  ];
  const filteredRows = rows.filter((row) => {
    const query = reportQuery.trim().toLowerCase();
    return (
      !query ||
      String(row.id || "").toLowerCase().includes(query) ||
      String(row.sku || "").toLowerCase().includes(query) ||
      String(row.product || "").toLowerCase().includes(query) ||
      String(row.supplier || "").toLowerCase().includes(query) ||
      String(row.reason || "").toLowerCase().includes(query)
    );
  });
  const reportPageCount = Math.max(1, Math.ceil(filteredRows.length / ITEMS_PER_PAGE));
  const visibleReportRows = filteredRows.slice((reportPage - 1) * ITEMS_PER_PAGE, reportPage * ITEMS_PER_PAGE);

  useEffect(() => {
    setReportPage(1);
  }, [reportQuery]);

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
          { label: "Total Sales Revenue", value: formatRs(snapshot?.totalRevenue ?? 284592), sub: "+12.4%", subColor: "#10b981" },
          { label: "Stock Turnover Rate", value: "4.8x / Year", sub: "-3.2%", subColor: "#ef4444" },
          { label: "Auto Restock Requests", value: Number(snapshot?.autoRestockRows?.length ?? 0).toLocaleString(), sub: "System generated", subColor: "#2563eb" },
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
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, marginBottom: 20 }}>
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
      </div>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)", marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr auto", gap: 12, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}><Icon d={icons.search} size={14} /></span>
            <input
              type="text"
              placeholder="Search auto restock request"
              value={reportQuery}
              onChange={(event) => setReportQuery(event.target.value)}
              style={{ ...APP_CONTROL_INPUT_STYLE, paddingLeft: 38 }}
            />
          </div>
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
                {["Request ID", "Product", "Date", "Supplier", "Quantity", "Reason", "Status"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: 0.5, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleReportRows.map((r, idx) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #e5e7eb", transition: "all 0.2s ease", background: idx % 2 === 0 ? "#f9fafb" : "#fff" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#f3f4f6"; }} onMouseLeave={(e) => { e.currentTarget.style.background = idx % 2 === 0 ? "#f9fafb" : "#fff"; }}>
                  <td style={{ padding: "14px 16px", fontWeight: 700, color: "#2563eb" }}>{r.id}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontWeight: 700, color: "#111827" }}>{r.product}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>{r.sku}</div>
                  </td>
                  <td style={{ padding: "14px 16px", color: "#6b7280" }}>{r.date}</td>
                  <td style={{ padding: "14px 16px", color: "#6b7280" }}>{r.supplier}</td>
                  <td style={{ padding: "14px 16px", fontWeight: 600, color: "#111827" }}>{Number(r.quantity || 0).toLocaleString()}</td>
                  <td style={{ padding: "14px 16px", color: "#6b7280" }}>{r.reason}</td>
                  <td style={{ padding: "14px 16px" }}><Badge color={r.statusColor}>{r.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #e5e7eb", background: "#f9fafb", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "#6b7280" }}>
            Showing {filteredRows.length ? (reportPage - 1) * ITEMS_PER_PAGE + 1 : 0}-{Math.min(reportPage * ITEMS_PER_PAGE, filteredRows.length)} of {filteredRows.length} auto restock requests
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
          <tr><td style={{ padding: 8 }}>#ORD-1001</td><td>Wireless Keyboard Pro</td><td>May 12, 2024</td><td style={{ fontWeight: 700 }}>Rs. 129.00</td></tr>
          <tr style={{ background: "#f9fafb" }}><td style={{ padding: 8 }}>#ORD-1002</td><td>Ergonomic Office Chair</td><td>May 09, 2024</td><td style={{ fontWeight: 700 }}>Rs. 499.98</td></tr>
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
            <td style={{ padding: 8, fontWeight: 700 }}>Rs. 12,500.00</td>
            <td style={{ padding: 8 }}><Badge color="green">Completed</Badge></td>
          </tr>
          <tr style={{ background: "#f9fafb" }}>
            <td style={{ padding: 8 }}>RS-8999</td>
            <td style={{ padding: 8 }}>Smart Lighting Kit</td>
            <td style={{ padding: 8 }}>Mar 12, 2024</td>
            <td style={{ padding: 8, fontWeight: 700 }}>Rs. 8,900.00</td>
            <td style={{ padding: 8 }}><Badge color="green">Completed</Badge></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const ProfilePage = ({ role, revenueModeEnabled, onToggleRevenueMode }) => (
  <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", background: "#f9fafb" }}>
    <h1 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.08, letterSpacing: -0.2 }}>Profile</h1>
    <p style={{ color: "#6b7280" }}>Basic account information for the current user.</p>
    <div style={{ marginTop: 12, background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #e5e7eb", display: "grid", gap: 12 }}>
      <div>
        <div style={{ fontWeight: 700 }}>Inventory Pro</div>
        <div style={{ color: "#6b7280", marginTop: 6 }}>Role: {role || "Guest"}</div>
      </div>
      <div style={{ padding: 14, borderRadius: 12, background: revenueModeEnabled ? "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)" : "#f9fafb", border: `1px solid ${revenueModeEnabled ? "#bfdbfe" : "#e5e7eb"}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Fake Revenue Mode</div>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
            {revenueModeEnabled ? "Using the generated 7-day revenue dataset across the site." : "Using live revenue totals from the stored orders and transactions."}
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleRevenueMode}
          style={{
            padding: "10px 14px",
            borderRadius: 999,
            border: `1px solid ${revenueModeEnabled ? "#2563eb" : "#dbe2ea"}`,
            background: revenueModeEnabled ? APP_ACCENT_GRADIENT : "#fff",
            color: revenueModeEnabled ? "#fff" : "#111827",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: revenueModeEnabled ? APP_ACCENT_SHADOW : "0 1px 3px rgba(15, 23, 42, 0.06)",
          }}
        >
          {revenueModeEnabled ? "Enabled" : "Disabled"}
        </button>
      </div>
    </div>
  </div>
);

// removed inline customer and supplier dashboards - now in separate files

// ─── App ──────────────────────────────────────────────────────────────────────
const allowedPages = {
  admin: ["dashboard", "products", "suppliers", "sales", "reports", "profile"],
  customer: ["products", "purchase_history", "profile"],
  supplier: ["restock_requests", "supplied_products", "supply_history", "profile"],
};

const getDefaultPage = (role) => {
  if (role === "customer") return "products";
  if (role === "supplier") return "restock_requests";
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
  const [revenueModeEnabled, setRevenueModeEnabled] = useState(() => dashboardService.getRevenueMode());

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const previousRootFont = root.style.fontFamily;
    const previousBodyFont = body.style.fontFamily;
    root.style.fontFamily = APP_FONT_STACK;
    body.style.fontFamily = APP_FONT_STACK;
    return () => {
      root.style.fontFamily = previousRootFont;
      body.style.fontFamily = previousBodyFont;
    };
  }, []);

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

  useEffect(() => {
    const syncRevenueMode = () => setRevenueModeEnabled(dashboardService.getRevenueMode());
    window.addEventListener("inventory-revenue-mode-changed", syncRevenueMode);
    window.addEventListener("inventory-db-changed", syncRevenueMode);
    return () => {
      window.removeEventListener("inventory-revenue-mode-changed", syncRevenueMode);
      window.removeEventListener("inventory-db-changed", syncRevenueMode);
    };
  }, []);

  const handleToggleRevenueMode = () => {
    const next = !revenueModeEnabled;
    setRevenueModeEnabled(next);
    dashboardService.setRevenueMode(next);
  };

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
    products: "Products",
    suppliers: "Suppliers",
    sales: "Sales",
    reports: "Reports",
    purchase_history: "Purchase History",
    supplied_products: "Supplied Products",
    restock_requests: "Restock Requests",
    supply_history: "Supply History",
    profile: "Profile",
  };

  const currentTitle = pageTitles[page] || "Inventory Pro";

  const handleRefresh = () => {
    window.dispatchEvent(new Event("inventory-db-changed"));
  };

  return (
    <div style={{ fontFamily: APP_FONT_STACK, display: "flex", height: "100vh", overflow: "hidden", background: APP_PAGE_BACKGROUND }}>
      <Sidebar active={page} setPage={setPageAuthorized} onLogout={handleLogout} role={role} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopBar title={currentTitle} onRefresh={handleRefresh} />
        {role === "customer" ? (
          <CustomerDashboard
            page={page}
            revenueModeEnabled={revenueModeEnabled}
            onToggleRevenueMode={handleToggleRevenueMode}
          />
        ) : role === "supplier" ? (
          <SupplierDashboard
            page={page}
            revenueModeEnabled={revenueModeEnabled}
            onToggleRevenueMode={handleToggleRevenueMode}
          />
        ) : (
          <>
            {page === "dashboard" && <DashboardPage />}
            {page === "products" && <ProductsPage role={role} />}
            {page === "suppliers" && <SuppliersPage />}
            {page === "sales" && <SalesPage />}
            {page === "reports" && <ReportsPage />}
            {page === "profile" && <ProfilePage role={role} revenueModeEnabled={revenueModeEnabled} onToggleRevenueMode={handleToggleRevenueMode} />}
          </>
        )}
      </div>
    </div>
  );
}








