import React, { useEffect, useMemo, useState } from "react";
import {
  Icon,
  Badge,
  StatCard,
  TablePanel,
  APP_FONT_STACK,
  APP_PAGE_BACKGROUND,
  APP_CONTROL_INPUT_STYLE,
  APP_CONTROL_BUTTON_STYLE,
  APP_ACCENT_GRADIENT,
  APP_ACCENT_SHADOW,
  APP_PANEL_STYLE,
  APP_PAGE_TITLE_STYLE,
  APP_SECONDARY_ACTION_BUTTON_STYLE,
  ThemeSelect,
} from "./components/UI";
import dashboardService from "./services/dashboardService";
import restockService from "./services/restockService";
import productService from "./services/productService";
import supplierService from "./services/supplierService";

const ITEMS_PER_PAGE = 8;
const SEARCH_INPUT_MAX_LENGTH = 80;
const sanitizeSearchInput = (value) => String(value || "").split("").filter((char) => {
  const code = char.charCodeAt(0);
  return code >= 32 && code !== 127;
}).join("");

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
  x: "M18 6 6 18M6 6l12 12",
  package: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.3 7l8.7 5 8.7-5M12 22V12",
  timeline: "M4 7h16M7 7v10M17 7v10M4 17h16",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
};

const PageHeader = ({ title, subtitle, actions }) => (
  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
    <div style={{ minWidth: 0 }}>
      <h1 style={APP_PAGE_TITLE_STYLE}>{title}</h1>
      {subtitle ? <p style={{ margin: "8px 0 0", color: "#64748b", fontSize: 13, fontWeight: 400, lineHeight: 1.6, maxWidth: 720 }}>{subtitle}</p> : null}
    </div>
    {actions ? <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{actions}</div> : null}
  </div>
);

const ControlChip = ({ icon, label, accent = false, onClick, active = false }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      ...APP_CONTROL_BUTTON_STYLE,
      background: accent ? "#111827" : active ? "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)" : "#fff",
      color: accent ? "#fff" : active ? "#1d4ed8" : "#111827",
      borderColor: accent ? "#111827" : active ? "#bfdbfe" : "#dbe2ea",
      boxShadow: accent ? "0 10px 20px rgba(15, 23, 42, 0.12)" : active ? "0 8px 18px rgba(37, 99, 235, 0.10)" : APP_CONTROL_BUTTON_STYLE.boxShadow,
    }}
  >
    <Icon d={icon} size={14} />
    {label}
  </button>
);

const Panel = ({ children, style = {} }) => (
  <div style={{ ...APP_PANEL_STYLE, padding: 20, ...style }}>{children}</div>
);

const formatCurrency = (value) =>
  `Rs. ${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (value) => {
  const date = new Date(value || Date.now());
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};

const normalizeStatus = (value) => String(value || "").toLowerCase();

const requestStatusLabel = (value) => {
  const status = normalizeStatus(value);
  if (status.includes("complete")) return "Completed";
  if (status.includes("accept")) return "Accepted";
  if (status.includes("deliver")) return "Delivered";
  if (status.includes("pend")) return "Pending";
  return String(value || "Pending");
};

const statusTone = (value) => {
  const status = normalizeStatus(value);
  if (status.includes("complete")) return "green";
  if (status.includes("accept")) return "blue";
  if (status.includes("deliver")) return "orange";
  if (status.includes("pend")) return "yellow";
  if (status.includes("reject") || status.includes("cancel")) return "red";
  return "blue";
};

const priorityTone = (value) => {
  const priority = String(value || "").toLowerCase();
  if (priority === "critical") return "red";
  if (priority === "high") return "orange";
  if (priority === "medium") return "blue";
  return "green";
};

const availabilityTone = (quantity) => {
  const stock = Number(quantity || 0);
  if (stock === 0) return "red";
  if (stock < 20) return "yellow";
  return "green";
};

const SupplierDashboard = ({ page = "restock_requests", revenueModeEnabled, onToggleRevenueMode }) => {
  const [snapshot, setSnapshot] = useState(null);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [savingId, setSavingId] = useState(null);
  const [productQuery, setProductQuery] = useState("");
  const [requestQuery, setRequestQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [requestPriority, setRequestPriority] = useState("all");
  const [requestStatus, setRequestStatus] = useState("all");
  const [requestRange, setRequestRange] = useState("all");
  const [sortMode, setSortMode] = useState("priority");
  const [productPage, setProductPage] = useState(1);
  const [autoPage, setAutoPage] = useState(1);
  const [manualPage, setManualPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const [refreshTick, setRefreshTick] = useState(0);
  const [localRevenueModeEnabled, setLocalRevenueModeEnabled] = useState(() => dashboardService.getRevenueMode());

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const [dashboard, productList, supplierList, requestList] = await Promise.all([
        dashboardService.getSupplierSnapshot(),
        productService.list(),
        supplierService.list(),
        restockService.list(),
      ]);
      if (!mounted) return;
      setSnapshot(dashboard);
      setProducts(productList || []);
      setSuppliers(supplierList || []);
      setRequests(requestList || []);
    };
    load();
    const handleChange = () => load();
    window.addEventListener("inventory-db-changed", handleChange);
    return () => {
      mounted = false;
      window.removeEventListener("inventory-db-changed", handleChange);
    };
  }, [refreshTick]);

  useEffect(() => {
    const syncRevenueMode = () => setLocalRevenueModeEnabled(dashboardService.getRevenueMode());
    window.addEventListener("inventory-revenue-mode-changed", syncRevenueMode);
    window.addEventListener("inventory-db-changed", syncRevenueMode);
    syncRevenueMode();
    return () => {
      window.removeEventListener("inventory-revenue-mode-changed", syncRevenueMode);
      window.removeEventListener("inventory-db-changed", syncRevenueMode);
    };
  }, []);

  const supplierMap = useMemo(() => {
    return new Map(suppliers.map((supplier) => [String(supplier.id), supplier]));
  }, [suppliers]);

  const productRows = useMemo(() => {
    return products.map((product) => {
      const supplier = supplierMap.get(String(product.supplierId || ""));
      const stock = Number(product.quantity || 0);
      const tone = availabilityTone(stock);
      const supplierName = supplier?.companyName || supplier?.name || product.supplierName || "Unassigned";
      return {
        id: product.id,
        sku: product.sku || "-",
        name: product.name || "Product",
        category: product.category || "General",
        supplierName,
        stock,
        price: product.price || 0,
        tone,
      };
    });
  }, [products, supplierMap]);

  const baseRequests = useMemo(() => {
    return (requests.length ? requests : snapshot?.automatedRequests || []).map((request) => {
      const product = products.find((item) => String(item.id) === String(request.productId)) || null;
      return {
        id: request.id,
        productId: request.productId || product?.id || null,
        productName: request.productName || request.product || product?.name || "Restock Request",
        supplierId: request.supplierId || product?.supplierId || null,
        supplierName:
          supplierMap.get(String(request.supplierId || product?.supplierId || ""))?.companyName ||
          supplierMap.get(String(request.supplierId || product?.supplierId || ""))?.contactName ||
          "Supplier",
        quantity: Number(request.quantity || request.recommended || 0),
        stock: Number(request.stock ?? product?.quantity ?? 0),
        recommended: Number(request.recommended || request.quantity || 0),
        reason: request.reason || "Restock request",
        priority: request.priority || "Medium",
        status: request.status || "pending",
        source: request.source || "manual",
        createdAt: request.createdAt || Date.now(),
      };
    });
  }, [products, requests, snapshot, supplierMap]);

  const activeProducts = productRows.filter((row) => {
    const search = productQuery.trim().toLowerCase();
    const availabilityStatus = row.stock === 0 ? "out_of_stock" : row.stock < 20 ? "low_stock" : "in_stock";
    const matchesQuery =
      !search ||
      row.sku.toLowerCase().includes(search) ||
      row.name.toLowerCase().includes(search) ||
      row.category.toLowerCase().includes(search) ||
      row.supplierName.toLowerCase().includes(search);
    const matchesCategory = category === "all" || row.category.toLowerCase() === category;
    const matchesAvailability = availability === "all" || availability === availabilityStatus;
    return matchesQuery && matchesCategory && matchesAvailability;
  });

  const sortRequests = (items) => {
    const weight = { Critical: 0, High: 1, Medium: 2, Low: 3 };
    return [...items].sort((a, b) => {
      if (sortMode === "date") {
        return Number(b.createdAt || 0) - Number(a.createdAt || 0);
      }
      const left = weight[a.priority] ?? 99;
      const right = weight[b.priority] ?? 99;
      if (left !== right) return left - right;
      return Number(b.createdAt || 0) - Number(a.createdAt || 0);
    });
  };

  const matchesRequestFilters = (request) => {
    const search = requestQuery.trim().toLowerCase();
    const requestState = normalizeStatus(request.status);
    const createdAt = Number(request.createdAt || 0);
    const matchesQuery =
      !search ||
      String(request.id || "").toLowerCase().includes(search) ||
      String(request.productName || request.product || "").toLowerCase().includes(search) ||
      String(request.reason || "").toLowerCase().includes(search) ||
      String(request.supplierName || "").toLowerCase().includes(search);
    const matchesPriority = requestPriority === "all" || String(request.priority || "").toLowerCase() === requestPriority;
    const matchesStatus =
      requestStatus === "all" ||
      (requestStatus === "open" && !requestState.includes("complete")) ||
      (requestStatus === "completed" && (requestState.includes("complete") || requestState.includes("accept")));
    const withinRange =
      requestRange === "all" ||
      (createdAt &&
        ((requestRange === "30" && (Date.now() - createdAt) / (1000 * 60 * 60 * 24) <= 30) ||
          (requestRange === "90" && (Date.now() - createdAt) / (1000 * 60 * 60 * 24) <= 90) ||
          (requestRange === "180" && (Date.now() - createdAt) / (1000 * 60 * 60 * 24) <= 180)));
    return matchesQuery && matchesPriority && matchesStatus && withinRange;
  };

  const filteredRequests = sortRequests(baseRequests.filter(matchesRequestFilters));
  const automatedRequests = filteredRequests.filter((item) => String(item.source || "").toLowerCase() === "auto");
  const manualRequests = filteredRequests.filter((item) => String(item.source || "").toLowerCase() !== "auto");
  const completedRequests = baseRequests.filter((item) => normalizeStatus(item.status).includes("complete") || normalizeStatus(item.status).includes("deliver"));

  const productCategories = ["all", ...new Set(productRows.map((row) => row.category).filter(Boolean))];
  const availabilityOptions = [
    { value: "all", label: "All Stock" },
    { value: "in_stock", label: "In Stock" },
    { value: "low_stock", label: "Low Stock" },
    { value: "out_of_stock", label: "Out of Stock" },
  ];

  const productPageCount = Math.max(1, Math.ceil(activeProducts.length / ITEMS_PER_PAGE));
  const visibleProducts = activeProducts.slice((productPage - 1) * ITEMS_PER_PAGE, productPage * ITEMS_PER_PAGE);
  const autoPageCount = Math.max(1, Math.ceil(automatedRequests.length / ITEMS_PER_PAGE));
  const visibleAutomated = automatedRequests.slice((autoPage - 1) * ITEMS_PER_PAGE, autoPage * ITEMS_PER_PAGE);
  const manualPageCount = Math.max(1, Math.ceil(manualRequests.length / ITEMS_PER_PAGE));
  const visibleManual = manualRequests.slice((manualPage - 1) * ITEMS_PER_PAGE, manualPage * ITEMS_PER_PAGE);
  const historyPageCount = Math.max(1, Math.ceil(completedRequests.length / ITEMS_PER_PAGE));
  const visibleHistory = completedRequests.slice((historyPage - 1) * ITEMS_PER_PAGE, historyPage * ITEMS_PER_PAGE);

  useEffect(() => {
    setProductPage(1);
  }, [productQuery, category, availability]);

  useEffect(() => {
    setAutoPage(1);
    setManualPage(1);
    setHistoryPage(1);
  }, [requestQuery, requestPriority, requestStatus, requestRange, sortMode]);

  useEffect(() => {
    setProductPage((current) => Math.min(current, productPageCount));
  }, [productPageCount]);

  useEffect(() => {
    setAutoPage((current) => Math.min(current, autoPageCount));
  }, [autoPageCount]);

  useEffect(() => {
    setManualPage((current) => Math.min(current, manualPageCount));
  }, [manualPageCount]);

  useEffect(() => {
    setHistoryPage((current) => Math.min(current, historyPageCount));
  }, [historyPageCount]);

  const handleAcceptRequest = async (requestId) => {
    setSavingId(requestId);
    try {
      await restockService.acceptRequest(requestId, "supplier");
      setRefreshTick((tick) => tick + 1);
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to accept request");
    } finally {
      setSavingId(null);
    }
  };

  const handleMarkDelivered = async (requestId) => {
    setSavingId(requestId);
    try {
      await restockService.markDelivered(requestId);
      setRefreshTick((tick) => tick + 1);
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to mark request as delivered");
    } finally {
      setSavingId(null);
    }
  };

  const RequestAction = ({ request }) => {
    const status = normalizeStatus(request.status);
    const isComplete = status.includes("complete");
    const isAccepted = status.includes("accept");
    const isDelivered = status.includes("deliver");
    if (isComplete) {
      return <Badge color="green">Completed</Badge>;
    }
    if (isDelivered) {
      return <Badge color="orange">Delivered</Badge>;
    }
    if (isAccepted) {
      return (
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <Badge color="blue">Accepted</Badge>
          <button
            type="button"
            onClick={() => handleMarkDelivered(request.id)}
            disabled={savingId === request.id}
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: "1px solid #111827",
              background: "#fff",
              color: "#111827",
              fontSize: 12,
              fontWeight: 700,
              cursor: savingId === request.id ? "not-allowed" : "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {savingId === request.id ? "Updating..." : "Mark Delivered"}
          </button>
        </div>
      );
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
          fontWeight: 700,
          cursor: savingId === request.id ? "not-allowed" : "pointer",
          whiteSpace: "nowrap",
        }}
      >
        {savingId === request.id ? "Accepting..." : "Accept"}
      </button>
    );
  };

  const renderSuppliedProducts = () => {
    const rows = visibleProducts.map((item) => ({
      id: item.id,
      cells: [
        { content: item.sku, color: "#2563eb", bold: true },
        { content: item.name, bold: true },
        { content: item.category },
        { content: item.supplierName },
        { content: item.stock },
        { content: <Badge color={item.tone}>{item.stock === 0 ? "Out of Stock" : item.stock < 20 ? "Low Stock" : "In Stock"}</Badge> },
        { content: formatCurrency(item.price) },
      ],
    }));

    return (
      <div style={{ display: "grid", gap: 16 }}>
        <PageHeader
          title="Supplied Products"
          subtitle="Review all linked inventory, stock levels, and supplier ownership in one place."
          actions={[
            <ControlChip key="count" icon={icons.package} label={`${activeProducts.length} Items`} active />,
          ]}
        />

        <Panel style={{ position: "relative", zIndex: 3, overflow: "visible" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr repeat(2, minmax(140px, 1fr))", gap: 12, alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#111827" }}>
                <Icon d={icons.search} size={14} />
              </span>
              <input
                type="text"
                placeholder="Search SKU, product, category, or supplier"
                value={productQuery}
                onChange={(event) => setProductQuery(sanitizeSearchInput(event.target.value).slice(0, SEARCH_INPUT_MAX_LENGTH))}
                maxLength={SEARCH_INPUT_MAX_LENGTH}
                aria-label="Search supplied products"
                style={{ ...APP_CONTROL_INPUT_STYLE, paddingLeft: 38 }}
              />
            </div>
            <ThemeSelect
              value={category}
              onChange={setCategory}
              options={productCategories.map((item) => ({ value: item, label: item === "all" ? "All Categories" : item }))}
            />
            <ThemeSelect value={availability} onChange={setAvailability} options={availabilityOptions} />
          </div>
        </Panel>

        <TablePanel
          title="Inventory List"
          subtitle="Supplier-linked stock with live quantities."
          badge={{ label: "Product view", color: "blue" }}
          columns={["SKU", "Product", "Category", "Supplier", "Stock", "Status", "Price"]}
          rows={rows}
          emptyText="No products match the current filters."
          pagination={{
            currentPage: productPage,
            totalPages: productPageCount,
            totalItems: activeProducts.length,
            onPageChange: setProductPage,
          }}
        />
      </div>
    );
  };

  const renderRestockRequests = () => {
    return (
      <div style={{ display: "grid", gap: 16 }}>
        <PageHeader
          title="Restock Requests"
          subtitle="Handle automated and manual requests with the same queue structure used elsewhere in the app."
          actions={[
            <ControlChip key="priority" icon={icons.sort} label={sortMode === "priority" ? "Priority Sort" : "Date Sort"} active={sortMode === "priority"} onClick={() => setSortMode((current) => (current === "priority" ? "date" : "priority"))} />,
            <ControlChip key="range" icon={icons.calendar} label={requestRange === "all" ? "Date Range" : `Last ${requestRange} Days`} active={requestRange !== "all"} onClick={() => setRequestRange((current) => (current === "all" ? "30" : current === "30" ? "90" : current === "90" ? "180" : "all"))} />,
          ]}
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
          <StatCard icon={<Icon d={icons.truck} />} label="Active Requests" value={String(filteredRequests.length || 0)} sub="Live queue" subColor="#2563eb" />
          <StatCard icon={<Icon d={icons.clock} />} label="Pending Requests" value={String(filteredRequests.filter((request) => normalizeStatus(request.status).includes("pend")).length || 0)} sub="Awaiting review" subColor="#f59e0b" />
          <StatCard icon={<Icon d={icons.check} />} label="Fulfilled Requests" value={String(completedRequests.length || 0)} sub="This month" subColor="#10b981" />
          <StatCard icon={<Icon d={icons.alert} />} label="Critical Requests" value={String(filteredRequests.filter((request) => priorityTone(request.priority) === "red").length || 0)} sub="Immediate action" subColor="#ef4444" highlight />
        </div>

        <Panel style={{ position: "relative", zIndex: 3, overflow: "visible" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr repeat(2, minmax(140px, 1fr)) auto", gap: 12, alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#111827" }}>
                <Icon d={icons.search} size={14} />
              </span>
              <input
                type="text"
                placeholder="Search request ID, product, supplier, or reason"
                value={requestQuery}
                onChange={(event) => setRequestQuery(sanitizeSearchInput(event.target.value).slice(0, SEARCH_INPUT_MAX_LENGTH))}
                maxLength={SEARCH_INPUT_MAX_LENGTH}
                aria-label="Search requests"
                style={{ ...APP_CONTROL_INPUT_STYLE, paddingLeft: 38 }}
              />
            </div>
            <ThemeSelect
              value={requestPriority}
              onChange={setRequestPriority}
              options={[
                { value: "all", label: "All Priorities" },
                { value: "critical", label: "Critical" },
                { value: "high", label: "High" },
                { value: "medium", label: "Medium" },
                { value: "low", label: "Low" },
              ]}
            />
            <ThemeSelect
              value={requestStatus}
              onChange={setRequestStatus}
              options={[
                { value: "all", label: "All Status" },
                { value: "open", label: "Open Only" },
                { value: "completed", label: "Completed" },
              ]}
            />
            <button
              type="button"
              onClick={() => {
                setRequestQuery("");
                setRequestPriority("all");
                setRequestStatus("all");
                setRequestRange("all");
              }}
            style={APP_SECONDARY_ACTION_BUTTON_STYLE}
          >
            Reset
          </button>
          </div>
        </Panel>

        <TablePanel
          title="Automated Requests"
          subtitle="Low stock items that need immediate attention."
          badge={{ label: "Auto queue", color: "blue" }}
          columns={["Request ID", "Product", "Supplier", "Quantity", "Priority", "Status", "Action"]}
          rows={visibleAutomated.map((item) => ({
            id: item.id,
            cells: [
              { content: item.id, color: "#2563eb", bold: true },
              { content: item.productName, bold: true },
              { content: item.supplierName },
              { content: item.quantity || item.recommended || 0 },
              { content: <Badge color={priorityTone(item.priority)}>{item.priority}</Badge> },
              { content: <Badge color={statusTone(item.status)}>{requestStatusLabel(item.status)}</Badge> },
              { content: <RequestAction request={item} /> },
            ],
          }))}
          emptyText="No automated requests match the current filters."
          pagination={{
            currentPage: autoPage,
            totalPages: autoPageCount,
            totalItems: automatedRequests.length,
            onPageChange: setAutoPage,
          }}
        />

        <TablePanel
          title="Manual Requests"
          subtitle="Human-made restock requests from the procurement flow."
          badge={{ label: "Manual queue", color: "orange" }}
          columns={["Request ID", "Product", "Supplier", "Quantity", "Priority", "Status", "Action"]}
          rows={visibleManual.map((item) => ({
            id: item.id,
            cells: [
              { content: item.id, color: "#2563eb", bold: true },
              { content: item.productName, bold: true },
              { content: item.supplierName },
              { content: item.quantity || item.recommended || 0 },
              { content: <Badge color={priorityTone(item.priority)}>{item.priority}</Badge> },
              { content: <Badge color={statusTone(item.status)}>{requestStatusLabel(item.status)}</Badge> },
              { content: <RequestAction request={item} /> },
            ],
          }))}
          emptyText="No manual requests match the current filters."
          pagination={{
            currentPage: manualPage,
            totalPages: manualPageCount,
            totalItems: manualRequests.length,
            onPageChange: setManualPage,
          }}
        />
      </div>
    );
  };

  const renderSupplyHistory = () => {
    const rows = visibleHistory.map((item) => ({
      id: item.id,
      cells: [
        { content: item.id, color: "#2563eb", bold: true },
        { content: item.productName, bold: true },
        { content: item.supplierName },
        { content: item.quantity || 0 },
        { content: formatDate(item.createdAt) },
        { content: <Badge color={statusTone(item.status)}>{requestStatusLabel(item.status)}</Badge> },
      ],
    }));

    return (
      <div style={{ display: "grid", gap: 16 }}>
        <PageHeader
          title="Supply History"
          subtitle="Review completed supply actions and the flow of fulfilled restock orders."
          actions={[
            <ControlChip key="timeline" icon={icons.timeline} label="Timeline View" active />,
          ]}
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
          <StatCard icon={<Icon d={icons.check} />} label="Completed" value={String(completedRequests.length || 0)} sub="Archived requests" subColor="#10b981" />
          <StatCard icon={<Icon d={icons.box} />} label="Products Replenished" value={String(completedRequests.length ? completedRequests.reduce((sum, request) => sum + Number(request.quantity || 0), 0) : 0)} sub="Units restored" subColor="#2563eb" />
          <StatCard icon={<Icon d={icons.clock} />} label="Average Turnaround" value={completedRequests.length ? "2.4d" : "0d"} sub="From open to completion" subColor="#f59e0b" />
          <StatCard icon={<Icon d={icons.alert} />} label="Open Items" value={String(filteredRequests.filter((request) => !normalizeStatus(request.status).includes("complete")).length || 0)} sub="Still waiting" subColor="#ef4444" highlight />
        </div>

        <TablePanel
          title="Completed Requests"
          subtitle="A simple archive of fulfilled supply work."
          badge={{ label: "History", color: "green" }}
          columns={["Request ID", "Product", "Supplier", "Quantity", "Date", "Status"]}
          rows={rows}
          emptyText="No completed requests yet."
          pagination={{
            currentPage: historyPage,
            totalPages: historyPageCount,
            totalItems: completedRequests.length,
            onPageChange: setHistoryPage,
          }}
        />
      </div>
    );
  };

  const renderProfile = () => (
    <div style={{ display: "grid", gap: 16 }}>
      <PageHeader
        title="Profile"
        subtitle="Basic account information for the current supplier session."
      />

      <Panel style={{ display: "grid", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontWeight: 700, color: "#111827" }}>Supplier Portal</div>
            <div style={{ color: "#6b7280", marginTop: 6 }}>Role: Supplier</div>
          </div>
          <Badge color="blue">Profile info</Badge>
        </div>

        <div style={{ padding: 14, borderRadius: 12, background: effectiveRevenueModeEnabled ? "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)" : "#f9fafb", border: `1px solid ${effectiveRevenueModeEnabled ? "#bfdbfe" : "#e5e7eb"}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Fake Data Mode</div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
              {effectiveRevenueModeEnabled ? "Using the generated supplier dataset across the site." : "Using live supplier data from the stored requests and products."}
            </div>
          </div>
          <button
            type="button"
            onClick={handleToggleRevenueMode}
            style={{
              padding: "10px 14px",
              borderRadius: 999,
              border: `1px solid ${effectiveRevenueModeEnabled ? "#2563eb" : "#dbe2ea"}`,
              background: effectiveRevenueModeEnabled ? APP_ACCENT_GRADIENT : "#fff",
              color: effectiveRevenueModeEnabled ? "#fff" : "#111827",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: effectiveRevenueModeEnabled ? APP_ACCENT_SHADOW : "0 1px 3px rgba(15, 23, 42, 0.06)",
            }}
          >
            {effectiveRevenueModeEnabled ? "Enabled" : "Disabled"}
          </button>
        </div>
      </Panel>
    </div>
  );

  const renderByPage = {
    restock_requests: renderRestockRequests,
    supplied_products: renderSuppliedProducts,
    supply_history: renderSupplyHistory,
    profile: renderProfile,
  };

  const activePage = page === "supplier" ? "restock_requests" : page;
  const effectiveRevenueModeEnabled = typeof revenueModeEnabled === "boolean" ? revenueModeEnabled : localRevenueModeEnabled;
  const handleToggleRevenueMode = onToggleRevenueMode || (() => {
    const next = !localRevenueModeEnabled;
    setLocalRevenueModeEnabled(next);
    dashboardService.setRevenueMode(next);
  });

  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "20px 24px", background: APP_PAGE_BACKGROUND, fontFamily: APP_FONT_STACK }}>
      {(renderByPage[activePage] || renderRestockRequests)()}
    </div>
  );
};

export default SupplierDashboard;
