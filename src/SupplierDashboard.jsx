import React from "react";
import { Icon, Badge, StatCard } from "./components/UI";

const icons = {
  truck: "M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM18.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  alert: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  check: "M20 6L9 17l-5-5",
  box: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35",
  filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  sort: "M3 6h18M7 12h10M11 18h2",
  calendar: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2z",
  clock: "M12 6v6l4 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  receipt: "M4 2h16a1 1 0 0 1 1 1v18l-3-2-2 2-2-2-2 2-2-2-3 2V3a1 1 0 0 1 1-1z",
  arrowRight: "M5 12h14M13 5l7 7-7 7",
};

const overviewStats = [
  { icon: <Icon d={icons.truck} />, label: "Active Requests", value: "24", sub: "Live queue", subColor: "#2563eb" },
  { icon: <Icon d={icons.clock} />, label: "Pending Requests", value: "8", sub: "Awaiting review", subColor: "#f59e0b" },
  { icon: <Icon d={icons.check} />, label: "Fulfilled Requests", value: "61", sub: "This month", subColor: "#10b981" },
  { icon: <Icon d={icons.alert} />, label: "Critical Requests", value: "3", sub: "Immediate action", subColor: "#ef4444" },
];

const automatedRequests = [
  { id: "AR-1021", product: "Wireless Keyboard Pro", stock: 18, recommended: 180, priority: "Critical", priorityTone: "red" },
  { id: "AR-1020", product: "Smart Lighting Kit", stock: 0, recommended: 240, priority: "High", priorityTone: "orange" },
  { id: "AR-1019", product: "USB-C Docking Station", stock: 12, recommended: 120, priority: "Medium", priorityTone: "blue" },
  { id: "AR-1018", product: "Desk Organizer Set", stock: 9, recommended: 90, priority: "Low", priorityTone: "green" },
];

const manualRequests = [
  { id: "MR-2211", product: "Ergonomic Office Chair", quantity: 50, reason: "Seasonal office refresh", priority: "High", priorityTone: "orange" },
  { id: "MR-2210", product: "Conference Speaker Set", quantity: 25, reason: "Upcoming enterprise order", priority: "Critical", priorityTone: "red" },
  { id: "MR-2209", product: "Desk Lamp", quantity: 40, reason: "New workstation rollout", priority: "Medium", priorityTone: "blue" },
  { id: "MR-2208", product: "Cable Management Kit", quantity: 70, reason: "Warehouse cleanup request", priority: "Low", priorityTone: "green" },
];

const activityItems = [
  { label: "Priority escalation detected", detail: "Automated request AR-1021 marked critical", time: "08:05", tone: "red" },
  { label: "Vendor acknowledgement received", detail: "AR-1020 moved to approved state", time: "09:20", tone: "blue" },
  { label: "Manual request submitted", detail: "MR-2211 added by procurement team", time: "11:40", tone: "orange" },
  { label: "Fulfillment completed", detail: "MR-2207 closed and archived", time: "14:15", tone: "green" },
];

const priorityLegend = [
  { label: "Critical", color: "#ef4444", tone: "red" },
  { label: "High", color: "#f59e0b", tone: "yellow" },
  { label: "Medium", color: "#2563eb", tone: "blue" },
  { label: "Low", color: "#10b981", tone: "green" },
];

const PageHeader = ({ title, subtitle, actions }) => (
  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
    <div>
      <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: "#111827" }}>{title}</h1>
      {subtitle ? <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: 13 }}>{subtitle}</p> : null}
    </div>
    {actions && <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{actions}</div>}
  </div>
);

const ControlChip = ({ icon, label, accent = false }) => (
  <button
    type="button"
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "10px 14px",
      borderRadius: 12,
      border: accent ? "1px solid #dbeafe" : "1px solid #e5e7eb",
      background: accent ? "#eff6ff" : "#fff",
      color: accent ? "#1d4ed8" : "#374151",
      fontSize: 12,
      fontWeight: 800,
      cursor: "pointer",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
    }}
  >
    <Icon d={icon} size={14} />
    {label}
  </button>
);

const RequestTable = ({ title, description, rows, columns, emptyLabel }) => (
  <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }}>
    <div style={{ padding: 20, borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#111827" }}>{title}</h2>
        {description ? <div style={{ marginTop: 6, fontSize: 12, color: "#6b7280" }}>{description}</div> : null}
      </div>
      <Badge color="blue">{emptyLabel}</Badge>
    </div>
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #e5e7eb", background: "#f9fafb" }}>
            {columns.map((column) => (
              <th key={column} style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: 0.5, textTransform: "uppercase" }}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id} style={{ borderBottom: "1px solid #e5e7eb", background: index % 2 === 0 ? "#fff" : "#f9fafb" }}>
              {row.cells.map((cell, cellIndex) => (
                <td key={cellIndex} style={{ padding: "14px 16px", color: cell.color || "#111827", fontWeight: cell.bold ? 800 : 500 }}>
                  {cell.content}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const SupplierDashboard = ({ page = "supplier" }) => {
  const renderDashboard = () => (
    <div>
      <PageHeader
        title="Supplier Dashboard"
        actions={[
          <ControlChip key="review" icon={icons.alert} label="Priority Review" accent />,
          <ControlChip key="new" icon={icons.receipt} label="New Request" />,
        ]}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 20 }}>
        {overviewStats.map((stat) => (
          <StatCard key={stat.label} icon={stat.icon} label={stat.label} value={stat.value} sub={stat.sub} subColor={stat.subColor} highlight={stat.label === "Critical Requests"} />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 16, marginBottom: 20 }}>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#111827" }}>Priority Overview</h2>
            </div>
            <Badge color="red">3 critical</Badge>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
            {priorityLegend.map((item) => (
              <div key={item.label} style={{ padding: 14, borderRadius: 12, border: "1px solid #e5e7eb", background: "#f9fafb" }}>
                <Badge color={item.tone}>{item.label}</Badge>
                <div style={{ marginTop: 10, height: 8, borderRadius: 999, background: "#eef2f7", overflow: "hidden" }}>
                  <div style={{ width: item.label === "Critical" ? "90%" : item.label === "High" ? "72%" : item.label === "Medium" ? "55%" : "28%", height: "100%", borderRadius: 999, background: item.color }} />
                </div>
                <div style={{ marginTop: 10, fontSize: 12, color: "#6b7280", fontWeight: 700 }}>Priority load visualization</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)", display: "grid", gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#111827" }}>Request Health</h2>
          {[
            { label: "Auto-generated", value: "68%", color: "#2563eb" },
            { label: "Manual review", value: "22%", color: "#f59e0b" },
            { label: "Fulfillment on time", value: "94%", color: "#10b981" },
          ].map((item) => (
            <div key={item.label} style={{ background: "#f9fafb", borderRadius: 12, padding: "14px 16px", border: "1px solid #eef2f7" }}>
              <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 700, textTransform: "uppercase" }}>{item.label}</div>
              <div style={{ marginTop: 4, fontSize: 24, fontWeight: 900, color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRequestCenter = ({ title, subtitle, rows, columns, emptyLabel }) => (
    <div>
      <PageHeader
        title={title}
        actions={[
          <ControlChip key="priority" icon={icons.sort} label="Priority Sort" accent />,
          <ControlChip key="calendar" icon={icons.calendar} label="Date Range" />,
        ]}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 20 }}>
        <StatCard icon={<Icon d={icons.truck} />} label="Active Requests" value="24" sub="In the queue" subColor="#2563eb" />
        <StatCard icon={<Icon d={icons.clock} />} label="Pending Requests" value="8" sub="Awaiting decision" subColor="#f59e0b" />
        <StatCard icon={<Icon d={icons.check} />} label="Fulfilled Requests" value="61" sub="This month" subColor="#10b981" />
        <StatCard icon={<Icon d={icons.alert} />} label="Critical Requests" value="3" sub="Needs review" subColor="#ef4444" highlight />
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#111827" }}>Request Supply Amount</h3>
            <div style={{ marginTop: 6, fontSize: 12, color: "#6b7280" }}>Set the quantity you want to request before submitting the restock action.</div>
          </div>
          <Badge color="blue">Request amount</Badge>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr auto", gap: 12, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 12, fontWeight: 700 }}>Qty</span>
            <input type="number" min="1" defaultValue="100" style={{ width: "100%", padding: "12px 12px 12px 38px", borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
          </div>
          <button type="button" style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid #e5e7eb", background: "#fff", fontWeight: 700, cursor: "pointer" }}>Priority Level</button>
          <button type="button" style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid #dbeafe", background: "#eff6ff", color: "#1d4ed8", fontWeight: 800, cursor: "pointer" }}>Queue Request</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 20 }}>
        {priorityLegend.map((item) => (
          <div key={item.label} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 14, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <Badge color={item.tone}>{item.label}</Badge>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.color }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)", marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr repeat(2, minmax(150px, 1fr)) auto", gap: 12, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}><Icon d={icons.search} size={14} /></span>
            <input
              type="text"
              placeholder="Search request ID, product, or quantity"
              style={{ width: "100%", padding: "12px 12px 12px 38px", borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 13, outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <button type="button" style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid #e5e7eb", background: "#fff", fontWeight: 700, cursor: "pointer" }}>Critical</button>
          <button type="button" style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid #e5e7eb", background: "#fff", fontWeight: 700, cursor: "pointer" }}>Open Only</button>
          <button type="button" style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid #dbeafe", background: "#eff6ff", color: "#1d4ed8", fontWeight: 800, cursor: "pointer" }}>Apply</button>
        </div>
      </div>

      <RequestTable
        title={title}
        rows={rows}
        columns={columns}
        emptyLabel={emptyLabel}
      />
    </div>
  );

  const renderAutomated = () => {
    const rows = automatedRequests.map((item) => ({
      id: item.id,
      cells: [
        { content: item.id, color: "#2563eb", bold: true },
        { content: item.product, bold: true },
        { content: item.stock },
        { content: item.recommended },
        { content: <Badge color={item.priorityTone}>{item.priority}</Badge> },
        { content: <Badge color={item.statusTone}>{item.status}</Badge> },
      ],
    }));

    return renderRequestCenter({
      title: "Automated Restock Requests",
      rows,
      columns: ["Request ID", "Product Name", "Stock Level", "Recommended Quantity", "Priority", "Status"],
      emptyLabel: "Automated queue",
    });
  };

  const renderManual = () => {
    const rows = manualRequests.map((item) => ({
      id: item.id,
      cells: [
        { content: item.id, color: "#2563eb", bold: true },
        { content: item.product, bold: true },
        { content: item.quantity },
        { content: item.reason },
        { content: <Badge color={item.priorityTone}>{item.priority}</Badge> },
        { content: <Badge color={item.statusTone}>{item.status}</Badge> },
      ],
    }));

    return renderRequestCenter({
      title: "Manual Restock Requests",
      rows,
      columns: ["Request ID", "Product Name", "Requested Quantity", "Reason", "Priority", "Status"],
      emptyLabel: "Manual queue",
    });
  };

  const renderCombinedCenter = () => (
    <div>
      <PageHeader
        title="Request Center"
        actions={[
          <ControlChip key="sort" icon={icons.sort} label="Priority Sort" accent />,
          <ControlChip key="calendar" icon={icons.calendar} label="Date Filter" />,
        ]}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 20 }}>
        {overviewStats.map((stat) => (
          <StatCard key={stat.label} icon={stat.icon} label={stat.label} value={stat.value} sub={stat.sub} subColor={stat.subColor} highlight={stat.label === "Critical Requests"} />
        ))}
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        <RequestTable
          title="Automated Restock Requests"
          rows={automatedRequests.map((item) => ({
            id: item.id,
            cells: [
              { content: item.id, color: "#2563eb", bold: true },
              { content: item.product, bold: true },
              { content: item.stock },
              { content: item.recommended },
              { content: <Badge color={item.priorityTone}>{item.priority}</Badge> },
            ],
          }))}
          columns={["Request ID", "Product Name", "Stock Level", "Recommended Quantity", "Priority"]}
          emptyLabel="Auto queue"
        />

        <RequestTable
          title="Manual Restock Requests"
          rows={manualRequests.map((item) => ({
            id: item.id,
            cells: [
              { content: item.id, color: "#2563eb", bold: true },
              { content: item.product, bold: true },
              { content: item.quantity },
              { content: item.reason },
              { content: <Badge color={item.priorityTone}>{item.priority}</Badge> },
            ],
          }))}
          columns={["Request ID", "Product Name", "Requested Quantity", "Reason", "Priority"]}
          emptyLabel="Manual queue"
        />
      </div>

      <div style={{ marginTop: 20, background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#111827" }}>Priority Timeline</h2>
          </div>
          <Badge color="orange">Priority focused</Badge>
        </div>
        <div style={{ display: "grid", gap: 12 }}>
          {activityItems.map((item) => (
            <div key={item.label} style={{ display: "grid", gridTemplateColumns: "14px 1fr auto", gap: 12, alignItems: "start" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", marginTop: 5, background: item.tone === "red" ? "#ef4444" : item.tone === "orange" ? "#f59e0b" : item.tone === "blue" ? "#2563eb" : "#10b981" }} />
              <div style={{ paddingBottom: 10, borderBottom: "1px dashed #e5e7eb" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#111827" }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 700 }}>{item.time}</div>
                </div>
                <div style={{ marginTop: 4, fontSize: 12, color: "#6b7280" }}>{item.detail}</div>
              </div>
              <Icon d={icons.arrowRight} size={16} stroke="#cbd5e1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderByPage = {
    supplier: renderDashboard,
    restock_requests: renderCombinedCenter,
    automated_requests: renderAutomated,
    manual_requests: renderManual,
  };

  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "20px 24px", background: "#f9fafb" }}>
      {(renderByPage[page] || renderDashboard)()}
    </div>
  );
};

export default SupplierDashboard;
