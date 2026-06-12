import React from "react";
import { Icon, Badge, StatCard } from "./components/UI";

const icons = {
  truck: "M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM18.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  alert: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  check: "M20 6L9 17l-5-5",
};

// Badge and StatCard imported from shared UI
export default function SupplierDashboard() {
  const products = [
    { name: "Ergonomic Office Chair", current: 120, min: 40, lastDelivery: "Apr 10, 2024" },
    { name: "Wireless Keyboard Pro", current: 18, min: 20, lastDelivery: "May 02, 2024" },
    { name: "Smart Lighting Kit", current: 0, min: 10, lastDelivery: "Mar 12, 2024" },
  ];
  const restocks = [
    { id: "RS-9001", product: "Wireless Keyboard Pro", qty: 200, date: "May 20, 2024", status: "Pending" },
    { id: "RS-9000", product: "Ergonomic Office Chair", qty: 50, date: "Apr 08, 2024", status: "Completed" },
  ];

  const lowCount = products.filter(p => p.current <= p.min).length;

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", background: "#f9fafb" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: "#111827" }}>Supplier Dashboard</h1>
          <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: 13 }}>Supply overview, restock requests and alerts</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 20 }}>
        <StatCard icon={<Icon d={icons.truck} />} label="Products Supplied" value={products.length} sub="Active SKUs" />
        <StatCard icon={<Icon d={icons.alert} />} label="Active Restock Requests" value={restocks.filter(r=>r.status!=="Completed").length} sub="Open" subColor="#f59e0b" />
        <StatCard icon={<Icon d={icons.check} />} label="Completed Deliveries" value={restocks.filter(r=>r.status==="Completed").length} sub="Recent" subColor="#10b981" />
        <StatCard icon={<Icon d={icons.alert} />} label="Low Stock Products" value={lowCount} sub="Action required" subColor="#ef4444" highlight />
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Supplied Products</h2>
        <div style={{ overflowX: "auto", marginTop: 12 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e5e7eb", background: "#f9fafb" }}>
                {["Product Name","Current Inventory","Minimum Stock","Status","Last Delivery"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "12px", fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p,i) => {
                const status = p.current > p.min ? "Sufficient" : p.current === 0 ? "Out of Stock" : "Low Stock";
                const color = status === "Sufficient" ? "green" : status === "Low Stock" ? "yellow" : "red";
                return (
                  <tr key={i} style={{ borderBottom: "1px solid #e5e7eb", background: i % 2 === 0 ? "#f9fafb" : "#fff" }}>
                    <td style={{ padding: 12, fontWeight: 700 }}>{p.name}</td>
                    <td style={{ padding: 12 }}>{p.current}</td>
                    <td style={{ padding: 12 }}>{p.min}</td>
                    <td style={{ padding: 12 }}><Badge color={color}>{status}</Badge></td>
                    <td style={{ padding: 12 }}>{p.lastDelivery}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, marginTop: 12 }}>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 16 }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>Recent Restock Requests</h3>
          <div style={{ marginTop: 12 }}>
            {restocks.map(r => (
              <div key={r.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px dashed #eef2ff" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{r.product}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>{r.date} • Qty {r.qty}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                  <Badge color={r.status === "Completed" ? "green" : "yellow"}>{r.status}</Badge>
                  <button style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff" }}>Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
