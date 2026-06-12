import React from "react";
import { Icon, Badge, StatCard } from "./components/UI";

const icons = {
  receipt: "M4 2h16a1 1 0 0 1 1 1v18l-3-2-2 2-2-2-2 2-2-2-3 2V3a1 1 0 0 1 1-1z",
  box: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
  chart: "M18 20V10M12 20V4M6 20v-6",
  bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
};

// Badge and StatCard imported from shared UI

export default function CustomerDashboard() {
  const recent = [
    { id: "#ORD-1001", name: "Wireless Keyboard Pro", qty: 1, date: "May 12, 2024", total: "$129.00", status: "Delivered" },
    { id: "#ORD-1002", name: "Ergonomic Office Chair", qty: 2, date: "May 09, 2024", total: "$499.98", status: "Shipped" },
    { id: "#ORD-1003", name: "Smart Lighting Kit", qty: 1, date: "Apr 27, 2024", total: "$89.00", status: "Cancelled" },
  ];
  const products = [
    { img: null, name: 'Ultra HD Monitor 27"', category: "Electronics", price: "$499.00", stock: "In Stock", stockColor: "green" },
    { img: null, name: "Wireless Keyboard Pro", category: "Electronics", price: "$129.00", stock: "Low Stock", stockColor: "yellow" },
    { img: null, name: "Smart Lighting Kit", category: "Electronics", price: "$89.00", stock: "Out of Stock", stockColor: "red" },
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", background: "#f9fafb" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: "#111827" }}>Customer Dashboard</h1>
          <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: 13 }}>Purchase activity, orders and profile</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 20 }}>
        <StatCard icon={<Icon d={icons.receipt} />} label="Total Orders" value="128" sub="Last 30d" />
        <StatCard icon={<Icon d={icons.box} />} label="Products Purchased" value="342" sub="Lifetime" />
        <StatCard icon={<Icon d={icons.chart} />} label="Amount Spent" value="$12,480" sub="Avg order $97" />
        <StatCard icon={<Icon d={icons.bell} />} label="Recent Activity" value="3" sub="Notifications" />
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Purchase History</h2>
        <div style={{ overflowX: "auto", marginTop: 12 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e5e7eb", background: "#f9fafb" }}>
                {["Transaction ID", "Product Name", "Quantity", "Date Purchased", "Total Cost", "Status"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "12px", fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map(r => (
                <tr key={r.id} style={{ borderBottom: "1px solid #e5e7eb", background: "#fff" }}>
                  <td style={{ padding: 12, color: "#2563eb", fontWeight: 700 }}>{r.id}</td>
                  <td style={{ padding: 12 }}>{r.name}</td>
                  <td style={{ padding: 12 }}>{r.qty}</td>
                  <td style={{ padding: 12 }}>{r.date}</td>
                  <td style={{ padding: 12, fontWeight: 800 }}>{r.total}</td>
                  <td style={{ padding: 12 }}><Badge color={r.status === "Delivered" ? "green" : r.status === "Shipped" ? "yellow" : "red"}>{r.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
