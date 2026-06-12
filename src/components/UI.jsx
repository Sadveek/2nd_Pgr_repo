import React from "react";

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
    gray: { bg: "#f3f4f6", text: "#374151", border: "#d1d5db", dot: "#6b7280" },
  };
  const c = colors[color] || colors.gray;
  return (
    <span style={{ background: c.bg, color: c.text, padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, letterSpacing: 0.3, display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap", border: `1px solid ${c.border}` }}>
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
      <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: highlight ? "#991b1b" : "#111827", letterSpacing: -0.8 }}>{value}</div>
    </div>
  );
};
