import React from "react";

export const APP_FONT_STACK = '"Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
export const APP_ACCENT_GRADIENT = "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)";
export const APP_ACCENT_SHADOW = "0 10px 22px rgba(92, 88, 255, 0.18)";
export const APP_PANEL_STYLE = {
  background: "#fff",
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
};
export const APP_CONTROL_INPUT_STYLE = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #cbd5e1",
  background: "#fff",
  color: "#111827",
  fontFamily: APP_FONT_STACK,
  fontSize: 13,
  fontWeight: 500,
  outline: "none",
  boxSizing: "border-box",
};
export const APP_CONTROL_SELECT_STYLE = {
  ...APP_CONTROL_INPUT_STYLE,
  cursor: "pointer",
  appearance: "none",
  backgroundImage: "linear-gradient(45deg, transparent 50%, #94a3b8 50%), linear-gradient(135deg, #94a3b8 50%, transparent 50%)",
  backgroundPosition: "calc(100% - 18px) calc(1em + 2px), calc(100% - 12px) calc(1em + 2px)",
  backgroundSize: "6px 6px, 6px 6px",
  backgroundRepeat: "no-repeat",
  paddingRight: 36,
};
export const APP_CONTROL_BUTTON_STYLE = {
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #111827",
  background: "#fff",
  color: "#111827",
  fontFamily: APP_FONT_STACK,
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
};

export const Icon = ({ d, size = 18, stroke = "currentColor", fill = "none", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

export const Badge = ({ children, color = "green" }) => {
  const colors = {
    green: { bg: "#ecfdf5", text: "#065f46", border: "#a7f3d0", dot: "#10b981" },
    yellow: { bg: "#fffbeb", text: "#92400e", border: "#fed7aa", dot: "#f59e0b" },
    red: { bg: "#fef2f2", text: "#7f1d1d", border: "#fecaca", dot: "#ef4444" },
    blue: { bg: "#eff6ff", text: "#0c2340", border: "#bfdbfe", dot: "#3b82f6" },
    orange: { bg: "#fff7ed", text: "#9a3412", border: "#fed7aa", dot: "#f97316" },
    purple: { bg: "#f5f3ff", text: "#5b21b6", border: "#ddd6fe", dot: "#8b5cf6" },
    teal: { bg: "#f0fdfa", text: "#115e59", border: "#99f6e4", dot: "#14b8a6" },
    gray: { bg: "#f3f4f6", text: "#374151", border: "#d1d5db", dot: "#6b7280" },
  };
  const c = colors[color] || colors.gray;
  return (
    <span style={{ background: c.bg, color: c.text, padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, letterSpacing: 0.2, display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap", border: `1px solid ${c.border}` }}>
      {c.dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot, flexShrink: 0 }} />}
      {children}
    </span>
  );
};

export const StatCard = ({ icon, label, value, sub, subColor = "#10b981", highlight }) => {
  const bgColor = highlight ? "linear-gradient(135deg, #fef2f2 0%, #fef9f3 100%)" : "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)";
  const borderColor = highlight ? "#fde2e2" : "#e5e7eb";
  const iconBg = highlight ? "#fee2e2" : "#e5e7eb";
  const iconColor = highlight ? "#dc2626" : "#6366f1";
  return (
    <div style={{ background: bgColor, border: `1px solid ${borderColor}`, borderRadius: 12, padding: "16px 18px", flex: 1, minWidth: 150, transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", cursor: "pointer", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", color: iconColor }}>
          {icon}
        </div>
        {sub && (
          <span style={{ fontSize: 12, fontWeight: 700, color: subColor, background: subColor === "#10b981" ? "#ecfdf5" : subColor === "#ef4444" ? "#fef2f2" : "#f3f4f6", padding: "2px 8px", borderRadius: 4, display: "inline-flex", alignItems: "center", gap: 3 }}>
            {sub.includes("↑") ? "↑" : "↓"} {sub.replace(/[↑↓]/g, "")}
          </span>
        )}
      </div>
      <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, letterSpacing: 0.4, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: highlight ? "#991b1b" : "#111827", letterSpacing: -0.6 }}>{value}</div>
    </div>
  );
};

const sidebarIcons = {
  dashboard: "M3 13h8V3H3zM13 21h8v-8h-8zM13 3h8v6h-8zM3 17h8v4H3z",
  products: "M4 7h16l-1 13H5L4 7zM9 7V5a3 3 0 0 1 6 0v2",
  suppliers: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20a8 8 0 0 1 16 0",
  sales: "M4 19V5M4 19h16M8 14l3-3 3 2 5-6",
  reports: "M4 19V5h16v14H4zM8 9h8M8 13h5M8 5v4",
  customer: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  purchase_history: "M6 2h12l4 4v16H6zM9 10h6M9 14h6M9 18h4",
  recent_purchases: "M3 6h18M6 6v14h12V6M9 10h6M9 14h4",
  supplied_products: "M4 7h16v10H4zM7 3h10v4H7z",
  restock_requests: "M12 2v6M12 16v6M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h6M16 12h6M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24",
  supply_history: "M4 7h16v14H4zM8 3h8v4H8zM8 11h8M8 15h5",
  profile: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
};

const sidebarNav = {
  admin: [
    { key: "dashboard", label: "Dashboard", icon: sidebarIcons.dashboard },
    { key: "products", label: "Products", icon: sidebarIcons.products },
    { key: "suppliers", label: "Suppliers", icon: sidebarIcons.suppliers },
    { key: "sales", label: "Sales", icon: sidebarIcons.sales },
    { key: "reports", label: "Reports", icon: sidebarIcons.reports },
    { key: "profile", label: "Profile", icon: sidebarIcons.profile },
  ],
  customer: [
    { key: "customer", label: "Customer Home", icon: sidebarIcons.customer },
    { key: "products", label: "Products", icon: sidebarIcons.products },
    { key: "purchase_history", label: "Purchase History", icon: sidebarIcons.purchase_history },
    { key: "recent_purchases", label: "Recent Purchases", icon: sidebarIcons.recent_purchases },
    { key: "profile", label: "Profile", icon: sidebarIcons.profile },
  ],
  supplier: [
    { key: "supplier", label: "Supplier Home", icon: sidebarIcons.customer },
    { key: "supplied_products", label: "Supplied Products", icon: sidebarIcons.supplied_products },
    { key: "restock_requests", label: "Restock Requests", icon: sidebarIcons.restock_requests },
    { key: "supply_history", label: "Supply History", icon: sidebarIcons.supply_history },
    { key: "profile", label: "Profile", icon: sidebarIcons.profile },
  ],
};

const roleSubtitle = {
  admin: "Administrator portal",
  customer: "Customer portal",
  supplier: "Supplier portal",
};

export const Sidebar = ({ active, setPage, onLogout, role }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const items = sidebarNav[role] || sidebarNav.admin;
  const subtitle = roleSubtitle[role] || "Inventory portal";
  const width = collapsed ? 84 : 270;

  return (
    <aside
      style={{
        width,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        color: "#111827",
        borderRight: "1px solid #e5e7eb",
        boxShadow: "2px 0 12px rgba(15, 23, 42, 0.06)",
      }}
    >
      <div style={{ padding: collapsed ? 14 : 20, borderBottom: "1px solid #e5e7eb", background: "linear-gradient(135deg, #f8fbff 0%, #ffffff 100%)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", gap: 12 }}>
          {!collapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: APP_ACCENT_GRADIENT, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 800, flexShrink: 0, boxShadow: APP_ACCENT_SHADOW }}>
                IP
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", letterSpacing: 0.1 }}>Inventory Pro</div>
                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{subtitle}</div>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              background: "#fff",
              color: "#111827",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
              flexShrink: 0,
            }}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Icon d={collapsed ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} size={14} />
          </button>
        </div>
      </div>

      <nav style={{ padding: collapsed ? 10 : 14, display: "flex", flexDirection: "column", gap: 8, flex: 1, alignItems: collapsed ? "center" : "stretch" }}>
        {items.map((item) => {
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setPage(item.key)}
              style={{
                border: "1px solid",
                borderColor: isActive ? "#dbeafe" : "transparent",
                borderRadius: 12,
                padding: collapsed ? "12px" : "12px 14px",
                width: collapsed ? 52 : "100%",
                textAlign: collapsed ? "center" : "left",
                cursor: "pointer",
                color: isActive ? "#1d4ed8" : "#475569",
                background: isActive ? "linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(124,58,237,0.12) 100%)" : "transparent",
                boxShadow: isActive ? "0 4px 14px rgba(92, 88, 255, 0.10)" : "none",
                fontSize: 13,
                fontWeight: isActive ? 700 : 500,
                letterSpacing: 0.1,
                display: "flex",
                alignItems: "center",
                justifyContent: collapsed ? "center" : "flex-start",
                gap: collapsed ? 0 : 10,
              }}
              title={item.label}
            >
              <Icon d={item.icon} size={16} stroke={isActive ? "#5b49ff" : "#64748b"} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: collapsed ? 10 : 14, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <button
          type="button"
          onClick={onLogout}
          style={{
            width: "100%",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: collapsed ? "11px" : "11px 14px",
            background: "#fff",
            color: "#b91c1c",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: collapsed ? 0 : 8,
          }}
          title="Logout"
        >
          <Icon d={sidebarIcons.profile} size={14} stroke="#b91c1c" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

const getPaginationRange = (currentPage, totalPages) => {
  const pages = [];
  if (totalPages <= 5) {
    for (let page = 1; page <= totalPages; page += 1) pages.push(page);
    return pages;
  }
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  pages.push(1);
  if (start > 2) pages.push("ellipsis-start");
  for (let page = start; page <= end; page += 1) pages.push(page);
  if (end < totalPages - 1) pages.push("ellipsis-end");
  pages.push(totalPages);
  return pages;
};

export const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
  const safeTotalPages = Math.max(1, totalPages);
  const safeCurrentPage = Math.min(Math.max(1, currentPage), safeTotalPages);
  const pages = safeTotalPages === 1 ? [1] : getPaginationRange(safeCurrentPage, safeTotalPages);

  const buttonStyle = (active = false, disabled = false) => ({
    minWidth: 34,
    height: 34,
    padding: "0 10px",
    border: "1px solid",
    borderColor: active ? "#6d5efc" : "#dbe2ea",
    borderRadius: 10,
    background: active ? APP_ACCENT_GRADIENT : disabled ? "#f8fafc" : "#fff",
    color: active ? "#fff" : disabled ? "#94a3b8" : "#111827",
    cursor: disabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 13,
    boxShadow: active ? APP_ACCENT_SHADOW : "0 1px 2px rgba(15, 23, 42, 0.04)",
    opacity: disabled ? 0.65 : 1,
    transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
      {safeTotalPages > 1 && (
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, safeCurrentPage - 1))}
          disabled={safeCurrentPage === 1}
          style={buttonStyle(false, safeCurrentPage === 1)}
          aria-label="Previous page"
        >
          <Icon d="M15 18l-6-6 6-6" size={14} stroke={safeCurrentPage === 1 ? "#94a3b8" : "#111827"} />
        </button>
      )}
      {pages.map((page) => {
        if (page === "ellipsis-start" || page === "ellipsis-end") {
          return (
            <span key={page} style={{ minWidth: 22, textAlign: "center", color: "#94a3b8", fontWeight: 700 }}>
              ...
            </span>
          );
        }
        const isActive = page === safeCurrentPage;
        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            style={buttonStyle(isActive)}
            aria-current={isActive ? "page" : undefined}
          >
            {page}
          </button>
        );
      })}
      {safeTotalPages > 1 && (
        <button
          type="button"
          onClick={() => onPageChange(Math.min(safeTotalPages, safeCurrentPage + 1))}
          disabled={safeCurrentPage === safeTotalPages}
          style={buttonStyle(false, safeCurrentPage === safeTotalPages)}
          aria-label="Next page"
        >
          <Icon d="M9 18l6-6-6-6" size={14} stroke={safeCurrentPage === safeTotalPages ? "#94a3b8" : "#111827"} />
        </button>
      )}
    </div>
  );
};
