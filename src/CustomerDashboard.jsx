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

const ITEMS_PER_PAGE = 100;

const icons = {
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  box: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
  receipt: "M4 2h16a1 1 0 0 1 1 1v18l-3-2-2 2-2-2-2 2-2-2-3 2V3a1 1 0 0 1 1-1z",
  chart: "M18 20V10M12 20V4M6 20v-6",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35",
  filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  calendar: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2z",
  clock: "M12 6v6l4 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  chevronLeft: "M15 18l-6-6 6-6",
  chevronRight: "M9 18l6-6-6-6",
  moreV: "M12 5v.01M12 12v.01M12 19v.01",
  tag: "M20.59 13.41 12 22 2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01",
  bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
  arrowRight: "M5 12h14M13 5l7 7-7 7",
};

const productPlaceholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%23eff6ff'/%3E%3Cstop offset='100%25' stop-color='%23dbeafe'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='120' height='120' rx='24' fill='url(%23g)'/%3E%3Crect x='34' y='26' width='52' height='68' rx='14' fill='%23ffffff' fill-opacity='0.95'/%3E%3Crect x='42' y='36' width='36' height='6' rx='3' fill='%2394a3b8' fill-opacity='0.7'/%3E%3Crect x='42' y='49' width='28' height='6' rx='3' fill='%2394a3b8' fill-opacity='0.55'/%3E%3Crect x='42' y='62' width='32' height='6' rx='3' fill='%2394a3b8' fill-opacity='0.45'/%3E%3Ccircle cx='60' cy='88' r='10' fill='%232563eb' fill-opacity='0.15'/%3E%3Cpath d='M53 88h14' stroke='%232563eb' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E";

const overviewStats = [
  { icon: <Icon d={icons.receipt} />, label: "Total Orders", value: "128", sub: "+12 this month", subColor: "#10b981" },
  { icon: <Icon d={icons.chart} />, label: "Total Purchases", value: "$12,480", sub: "Avg. order $97", subColor: "#2563eb" },
  { icon: <Icon d={icons.bell} />, label: "Recent Activity", value: "3", sub: "Unread updates", subColor: "#f59e0b" },
  { icon: <Icon d={icons.box} />, label: "Products Purchased", value: "42", sub: "Lifetime items", subColor: "#10b981" },
];

const catalogItems = [
  { sku: "IP-2199-SLV", name: 'Ultra HD Monitor 27"', category: "Electronics", price: "$499.00", stock: 86, status: "In Stock", tone: "green", badge: "green" },
  { sku: "IP-4402-WHT", name: "Wireless Keyboard Pro", category: "Electronics", price: "$129.00", stock: 18, status: "Low Stock", tone: "yellow", badge: "yellow" },
  { sku: "IP-1105-GRY", name: "Smart Lighting Kit", category: "Accessories", price: "$89.00", stock: 0, status: "Out of Stock", tone: "red", badge: "red" },
  { sku: "IP-8821-BLK", name: "Ergonomic Office Chair", category: "Furniture", price: "$249.99", stock: 64, status: "In Stock", tone: "green", badge: "green" },
  { sku: "IP-7712-BLU", name: "USB-C Docking Station", category: "Electronics", price: "$179.00", stock: 14, status: "Low Stock", tone: "yellow", badge: "yellow" },
  { sku: "IP-3347-GRN", name: "Desk Organizer Set", category: "Office", price: "$39.00", stock: 0, status: "Out of Stock", tone: "red", badge: "red" },
];

const purchaseHistory = [
  { id: "#ORD-1001", product: "Wireless Keyboard Pro", qty: 1, date: "May 12, 2024", total: "$129.00", status: "Delivered", tone: "green" },
  { id: "#ORD-1002", product: "Ergonomic Office Chair", qty: 2, date: "May 09, 2024", total: "$499.98", status: "Shipped", tone: "yellow" },
  { id: "#ORD-1003", product: "Smart Lighting Kit", qty: 1, date: "Apr 27, 2024", total: "$89.00", status: "Returned", tone: "red" },
  { id: "#ORD-1004", product: "USB-C Docking Station", qty: 3, date: "Apr 18, 2024", total: "$537.00", status: "Processing", tone: "blue" },
  { id: "#ORD-1005", product: "Desk Organizer Set", qty: 2, date: "Apr 11, 2024", total: "$78.00", status: "Delivered", tone: "green" },
];

const activityTimeline = [
  { label: "Bulk reorder completed", detail: "Wireless Keyboard Pro replenished", time: "08:40", tone: "green" },
  { label: "Tracking update received", detail: "Chair shipment reached warehouse", time: "10:25", tone: "blue" },
  { label: "Low stock alert viewed", detail: "Lighting kit added to watchlist", time: "11:10", tone: "yellow" },
  { label: "Return status updated", detail: "Refund issued for damaged item", time: "13:55", tone: "red" },
];

const summaryCards = [
  { label: "Delivered", value: "84", color: "#10b981" },
  { label: "Shipped", value: "22", color: "#2563eb" },
  { label: "Processing", value: "15", color: "#f59e0b" },
  { label: "Returned", value: "7", color: "#ef4444" },
];

const PageHeader = ({ title, subtitle, actions }) => (
  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
    <div>
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, lineHeight: 1.08, letterSpacing: -0.2, color: "#111827" }}>{title}</h1>
      <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: 13, fontWeight: 400 }}>{subtitle}</p>
    </div>
    {actions && (
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {actions}
      </div>
    )}
  </div>
);

const ControlChip = ({ icon, label }) => (
  <button
    type="button"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "11px 16px",
        borderRadius: 12,
        border: "1px solid #e5e7eb",
        background: "#fff",
        color: "#374151",
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

const CustomerDashboard = ({ page = "customer" }) => {
  const [snapshot, setSnapshot] = useState(null);
  const [catalogQuery, setCatalogQuery] = useState("");
  const [catalogCategory, setCatalogCategory] = useState("all");
  const [catalogAvailability, setCatalogAvailability] = useState("all");
  const [historyQuery, setHistoryQuery] = useState("");
  const [historyStatus, setHistoryStatus] = useState("all");
  const [catalogPage, setCatalogPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const data = await dashboardService.getCustomerSnapshot();
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
  const activity = snapshot?.activityTimeline || activityTimeline;
  const summaries = snapshot?.summaryCards || summaryCards;
  const catalog = snapshot?.catalogItems || catalogItems;
  const history = snapshot?.purchaseHistory || purchaseHistory;
  const sortedCatalog = [...catalog].sort((a, b) => {
    const aPriority = a.stock > 0 ? 0 : 1;
    const bPriority = b.stock > 0 ? 0 : 1;
    return aPriority - bPriority;
  });
  const catalogCategories = ["all", ...new Set(catalog.map((item) => item.category))];
  const catalogAvailabilityOptions = [
    { value: "all", label: "All Stock" },
    { value: "in_stock", label: "In Stock" },
    { value: "low_stock", label: "Low Stock" },
    { value: "out_of_stock", label: "Out of Stock" },
  ];
  const filteredCatalog = sortedCatalog.filter((item) => {
    const query = catalogQuery.trim().toLowerCase();
    const matchesQuery =
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.sku.toLowerCase().includes(query);
    const matchesCategory = catalogCategory === "all" || item.category.toLowerCase() === catalogCategory.toLowerCase();
    const availability = item.stock === 0 ? "out_of_stock" : item.stock < 20 ? "low_stock" : "in_stock";
    const matchesAvailability = catalogAvailability === "all" || catalogAvailability === availability;
    return matchesQuery && matchesCategory && matchesAvailability;
  });
  const filteredHistory = history.filter((row) => {
    const query = historyQuery.trim().toLowerCase();
    const matchesQuery =
      !query ||
      row.id.toLowerCase().includes(query) ||
      row.product.toLowerCase().includes(query) ||
      row.total.toLowerCase().includes(query);
    const matchesStatus = historyStatus === "all" || row.status.toLowerCase() === historyStatus;
    return matchesQuery && matchesStatus;
  });
  const catalogPageCount = Math.max(1, Math.ceil(filteredCatalog.length / ITEMS_PER_PAGE));
  const visibleCatalog = filteredCatalog.slice((catalogPage - 1) * ITEMS_PER_PAGE, catalogPage * ITEMS_PER_PAGE);
  const historyPageCount = Math.max(1, Math.ceil(filteredHistory.length / ITEMS_PER_PAGE));
  const visibleHistory = filteredHistory.slice((historyPage - 1) * ITEMS_PER_PAGE, historyPage * ITEMS_PER_PAGE);

  useEffect(() => {
    setCatalogPage(1);
  }, [catalogQuery, catalogCategory, catalogAvailability]);

  useEffect(() => {
    setCatalogPage((current) => Math.min(current, catalogPageCount));
  }, [catalogPageCount]);

  useEffect(() => {
    setHistoryPage(1);
  }, [historyQuery, historyStatus]);

  useEffect(() => {
    setHistoryPage((current) => Math.min(current, historyPageCount));
  }, [historyPageCount]);

  const statIconMap = {
    receipt: <Icon d={icons.receipt} />,
    chart: <Icon d={icons.chart} />,
    bell: <Icon d={icons.bell} />,
    box: <Icon d={icons.box} />,
  };

  const statIcon = (item) => item.iconKey ? (statIconMap[item.iconKey] || <Icon d={icons.box} />) : item.icon;

  const renderDashboard = () => (
    <div>
      <PageHeader
        title="Customer Dashboard"
        subtitle="Purchase activity, order summaries, and a clean view of customer-side inventory demand."
        actions={[
          <ControlChip key="track" icon={icons.search} label="Track Orders" />,
          <ControlChip key="browse" icon={icons.grid} label="Browse Catalog" />,
        ]}
      /> 

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 20 }}>
        {overview.map((stat) => (
          <StatCard key={stat.label} icon={statIcon(stat)} label={stat.label} value={stat.value} sub={stat.sub} subColor={stat.subColor} />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: 16, marginBottom: 20 }}>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111827" }}>Recent Activity</h2>
              <div style={{ marginTop: 6, fontSize: 12, color: "#6b7280", fontWeight: 400 }}>Mock timeline showing the most recent customer-side events.</div>
            </div>
            <Badge color="blue">Updated just now</Badge>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {activity.map((item, index) => (
              <div key={item.label} style={{ display: "grid", gridTemplateColumns: "18px 1fr auto", gap: 12, alignItems: "start" }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", marginTop: 5, background: item.tone === "green" ? "#10b981" : item.tone === "yellow" ? "#f59e0b" : item.tone === "red" ? "#ef4444" : "#2563eb", boxShadow: "0 0 0 4px rgba(37, 99, 235, 0.08)" }} />
                <div style={{ paddingBottom: 12, borderBottom: index === activity.length - 1 ? "none" : "1px dashed #e5e7eb" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{item.detail}</div>
                </div>
                <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 400 }}>{item.time}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)", display: "grid", gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111827" }}>Order Snapshot</h2>
          {summaries.map((card) => (
            <div key={card.label} style={{ background: "#f9fafb", borderRadius: 12, padding: "14px 16px", border: "1px solid #eef2f7" }}>
              <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 }}>{card.label}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: card.color, marginTop: 4 }}>{card.value}</div>
            </div>
          ))}
          <div style={{ marginTop: 4, padding: 14, borderRadius: 12, background: "linear-gradient(135deg, #eff6ff 0%, #f8fbff 100%)", border: "1px solid #dbeafe" }}>
            <div style={{ fontSize: 11, color: "#2563eb", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 }}>Customer health</div>
          </div>
        </div>
      </div>

    </div>
  );

  const renderProducts = () => (
    <div>
      <PageHeader
        title="Product Catalog"
        subtitle="Browse the catalog like a shopping site. In-stock products are shown first."
        actions={[
          <ControlChip key="search" icon={icons.search} label="Search" />,
          <ControlChip key="filter" icon={icons.filter} label="Filter" />,
          <ControlChip key="sort" icon={icons.chart} label="Sort by Demand" />,
        ]}
      />

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)", marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr repeat(3, minmax(140px, 1fr))", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#111827" }}><Icon d={icons.search} size={14} /></span>
            <input
              type="text"
              placeholder="Search products, categories, or SKUs"
              value={catalogQuery}
              onChange={(event) => setCatalogQuery(event.target.value)}
              style={{ ...APP_CONTROL_INPUT_STYLE, paddingLeft: 38 }}
            />
          </div>
          <select
            value={catalogCategory}
            onChange={(event) => setCatalogCategory(event.target.value)}
            style={APP_CONTROL_SELECT_STYLE}
          >
            {catalogCategories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>
          <select
            value={catalogAvailability}
            onChange={(event) => setCatalogAvailability(event.target.value)}
            style={APP_CONTROL_SELECT_STYLE}
          >
            {catalogAvailabilityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => {
              setCatalogQuery("");
              setCatalogCategory("all");
              setCatalogAvailability("all");
            }}
            style={APP_CONTROL_BUTTON_STYLE}
          >
            Reset Filters
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gap: 14 }}>
        {visibleCatalog.map((item) => {
          const isInStock = item.stock > 0;
          const availabilityTone = !isInStock ? "red" : item.stock < 20 ? "yellow" : "green";
          return (
            <div key={item.sku} style={{ background: "#fff", borderRadius: 18, border: "1px solid #e5e7eb", padding: 16, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)", transition: "all 0.2s ease" }}>
              <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 16, alignItems: "start" }}>
                <img
                  src={productPlaceholderImage}
                  alt="Product placeholder"
                  style={{ width: "100%", height: 120, borderRadius: 18, objectFit: "cover", border: "1px solid #dbeafe", background: "#eff6ff" }}
                />
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 12, color: "#2563eb", fontWeight: 600, letterSpacing: 0.3 }}>{item.sku}</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginTop: 4, lineHeight: 1.15 }}>{item.name}</div>
                      <div style={{ fontSize: 13, color: "#6b7280", marginTop: 6 }}>{item.category}</div>
                    </div>
                    <Badge color={availabilityTone}>{isInStock ? "In Stock" : "Out of Stock"}</Badge>
                  </div>
                  <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", fontWeight: 600 }}>Price</div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginTop: 2 }}>{item.price}</div>
                    </div>
                  <button type="button" style={{ border: "1px solid #111827", background: "#fff", borderRadius: 12, padding: "11px 14px", fontSize: 13, fontWeight: 600, color: "#111827", cursor: "pointer" }}>
                      Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, color: "#6b7280" }}>
          Showing {filteredCatalog.length ? (catalogPage - 1) * ITEMS_PER_PAGE + 1 : 0}-{Math.min(catalogPage * ITEMS_PER_PAGE, filteredCatalog.length)} of {filteredCatalog.length} products
        </span>
        <Pagination currentPage={catalogPage} totalPages={catalogPageCount} onPageChange={setCatalogPage} />
      </div>
    </div>
  );

  const renderPurchaseHistory = () => (
    <div>
      <PageHeader
        title="Purchase History"
        subtitle="Searchable mock transaction history with filters, status badges, and pagination controls."
        actions={[
          <ControlChip key="date" icon={icons.calendar} label="Date Filter" />,
        ]}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 20 }}>
        <StatCard icon={<Icon d={icons.receipt} />} label="Orders this year" value="48" sub="+9 from last quarter" subColor="#10b981" />
        <StatCard icon={<Icon d={icons.chart} />} label="Total spend" value="$12,480" sub="Strong retention" subColor="#2563eb" />
        <StatCard icon={<Icon d={icons.bell} />} label="Pending returns" value="2" sub="Needs review" subColor="#f59e0b" />
        <StatCard icon={<Icon d={icons.box} />} label="Fulfilled orders" value="41" sub="On time" subColor="#10b981" />
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)", marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr repeat(2, minmax(150px, 1fr)) auto", gap: 12, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}><Icon d={icons.search} size={14} /></span>
            <input
              type="text"
              placeholder="Search order ID, product, or amount"
              value={historyQuery}
              onChange={(event) => setHistoryQuery(event.target.value)}
              style={{ ...APP_CONTROL_INPUT_STYLE, paddingLeft: 38 }}
            />
          </div>
          <button type="button" style={APP_CONTROL_BUTTON_STYLE}>
            Last 90 Days
          </button>
          <select
            value={historyStatus}
            onChange={(event) => setHistoryStatus(event.target.value)}
            style={APP_CONTROL_SELECT_STYLE}
          >
            <option value="all">All Status</option>
            <option value="delivered">Delivered</option>
            <option value="shipped">Shipped</option>
            <option value="processing">Processing</option>
            <option value="returned">Returned</option>
          </select>
          <button
            type="button"
            onClick={() => {
              setHistoryQuery("");
              setHistoryStatus("all");
            }}
            style={APP_CONTROL_BUTTON_STYLE}
          >
            Reset
          </button>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }}>
        <div style={{ padding: 20, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, borderBottom: "1px solid #e5e7eb", flexWrap: "wrap" }}>
          <div>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111827" }}>Order Table</h2>
            <div style={{ marginTop: 6, fontSize: 12, color: "#6b7280" }}>Structured to match the admin dashboard table styling.</div>
          </div>
          <Badge color="blue">{filteredHistory.length} results</Badge>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e5e7eb", background: "#f9fafb" }}>
                {[
                  "Order ID",
                  "Product",
                  "Quantity",
                  "Date Purchased",
                  "Amount",
                  "Status",
                ].map((header) => (
                  <th key={header} style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: 0.4, textTransform: "uppercase" }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleHistory.map((row, index) => (
                <tr key={row.id} style={{ borderBottom: "1px solid #e5e7eb", background: index % 2 === 0 ? "#fff" : "#f9fafb" }}>
                  <td style={{ padding: "14px 16px", color: "#2563eb", fontWeight: 600 }}>{row.id}</td>
                  <td style={{ padding: "14px 16px", fontWeight: 500, color: "#111827" }}>{row.product}</td>
                  <td style={{ padding: "14px 16px", color: "#6b7280" }}>{row.qty}</td>
                  <td style={{ padding: "14px 16px", color: "#6b7280" }}>{row.date}</td>
                  <td style={{ padding: "14px 16px", fontWeight: 600, color: "#111827" }}>{row.total}</td>
                  <td style={{ padding: "14px 16px" }}><Badge color={row.tone}>{row.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #e5e7eb", background: "#f9fafb", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "#6b7280" }}>
            Showing {filteredHistory.length ? (historyPage - 1) * ITEMS_PER_PAGE + 1 : 0}-{Math.min(historyPage * ITEMS_PER_PAGE, filteredHistory.length)} of {filteredHistory.length} orders
          </span>
          <Pagination currentPage={historyPage} totalPages={historyPageCount} onPageChange={setHistoryPage} />
        </div>
      </div>
    </div>
  );

  const renderByPage = {
    customer: renderDashboard,
    products: renderProducts,
    purchase_history: renderPurchaseHistory,
  };

  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "20px 24px", background: "#f9fafb" }}>
      {(renderByPage[page] || renderDashboard)()}
    </div>
  );
};

export default CustomerDashboard;

