import React, { useEffect, useRef, useState } from "react";

export const APP_FONT_STACK = '"Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
export const APP_ACCENT_GRADIENT = "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)";
export const APP_ACCENT_SHADOW = "0 10px 22px rgba(92, 88, 255, 0.18)";
export const APP_PAGE_BACKGROUND = "radial-gradient(circle at top left, rgba(37, 99, 235, 0.10), transparent 32%), radial-gradient(circle at top right, rgba(124, 58, 237, 0.08), transparent 28%), linear-gradient(145deg, #eef4ff 0%, #f7faff 52%, #edf2ff 100%)";
export const APP_PANEL_STYLE = {
  background: "linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(248,251,255,0.88) 100%)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  borderRadius: 16,
  border: "1px solid rgba(219, 231, 255, 0.95)",
  boxShadow: "0 12px 32px rgba(15, 23, 42, 0.06)",
};
export const APP_CONTROL_INPUT_STYLE = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid #dbe7ff",
  background: "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,251,255,0.92) 100%)",
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
  backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,251,255,0.92) 100%)",
  backgroundPosition: "0 0",
  backgroundSize: "100% 100%",
  backgroundRepeat: "no-repeat",
  paddingRight: 36,
  boxShadow: "0 8px 18px rgba(15, 23, 42, 0.04)",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
};
export const APP_CONTROL_BUTTON_STYLE = {
  padding: "11px 16px",
  borderRadius: 14,
  border: "1px solid #dbe7ff",
  background: "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,251,255,0.92) 100%)",
  color: "#111827",
  fontFamily: APP_FONT_STACK,
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 8px 18px rgba(15, 23, 42, 0.04)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  whiteSpace: "nowrap",
  transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
};

export const Icon = ({ d, size = 18, stroke = "currentColor", fill = "none", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

export const Badge = ({ children, color = "green" }) => {
  const colors = {
    green: { bg: "rgba(16,185,129,0.10)", text: "#065f46", border: "rgba(16,185,129,0.18)", dot: "#10b981" },
    yellow: { bg: "rgba(245,158,11,0.10)", text: "#92400e", border: "rgba(245,158,11,0.18)", dot: "#f59e0b" },
    red: { bg: "rgba(239,68,68,0.10)", text: "#7f1d1d", border: "rgba(239,68,68,0.18)", dot: "#ef4444" },
    blue: { bg: "rgba(59,130,246,0.10)", text: "#0c2340", border: "rgba(59,130,246,0.18)", dot: "#3b82f6" },
    orange: { bg: "rgba(249,115,22,0.10)", text: "#9a3412", border: "rgba(249,115,22,0.18)", dot: "#f97316" },
    purple: { bg: "rgba(139,92,246,0.10)", text: "#5b21b6", border: "rgba(139,92,246,0.18)", dot: "#8b5cf6" },
    teal: { bg: "rgba(20,184,166,0.10)", text: "#115e59", border: "rgba(20,184,166,0.18)", dot: "#14b8a6" },
    gray: { bg: "rgba(107,114,128,0.10)", text: "#374151", border: "rgba(107,114,128,0.18)", dot: "#6b7280" },
  };
  const c = colors[color] || colors.gray;
  return (
    <span style={{ background: c.bg, color: c.text, padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, letterSpacing: 0.2, display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap", border: `1px solid ${c.border}`, backdropFilter: "blur(8px)" }}>
      {c.dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot, flexShrink: 0 }} />}
      {children}
    </span>
  );
};

export const StatCard = ({ icon, label, value, sub, subColor = "#10b981", highlight }) => {
  const bgColor = highlight
    ? "linear-gradient(145deg, rgba(255,248,247,0.96) 0%, rgba(255,255,255,0.88) 100%)"
    : "linear-gradient(145deg, rgba(255,255,255,0.94) 0%, rgba(247,250,255,0.88) 100%)";
  const borderColor = highlight ? "rgba(252, 165, 165, 0.35)" : "rgba(219, 231, 255, 0.95)";
  const iconBg = highlight ? "rgba(252, 165, 165, 0.18)" : "rgba(37, 99, 235, 0.10)";
  const iconColor = highlight ? "#dc2626" : "#2563eb";
  const accentColor = highlight ? "#dc2626" : subColor;
  return (
    <div style={{ position: "relative", overflow: "hidden", background: bgColor, border: `1px solid ${borderColor}`, borderRadius: 20, padding: "18px 18px 16px", flex: 1, minWidth: 150, transition: "transform 0.2s ease, box-shadow 0.2s ease", cursor: "default", boxShadow: "0 14px 30px rgba(15, 23, 42, 0.07)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}>
      <div style={{ position: "absolute", inset: "0 auto auto 0", width: "100%", height: 4, background: `linear-gradient(90deg, ${accentColor} 0%, rgba(255,255,255,0.65) 100%)` }} />
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12, gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", color: iconColor, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.65)" }}>
          {icon}
        </div>
        {sub && (
          <span style={{ fontSize: 11, fontWeight: 800, color: accentColor, background: `${accentColor}12`, padding: "5px 10px", borderRadius: 999, display: "inline-flex", alignItems: "center", gap: 4, border: `1px solid ${accentColor}22`, whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(15, 23, 42, 0.04)" }}>
            {sub}
          </span>
        )}
      </div>
      <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: highlight ? "#991b1b" : "#0f172a", letterSpacing: -0.8, lineHeight: 1.02 }}>{value}</div>
    </div>
  );
};

export const ThemeSelect = ({ label, value, onChange, options = [], placeholder = "Select...", disabled = false }) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  return (
    <div ref={wrapperRef} style={{ display: "grid", gap: 6, position: "relative" }}>
      {label ? <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{label}</label> : null}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        style={{
          ...APP_CONTROL_INPUT_STYLE,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          cursor: disabled ? "not-allowed" : "pointer",
          color: selected ? "#111827" : "#94a3b8",
          background: disabled ? "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)" : "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
          boxShadow: open ? "0 10px 24px rgba(37, 99, 235, 0.10)" : "0 1px 3px rgba(15, 23, 42, 0.04)",
          borderColor: open ? "#93c5fd" : "#cbd5e1",
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selected?.label || placeholder}</span>
        <span style={{ width: 10, height: 10, borderRight: "2px solid #94a3b8", borderBottom: "2px solid #94a3b8", transform: open ? "translateY(-2px) rotate(225deg)" : "rotate(45deg)", transition: "transform 0.2s ease", flexShrink: 0 }} />
      </button>
      {open ? (
        <div
          style={{
            position: "absolute",
            top: label ? 66 : 46,
            left: 0,
            right: 0,
            zIndex: 30,
            borderRadius: 16,
            border: "1px solid #cbd5e1",
            background: "#fff",
            boxShadow: "0 18px 40px rgba(15, 23, 42, 0.18)",
            overflow: "hidden",
          }}
        >
          <div style={{ maxHeight: 260, overflowY: "auto", padding: 6 }}>
            {options.map((option) => {
              const isActive = option.value === value;
              return (
                <button
                  key={String(option.value)}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "11px 12px",
                    border: "none",
                    borderRadius: 12,
                    background: isActive ? "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)" : "#fff",
                    color: isActive ? "#1d4ed8" : "#111827",
                    cursor: "pointer",
                    display: "grid",
                    gap: 3,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{option.label}</span>
                  {option.description ? <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>{option.description}</span> : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
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
    { key: "products", label: "Products", icon: sidebarIcons.products },
    { key: "purchase_history", label: "Purchase History", icon: sidebarIcons.purchase_history },
    { key: "profile", label: "Profile", icon: sidebarIcons.profile },
  ],
  supplier: [
    { key: "restock_requests", label: "Restock Requests", icon: sidebarIcons.restock_requests },
    { key: "supplied_products", label: "Supplied Products", icon: sidebarIcons.supplied_products },
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
        background: "linear-gradient(180deg, rgba(238,244,255,0.98) 0%, rgba(250,252,255,0.94) 42%, rgba(237,242,255,0.92) 100%)",
        color: "#111827",
        borderRight: "1px solid rgba(219, 231, 255, 0.95)",
        boxShadow: "2px 0 30px rgba(15, 23, 42, 0.08)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
      }}
    >
      <div style={{ padding: collapsed ? 14 : 20, borderBottom: "1px solid rgba(219, 231, 255, 0.9)", background: "linear-gradient(135deg, rgba(248,251,255,0.98) 0%, rgba(255,255,255,0.96) 45%, rgba(239,246,255,0.94) 100%)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", gap: 12 }}>
          {!collapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: APP_ACCENT_GRADIENT, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 800, flexShrink: 0, boxShadow: APP_ACCENT_SHADOW }}>
                IP
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", letterSpacing: 0.1 }}>Inventory Pro</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 2, fontWeight: 500 }}>{subtitle}</div>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              border: "1px solid rgba(219, 231, 255, 0.95)",
              background: collapsed ? "linear-gradient(135deg, rgba(239,246,255,0.98) 0%, rgba(255,255,255,0.95) 100%)" : "rgba(255,255,255,0.96)",
              color: "#1d4ed8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: collapsed ? "0 10px 20px rgba(37, 99, 235, 0.10)" : "0 1px 3px rgba(15, 23, 42, 0.04)",
              flexShrink: 0,
            }}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Icon d={collapsed ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} size={14} stroke="#1d4ed8" />
          </button>
        </div>
      </div>

      <nav style={{ padding: collapsed ? "12px 10px" : "16px 14px", display: "flex", flexDirection: "column", gap: 8, flex: 1, alignItems: collapsed ? "center" : "stretch" }}>
        {items.map((item) => {
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setPage(item.key)}
              style={{
                border: "1px solid",
                borderColor: isActive ? "rgba(96, 165, 250, 0.22)" : "transparent",
                borderRadius: 16,
                padding: collapsed ? "12px 0" : "12px 14px",
                width: collapsed ? 56 : "100%",
                minHeight: 50,
                textAlign: "left",
                cursor: "pointer",
                color: isActive ? "#1d4ed8" : "#475569",
                background: isActive ? "linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(255,255,255,0.96) 100%)" : "transparent",
                boxShadow: isActive ? "0 12px 24px rgba(37, 99, 235, 0.12)" : "none",
                fontSize: 13,
                fontWeight: isActive ? 700 : 600,
                letterSpacing: 0.1,
                display: "flex",
                alignItems: "center",
                justifyContent: collapsed ? "center" : "flex-start",
                gap: collapsed ? 0 : 12,
                position: "relative",
                overflow: "hidden",
                backdropFilter: isActive ? "blur(8px)" : "none",
              }}
              title={item.label}
            >
              {isActive && (
                <span
                  style={{
                    position: "absolute",
                    left: collapsed ? "50%" : 10,
                    top: "50%",
                    width: collapsed ? 24 : 5,
                    height: collapsed ? 24 : 30,
                    borderRadius: collapsed ? "50%" : 999,
                    transform: collapsed ? "translate(-50%, -50%)" : "translateY(-50%)",
                    background: "linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)",
                    opacity: 0.18,
                  }}
                />
              )}
              <span
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 12,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isActive ? "rgba(239, 246, 255, 0.9)" : "transparent",
                  flexShrink: 0,
                }}
              >
                <Icon d={item.icon} size={16} stroke={isActive ? "#1d4ed8" : "#64748b"} />
              </span>
              {!collapsed && <span style={{ position: "relative", zIndex: 1 }}>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: collapsed ? 12 : 14, borderTop: "1px solid rgba(219, 231, 255, 0.9)", background: "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,251,255,0.9) 100%)" }}>
        <button
          type="button"
          onClick={onLogout}
          style={{
            width: "100%",
            border: "1px solid rgba(219, 231, 255, 0.95)",
            borderRadius: 14,
            padding: collapsed ? "11px" : "11px 14px",
            background: "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,251,255,0.92) 100%)",
            color: "#b91c1c",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: collapsed ? 0 : 8,
          }}
          title="Logout"
        >
          <Icon d={sidebarIcons.x || sidebarIcons.profile} size={14} stroke="#b91c1c" />
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
    borderRadius: 12,
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

export const TablePanel = ({ title, subtitle, badge, columns, rows, pagination, emptyText }) => {
  const pageSize = pagination?.pageSize || 100;

  return (
    <div style={{ ...APP_PANEL_STYLE, overflow: "hidden", padding: 0 }}>
      <div style={{ padding: 20, borderBottom: "1px solid rgba(219, 231, 255, 0.95)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", background: "linear-gradient(180deg, rgba(248,251,255,0.94) 0%, rgba(255,255,255,0.98) 100%)" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#0f172a" }}>{title}</h2>
          {subtitle ? <div style={{ marginTop: 6, fontSize: 12, color: "#64748b" }}>{subtitle}</div> : null}
        </div>
        {badge ? <Badge color={badge.color || "blue"}>{badge.label}</Badge> : null}
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid rgba(219, 231, 255, 0.95)", background: "linear-gradient(180deg, rgba(249,250,251,0.98) 0%, rgba(255,255,255,0.94) 100%)" }}>
              {columns.map((column) => (
                <th key={column} style={{ position: "sticky", top: 0, zIndex: 1, textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 800, color: "#94a3b8", letterSpacing: 0.4, textTransform: "uppercase" }}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((row, index) => (
                <tr
                  key={row.id || index}
                  style={{ borderBottom: "1px solid rgba(226, 232, 240, 0.9)", background: index % 2 === 0 ? "#fff" : "#f8fbff", transition: "background 0.18s ease" }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.background = "#eef4ff";
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.background = index % 2 === 0 ? "#fff" : "#f8fbff";
                  }}
                >
                  {row.cells.map((cell, cellIndex) => (
                    <td key={cellIndex} style={{ padding: "14px 16px", color: cell.color || "#111827", fontWeight: 500, verticalAlign: "top" }}>
                      {cell.content}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} style={{ padding: 28, textAlign: "center", color: "#6b7280" }}>
                  {emptyText || "No records found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {pagination ? (
        <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, borderTop: "1px solid rgba(219, 231, 255, 0.95)", background: "linear-gradient(180deg, rgba(249,250,251,0.98) 0%, rgba(255,255,255,0.96) 100%)", flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "#6b7280" }}>
            Showing {pagination.totalItems ? (pagination.currentPage - 1) * pageSize + 1 : 0}-{Math.min(pagination.currentPage * pageSize, pagination.totalItems)} of {pagination.totalItems}
          </span>
          <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={pagination.onPageChange} />
        </div>
      ) : null}
    </div>
  );
};
