import React, { useEffect, useState } from "react";
import {
  Icon,
  Badge,
  StatCard,
  APP_CONTROL_INPUT_STYLE,
  APP_CONTROL_SELECT_STYLE,
  APP_CONTROL_BUTTON_STYLE,
  Pagination,
} from "./components/UI";
import dashboardService from "./services/dashboardService";
import restockService from "./services/restockService";

const ITEMS_PER_PAGE = 100;

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
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, lineHeight: 1.08, letterSpacing: -0.2, color: "#111827" }}>{title}</h1>
      {subtitle ? <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: 13, fontWeight: 400 }}>{subtitle}</p> : null}
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
      padding: "11px 16px",
      borderRadius: 12,
      border: "1px solid #111827",
      background: accent ? "#111827" : "#fff",
      color: accent ? "#fff" : "#111827",
      fontSize: 13,
      fontWeight: 600,
      letterSpacing: 0,
      cursor: "pointer",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
    }}
  >
    <Icon d={icon} size={14} />
    {label}
  </button>
);

const RequestTable = ({ title, description, rows, columns, emptyLabel, pagination }) => (
  <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }}>
    <div style={{ padding: 20, borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111827" }}>{title}</h2>
        {description ? <div style={{ marginTop: 6, fontSize: 12, color: "#6b7280", fontWeight: 400 }}>{description}</div> : null}
      </div>
      <Badge color="blue">{emptyLabel}</Badge>
    </div>
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #e5e7eb", background: "#f9fafb" }}>
            {columns.map((column) => (
              <th key={column} style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: 0.4, textTransform: "uppercase" }}>
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
    {pagination && (
      <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, borderTop: "1px solid #e5e7eb", background: "#f9fafb", flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, color: "#6b7280" }}>
          Showing {pagination.totalItems ? (pagination.currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}-{Math.min(pagination.currentPage * ITEMS_PER_PAGE, pagination.totalItems)} of {pagination.totalItems} requests
        </span>
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={pagination.onPageChange} />
      </div>
    )}
  </div>
);

const SupplierDashboard = ({ page = "supplier" }) => {
  const [snapshot, setSnapshot] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [requestQuery, setRequestQuery] = useState("");
  const [requestPriority, setRequestPriority] = useState("all");
  const [requestStatus, setRequestStatus] = useState("all");
  const [automatedPage, setAutomatedPage] = useState(1);
  const [manualPage, setManualPage] = useState(1);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const data = await dashboardService.getSupplierSnapshot();
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

  const overview = snapshot?.overviewStats || overviewStats;
  const automated = snapshot?.automatedRequests || automatedRequests;
  const manual = snapshot?.manualRequests || manualRequests;
  const activity = snapshot?.activityItems || activityItems;
  const legend = snapshot?.priorityLegend || priorityLegend;
  const statIconMap = {
    truck: <Icon d={icons.truck} />,
    alert: <Icon d={icons.alert} />,
    check: <Icon d={icons.check} />,
    box: <Icon d={icons.box} />,
    clock: <Icon d={icons.clock} />,
  };
  const statIcon = (item) => (item.iconKey ? statIconMap[item.iconKey] || <Icon d={icons.truck} /> : item.icon);

  const handleAcceptRequest = async (requestId) => {
    setSavingId(requestId);
    try {
      await restockService.acceptRequest(requestId, "supplier");
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to accept request");
    } finally {
      setSavingId(null);
    }
  };

  const RequestAction = ({ request }) => {
    const status = String(request.status || "pending").toLowerCase();
    if (status.includes("complete") || status.includes("accept")) {
      return <Badge color="green">Completed</Badge>;
    }
    return (
      <button
        type="button"
        onClick={() => handleAcceptRequest(request.id)}
        disabled={savingId === request.id}
        style={{
          padding: "8px 12px",
          borderRadius: 10,
          border: "1px solid #111827",
          background: "#fff",
          color: "#111827",
          fontSize: 12,
          fontWeight: 600,
          cursor: savingId === request.id ? "not-allowed" : "pointer",
          whiteSpace: "nowrap",
        }}
      >
        {savingId === request.id ? "Accepting..." : "Accept"}
      </button>
    );
  };

  const matchesRequestFilters = (request) => {
    const query = requestQuery.trim().toLowerCase();
    const matchesQuery =
      !query ||
      String(request.id || "").toLowerCase().includes(query) ||
      String(request.product || "").toLowerCase().includes(query) ||
      String(request.reason || "").toLowerCase().includes(query);
    const matchesPriority = requestPriority === "all" || String(request.priority || "").toLowerCase() === requestPriority;
    const requestState = String(request.status || "pending").toLowerCase();
    const matchesStatus =
      requestStatus === "all" ||
      (requestStatus === "open" && !requestState.includes("complete") && !requestState.includes("accept")) ||
      (requestStatus === "completed" && (requestState.includes("complete") || requestState.includes("accept")));
    return matchesQuery && matchesPriority && matchesStatus;
  };

  const filteredAutomated = automated.filter(matchesRequestFilters);
  const filteredManual = manual.filter(matchesRequestFilters);
  const automatedPageCount = Math.max(1, Math.ceil(filteredAutomated.length / ITEMS_PER_PAGE));
  const manualPageCount = Math.max(1, Math.ceil(filteredManual.length / ITEMS_PER_PAGE));
  const visibleAutomated = filteredAutomated.slice((automatedPage - 1) * ITEMS_PER_PAGE, automatedPage * ITEMS_PER_PAGE);
  const visibleManual = filteredManual.slice((manualPage - 1) * ITEMS_PER_PAGE, manualPage * ITEMS_PER_PAGE);

  useEffect(() => {
    setAutomatedPage(1);
    setManualPage(1);
  }, [requestQuery, requestPriority, requestStatus]);

  useEffect(() => {
    setAutomatedPage((current) => Math.min(current, automatedPageCount));
  }, [automatedPageCount]);

  useEffect(() => {
    setManualPage((current) => Math.min(current, manualPageCount));
  }, [manualPageCount]);

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
        {overview.map((stat) => (
          <StatCard key={stat.label} icon={statIcon(stat)} label={stat.label} value={stat.value} sub={stat.sub} subColor={stat.subColor} highlight={stat.label === "Critical Requests"} />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 16, marginBottom: 20 }}>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111827" }}>Priority Overview</h2>
            </div>
            <Badge color="red">3 critical</Badge>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
            {legend.map((item) => (
              <div key={item.label} style={{ padding: 14, borderRadius: 12, border: "1px solid #e5e7eb", background: "#f9fafb" }}>
                <Badge color={item.tone}>{item.label}</Badge>
                <div style={{ marginTop: 10, height: 8, borderRadius: 999, background: "#eef2f7", overflow: "hidden" }}>
                  <div style={{ width: item.label === "Critical" ? "90%" : item.label === "High" ? "72%" : item.label === "Medium" ? "55%" : "28%", height: "100%", borderRadius: 999, background: item.color }} />
                </div>
                <div style={{ marginTop: 10, fontSize: 12, color: "#6b7280", fontWeight: 400 }}>Priority load visualization</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)", display: "grid", gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111827" }}>Request Health</h2>
          {[
            { label: "Auto-generated", value: "68%", color: "#2563eb" },
            { label: "Manual review", value: "22%", color: "#f59e0b" },
            { label: "Fulfillment on time", value: "94%", color: "#10b981" },
          ].map((item) => (
            <div key={item.label} style={{ background: "#f9fafb", borderRadius: 12, padding: "14px 16px", border: "1px solid #eef2f7" }}>
              <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, textTransform: "uppercase" }}>{item.label}</div>
              <div style={{ marginTop: 4, fontSize: 24, fontWeight: 700, color: item.color }}>{item.value}</div>
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
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111827" }}>Request Supply Amount</h3>
            <div style={{ marginTop: 6, fontSize: 12, color: "#6b7280", fontWeight: 400 }}>Set the quantity you want to request before submitting the restock action.</div>
          </div>
          <Badge color="blue">Request amount</Badge>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr auto", gap: 12, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 12, fontWeight: 600 }}>Qty</span>
            <input type="number" min="1" defaultValue="100" style={{ width: "100%", padding: "12px 12px 12px 38px", borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
          </div>
          <button type="button" style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid #111827", background: "#fff", color: "#111827", fontWeight: 600, cursor: "pointer" }}>Priority Level</button>
          <button type="button" style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid #111827", background: "#fff", color: "#111827", fontWeight: 600, cursor: "pointer" }}>Queue Request</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 20 }}>
        {legend.map((item) => (
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
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#111827" }}><Icon d={icons.search} size={14} /></span>
            <input
              type="text"
              placeholder="Search request ID, product, or quantity"
              value={requestQuery}
              onChange={(event) => setRequestQuery(event.target.value)}
            style={{ ...APP_CONTROL_INPUT_STYLE, paddingLeft: 38 }}
          />
          </div>
          <select
            value={requestPriority}
            onChange={(event) => setRequestPriority(event.target.value)}
            style={APP_CONTROL_SELECT_STYLE}
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={requestStatus}
            onChange={(event) => setRequestStatus(event.target.value)}
            style={APP_CONTROL_SELECT_STYLE}
          >
            <option value="all">All Status</option>
            <option value="open">Open Only</option>
            <option value="completed">Completed</option>
          </select>
          <button
            type="button"
            onClick={() => {
              setRequestQuery("");
              setRequestPriority("all");
              setRequestStatus("all");
            }}
            style={APP_CONTROL_BUTTON_STYLE}
          >
            Reset
          </button>
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
    const rows = visibleAutomated.map((item) => ({
      id: item.id,
      cells: [
        { content: item.id, color: "#2563eb", bold: true },
        { content: item.product, bold: true },
        { content: item.stock },
        { content: item.recommended },
        { content: <Badge color={item.priorityTone}>{item.priority}</Badge> },
        { content: <Badge color="blue">{item.sourceLabel || "Auto"}</Badge> },
        { content: <RequestAction request={item} /> },
      ],
    }));

    return renderRequestCenter({
      title: "Automated Restock Requests",
      rows,
      columns: ["Request ID", "Product Name", "Stock Level", "Recommended Quantity", "Priority", "Source", "Action"],
      emptyLabel: "Automated queue",
      pagination: {
        currentPage: automatedPage,
        totalPages: automatedPageCount,
        totalItems: filteredAutomated.length,
        onPageChange: setAutomatedPage,
      },
    });
  };

  const renderManual = () => {
    const rows = visibleManual.map((item) => ({
      id: item.id,
      cells: [
        { content: item.id, color: "#2563eb", bold: true },
        { content: item.product, bold: true },
        { content: item.quantity },
        { content: item.reason },
        { content: <Badge color={item.priorityTone}>{item.priority}</Badge> },
        { content: <Badge color="blue">{item.sourceLabel || "Manual"}</Badge> },
        { content: <RequestAction request={item} /> },
      ],
    }));

    return renderRequestCenter({
      title: "Manual Restock Requests",
      rows,
      columns: ["Request ID", "Product Name", "Requested Quantity", "Reason", "Priority", "Source", "Action"],
      emptyLabel: "Manual queue",
      pagination: {
        currentPage: manualPage,
        totalPages: manualPageCount,
        totalItems: filteredManual.length,
        onPageChange: setManualPage,
      },
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
        {overview.map((stat) => (
          <StatCard key={stat.label} icon={statIcon(stat)} label={stat.label} value={stat.value} sub={stat.sub} subColor={stat.subColor} highlight={stat.label === "Critical Requests"} />
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)", marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr repeat(2, minmax(150px, 1fr)) auto", gap: 12, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#111827" }}><Icon d={icons.search} size={14} /></span>
            <input
              type="text"
              placeholder="Search request ID, product, or reason"
              value={requestQuery}
              onChange={(event) => setRequestQuery(event.target.value)}
            style={{ ...APP_CONTROL_INPUT_STYLE, paddingLeft: 38 }}
          />
          </div>
          <select
            value={requestPriority}
            onChange={(event) => setRequestPriority(event.target.value)}
            style={APP_CONTROL_SELECT_STYLE}
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={requestStatus}
            onChange={(event) => setRequestStatus(event.target.value)}
            style={APP_CONTROL_SELECT_STYLE}
          >
            <option value="all">All Status</option>
            <option value="open">Open Only</option>
            <option value="completed">Completed</option>
          </select>
          <button
            type="button"
            onClick={() => {
              setRequestQuery("");
              setRequestPriority("all");
              setRequestStatus("all");
            }}
            style={APP_CONTROL_BUTTON_STYLE}
          >
            Reset
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        <RequestTable
          title="Automated Restock Requests"
          rows={visibleAutomated.map((item) => ({
            id: item.id,
            cells: [
              { content: item.id, color: "#2563eb", bold: true },
              { content: item.product, bold: true },
              { content: item.stock },
              { content: item.recommended },
              { content: <Badge color={item.priorityTone}>{item.priority}</Badge> },
              { content: <Badge color="blue">{item.sourceLabel || "Auto"}</Badge> },
              { content: <RequestAction request={item} /> },
            ],
          }))}
          columns={["Request ID", "Product Name", "Stock Level", "Recommended Quantity", "Priority", "Source", "Action"]}
          emptyLabel="Auto queue"
          pagination={{
            currentPage: automatedPage,
            totalPages: automatedPageCount,
            totalItems: filteredAutomated.length,
            onPageChange: setAutomatedPage,
          }}
        />

        <RequestTable
          title="Manual Restock Requests"
          rows={visibleManual.map((item) => ({
            id: item.id,
            cells: [
              { content: item.id, color: "#2563eb", bold: true },
              { content: item.product, bold: true },
              { content: item.quantity },
              { content: item.reason },
              { content: <Badge color={item.priorityTone}>{item.priority}</Badge> },
              { content: <Badge color="blue">{item.sourceLabel || "Manual"}</Badge> },
              { content: <RequestAction request={item} /> },
            ],
          }))}
          columns={["Request ID", "Product Name", "Requested Quantity", "Reason", "Priority", "Source", "Action"]}
          emptyLabel="Manual queue"
          pagination={{
            currentPage: manualPage,
            totalPages: manualPageCount,
            totalItems: filteredManual.length,
            onPageChange: setManualPage,
          }}
        />
      </div>

      <div style={{ marginTop: 20, background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111827" }}>Priority Timeline</h2>
          </div>
          <Badge color="orange">Priority focused</Badge>
        </div>
        <div style={{ display: "grid", gap: 12 }}>
          {activity.map((item) => (
            <div key={item.label} style={{ display: "grid", gridTemplateColumns: "14px 1fr auto", gap: 12, alignItems: "start" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", marginTop: 5, background: item.tone === "red" ? "#ef4444" : item.tone === "orange" ? "#f59e0b" : item.tone === "blue" ? "#2563eb" : "#10b981" }} />
              <div style={{ paddingBottom: 10, borderBottom: "1px dashed #e5e7eb" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 400 }}>{item.time}</div>
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
