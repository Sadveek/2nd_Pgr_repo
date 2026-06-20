import mockData from "../mockData";
import restockService from "./restockService";

const REVENUE_MODE_KEY = "inventory_revenue_mode_v1";

function readStoredBoolean(key, fallback = true) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return raw === "true";
  } catch (error) {
    return fallback;
  }
}

function writeStoredBoolean(key, value) {
  try {
    localStorage.setItem(key, value ? "true" : "false");
  } catch (error) {
    // ignore storage failures in non-browser contexts
  }
}

function emitRevenueModeChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("inventory-db-changed"));
    window.dispatchEvent(new Event("inventory-revenue-mode-changed"));
  }
}

function getRevenueMode() {
  return readStoredBoolean(REVENUE_MODE_KEY, true);
}

function setRevenueMode(enabled) {
  writeStoredBoolean(REVENUE_MODE_KEY, Boolean(enabled));
  emitRevenueModeChange();
}

function getLastSevenDays() {
  const labels = [];
  const today = new Date();
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    labels.push({
      label: date.toLocaleDateString(undefined, { weekday: "short" }),
      dateKey: date.toISOString().slice(0, 10),
    });
  }
  return labels;
}

function toCurrencyNumber(value) {
  return Number(String(value || 0).replace(/[^0-9.-]/g, "")) || 0;
}

function buildFakeRevenueSeries(totalRevenue) {
  const days = getLastSevenDays();
  const weights = [0.78, 0.92, 1.06, 0.88, 1.18, 1.03, 1.35];
  const weightTotal = weights.reduce((sum, weight) => sum + weight, 0);
  const base = Number(totalRevenue || 0) > 0 ? Number(totalRevenue || 0) / weightTotal : 1200;
  return days.map((day, index) => ({
    label: day.label,
    dateKey: day.dateKey,
    value: Math.round(base * weights[index]),
  }));
}

function buildLiveRevenueSeries(orders, transactions) {
  const days = getLastSevenDays();
  const buckets = Object.fromEntries(days.map((day) => [day.dateKey, 0]));
  const entries = [...(orders || []), ...(transactions || [])];
  for (const entry of entries) {
    const createdAt = new Date(entry.createdAt || Date.now());
    const dateKey = createdAt.toISOString().slice(0, 10);
    if (dateKey in buckets) {
      buckets[dateKey] += toCurrencyNumber(entry.amount || entry.totalPrice || 0);
    }
  }
  return days.map((day) => ({
    label: day.label,
    dateKey: day.dateKey,
    value: Math.round(buckets[day.dateKey] || 0),
  }));
}

function buildFakeHistory(revenueSeries, products = [], suppliers = []) {
  const customerNames = ["Aarav Shrestha", "Priya Koirala", "Nischal Rai", "Mira Gautam", "Sandeep Thapa", "Anisha Gurung", "Rohit Bista"];
  const paymentMethods = ["Cash", "Card", "UPI", "Bank Transfer"];
  const statuses = ["Completed", "Pending", "Refunded", "Completed", "Completed", "Completed", "Shipped"];

  return revenueSeries.map((day, index) => {
    const product = products[index % Math.max(1, products.length)] || {};
    const supplier = suppliers.find((item) => item.id === product.supplierId) || null;
    const createdAt = new Date(day.dateKey || Date.now()).getTime() + index * 60 * 60 * 1000;
    const amount = Math.max(0, Number(day.value || 0));
    const price = Number(product.price || 0) || 1;
    const qty = Math.max(1, Math.round(amount / price));
    const customerName = customerNames[index % customerNames.length];
    const status = statuses[index % statuses.length];
    const paymentMethod = paymentMethods[index % paymentMethods.length];

    return {
      order: {
        id: `#ORD-${1001 + index}`,
        customerName,
        customerId: `cu_${index + 1}`,
        createdAt,
        totalPrice: amount,
        status,
        paymentMethod,
        supplierId: supplier?.id || null,
        items: [
          {
            productId: product.id || null,
            qty,
            price,
          },
        ],
      },
      transaction: {
        id: `#TRX-${82910 - index}`,
        customerName,
        customerId: `cu_${index + 1}`,
        orderId: `#ORD-${1001 + index}`,
        createdAt,
        amount,
        status,
        paymentMethod,
      },
    };
  });
}

function getRevenueSnapshot({ orders = [], transactions = [] } = {}) {
  const modeEnabled = getRevenueMode();
  const liveTotal = orders.reduce((sum, order) => sum + toCurrencyNumber(order.totalPrice || 0), 0) || transactions.reduce((sum, tx) => sum + toCurrencyNumber(tx.amount || 0), 0);
  const liveSeries = buildLiveRevenueSeries(orders, transactions);
  const fakeSeries = buildFakeRevenueSeries(liveTotal || transactions.reduce((sum, tx) => sum + toCurrencyNumber(tx.amount || 0), 0) || 4200);
  const revenueSeries = modeEnabled ? fakeSeries : liveSeries;
  const totalRevenue = revenueSeries.reduce((sum, item) => sum + Number(item.value || 0), 0) || liveTotal || 0;
  const averageOrderValue = (orders.length || transactions.length)
    ? totalRevenue / Math.max(1, orders.length || transactions.length)
    : totalRevenue / 7;
  const dailyRevenue = revenueSeries[revenueSeries.length - 1]?.value || 0;

  return {
    enabled: modeEnabled,
    totalRevenue,
    averageOrderValue,
    dailyRevenue,
    revenueSeries,
  };
}

function buildDisplayHistory({ orders = [], transactions = [], products = [], suppliers = [], revenueSeries = [], fakeMode = false } = {}) {
  const fakeHistory = buildFakeHistory(revenueSeries, products, suppliers);
  const displayOrders = fakeMode && fakeHistory.length ? fakeHistory.map((entry) => entry.order) : orders;
  const displayTransactions = fakeMode && fakeHistory.length ? fakeHistory.map((entry) => entry.transaction) : transactions;
  return { displayOrders, displayTransactions, fakeHistory };
}

const fallbackCustomer = {
  overviewStats: [
    { iconKey: "receipt", label: "Total Orders", value: "128", sub: "+12 this month", subColor: "#10b981" },
    { iconKey: "chart", label: "Total Purchases", value: "Rs. 12,480", sub: "Avg. order Rs. 97", subColor: "#2563eb" },
    { iconKey: "bell", label: "Recent Activity", value: "3", sub: "Unread updates", subColor: "#f59e0b" },
    { iconKey: "box", label: "Products Purchased", value: "42", sub: "Lifetime items", subColor: "#10b981" },
  ],
  activityTimeline: [
    { label: "Bulk reorder completed", detail: "Wireless Keyboard Pro replenished", time: "08:40", tone: "green" },
    { label: "Tracking update received", detail: "Chair shipment reached warehouse", time: "10:25", tone: "blue" },
    { label: "Low stock alert viewed", detail: "Lighting kit added to watchlist", time: "11:10", tone: "yellow" },
    { label: "Return status updated", detail: "Refund issued for damaged item", time: "13:55", tone: "red" },
  ],
  summaryCards: [
    { label: "Delivered", value: "84", color: "#10b981" },
    { label: "Shipped", value: "22", color: "#2563eb" },
    { label: "Processing", value: "15", color: "#f59e0b" },
    { label: "Returned", value: "7", color: "#ef4444" },
  ],
};

const fallbackSupplier = {
  overviewStats: [
    { iconKey: "truck", label: "Active Requests", value: "24", sub: "Live queue", subColor: "#2563eb" },
    { iconKey: "clock", label: "Pending Requests", value: "8", sub: "Awaiting review", subColor: "#f59e0b" },
    { iconKey: "check", label: "Fulfilled Requests", value: "61", sub: "This month", subColor: "#10b981" },
    { iconKey: "alert", label: "Critical Requests", value: "3", sub: "Immediate action", subColor: "#ef4444" },
  ],
  automatedRequests: [
    { id: "AR-1021", product: "Wireless Keyboard Pro", stock: 18, recommended: 180, priority: "Critical", priorityTone: "red" },
    { id: "AR-1020", product: "Smart Lighting Kit", stock: 0, recommended: 240, priority: "High", priorityTone: "orange" },
    { id: "AR-1019", product: "USB-C Docking Station", stock: 12, recommended: 120, priority: "Medium", priorityTone: "blue" },
    { id: "AR-1018", product: "Desk Organizer Set", stock: 9, recommended: 90, priority: "Low", priorityTone: "green" },
  ],
  manualRequests: [
    { id: "MR-2211", product: "Ergonomic Office Chair", quantity: 50, reason: "Seasonal office refresh", priority: "High", priorityTone: "orange" },
    { id: "MR-2210", product: "Conference Speaker Set", quantity: 25, reason: "Upcoming enterprise order", priority: "Critical", priorityTone: "red" },
    { id: "MR-2209", product: "Desk Lamp", quantity: 40, reason: "New workstation rollout", priority: "Medium", priorityTone: "blue" },
    { id: "MR-2208", product: "Cable Management Kit", quantity: 70, reason: "Warehouse cleanup request", priority: "Low", priorityTone: "green" },
  ],
  activityItems: [
    { label: "Priority escalation detected", detail: "Automated request AR-1021 marked critical", time: "08:05", tone: "red" },
    { label: "Vendor acknowledgement received", detail: "AR-1020 moved to approved state", time: "09:20", tone: "blue" },
    { label: "Manual request submitted", detail: "MR-2211 added by procurement team", time: "11:40", tone: "orange" },
    { label: "Fulfillment completed", detail: "MR-2207 closed and archived", time: "14:15", tone: "green" },
  ],
};

function money(amount) {
  return `Rs. ${Number(amount || 0).toFixed(2)}`;
}

function getOrderStatusCounts(orders) {
  const counts = { delivered: 0, shipped: 0, processing: 0, returned: 0 };
  for (const order of orders) {
    const status = String(order.status || "processing").toLowerCase();
    if (status.includes("deliver")) counts.delivered += 1;
    else if (status.includes("ship")) counts.shipped += 1;
    else if (status.includes("return")) counts.returned += 1;
    else counts.processing += 1;
  }
  return counts;
}

function buildCatalogItems(products, limit = 6) {
  return products.slice(0, limit).map((item) => ({
    sku: item.sku,
    name: item.name,
    category: item.category,
    price: money(item.price),
    stock: item.quantity || 0,
    stockAmount: Number(item.quantity || 0),
    status: (item.quantity || 0) === 0 ? "Out of Stock" : (item.quantity || 0) < 20 ? "Low Stock" : "In Stock",
    tone: (item.quantity || 0) === 0 ? "red" : (item.quantity || 0) < 20 ? "yellow" : "green",
    badge: (item.quantity || 0) === 0 ? "red" : (item.quantity || 0) < 20 ? "yellow" : "green",
  }));
}

function buildCategoryBreakdown(products, revenueSeries, fakeHistory, fakeMode) {
  const categoryMap = new Map();
  const historyEntries = fakeMode && fakeHistory.length ? fakeHistory : [];

  if (historyEntries.length) {
    for (const entry of historyEntries) {
      const item = entry.order?.items?.[0];
      const productCategory = products.find((product) => product.id === item?.productId)?.category || "Uncategorized";
      const amount = Number(entry.order?.totalPrice || 0);
      categoryMap.set(productCategory, (categoryMap.get(productCategory) || 0) + amount);
    }
  } else {
    for (const product of products) {
      const category = product.category || "Uncategorized";
      const amount = Number(product.price || 0) * Number(product.quantity || 0);
      categoryMap.set(category, (categoryMap.get(category) || 0) + amount);
    }
  }

  const totalRevenue = revenueSeries.reduce((sum, item) => sum + Number(item.value || 0), 0) || 1;
  return [...categoryMap.entries()]
    .map(([name, value]) => ({
      name,
      value: money(value),
      rawValue: value,
      pct: Math.max(6, Math.round((Number(value || 0) / totalRevenue) * 100)),
    }))
    .sort((a, b) => b.rawValue - a.rawValue)
    .slice(0, 4);
}

function buildAutoRestockRows(restockRequests, products, suppliers) {
  return (restockRequests || [])
    .filter((request) => String(request.source || "").toLowerCase() === "auto")
    .sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0))
    .map((request, index) => {
      const product = products.find((item) => item.id === request.productId) || {};
      const supplier = suppliers.find((item) => item.id === request.supplierId) || null;
      const quantity = Number(request.quantity || 0);
      const currentStock = Number(product.quantity || request.stock || 0);
      const status = String(request.status || "pending");
      return {
        id: request.id || `AR-${1001 + index}`,
        sku: product.sku || request.productId || `AR-${1001 + index}`,
        product: request.productName || product.name || "Auto Restock Request",
        supplier: supplier?.companyName || product?.supplierName || "Unassigned",
        date: new Date(request.createdAt || Date.now()).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
        quantity,
        currentStock,
        reason: request.reason || "Auto restock triggered",
        status: status.replace(/^\w/, (m) => m.toUpperCase()),
        statusColor: status.toLowerCase().includes("complete") ? "green" : "yellow",
      };
    });
}

function buildCustomerNotifications({ products = [], restockRequests = [], fakeMode = false } = {}) {
  const completedRequests = (restockRequests || [])
    .filter((request) => String(request.status || "").toLowerCase().includes("complete"))
    .sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));

  const completedRestockNotifications = completedRequests.map((request, index) => {
    const product = products.find((item) => item.id === request.productId) || {};
    const productName = product.name || request.productName || "Requested item";
    return {
      id: `restock-${request.id || index}`,
      title: `${productName} is back in stock`,
      detail: `Restock request ${request.id || `#${index + 1}`} was completed by admin.`,
      time: new Date(request.createdAt || Date.now()).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
      tone: "green",
      type: "restock",
    };
  });

  if (completedRestockNotifications.length) return completedRestockNotifications.slice(0, 5);
  if (!fakeMode) return [];

  return [
    {
      id: "demo-restock-1",
      title: "Wireless Keyboard Pro restocked",
      detail: "A new batch is available for ordering.",
      time: "Today",
      tone: "green",
      type: "restock",
    },
    {
      id: "demo-restock-2",
      title: "Smart Lighting Kit reminder ready",
      detail: "You can enable a reminder for the next restock.",
      time: "Today",
      tone: "blue",
      type: "reminder",
    },
  ];
}

export async function getCustomerSnapshot() {
  const db = mockData.read();
  const products = db.products || [];
  const orders = db.orders || [];
  const transactions = db.transactions || [];
  const revenue = getRevenueSnapshot({ orders, transactions });
  const { displayOrders, displayTransactions } = buildDisplayHistory({
    orders,
    transactions,
    products,
    revenueSeries: revenue.revenueSeries,
    fakeMode: revenue.enabled,
  });
  const historyOrders = revenue.enabled ? displayOrders : orders;
  const totalStock = products.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const lowStockCount = products.filter((p) => (p.quantity || 0) > 0 && (p.quantity || 0) < 20).length;
  const outOfStockCount = products.filter((p) => (p.quantity || 0) === 0).length;
  const uniquePurchasedProducts = new Set();

  const purchaseHistory = historyOrders.slice(0, 5).map((order, index) => {
    const firstItem = order.items?.[0];
    const product = products.find((p) => p.id === firstItem?.productId);
    if (product) uniquePurchasedProducts.add(product.id);
    return {
      id: order.id || `#ORD-${1001 + index}`,
      product: product?.name || `Order ${index + 1}`,
      qty: firstItem?.qty || order.items?.length || 1,
      date: new Date(order.createdAt || Date.now()).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
      total: money(order.totalPrice || 0),
      status: order.status || "Placed",
      tone: order.status === "delivered" ? "green" : order.status === "returned" ? "red" : order.status === "shipped" ? "yellow" : "blue",
    };
  });

  const ordersCount = historyOrders.length || displayTransactions.length || 0;
  const purchasesTotal = money(revenue.totalRevenue || 12480);
  const recentActivityCount = displayTransactions.length || historyOrders.length || 3;
  const productsPurchased = uniquePurchasedProducts.size || products.length || 42;
  const statusCounts = getOrderStatusCounts(historyOrders);
  const summaryCards = historyOrders.length
    ? [
        { label: "Delivered", value: String(statusCounts.delivered), color: "#10b981" },
        { label: "Shipped", value: String(statusCounts.shipped), color: "#2563eb" },
        { label: "Processing", value: String(statusCounts.processing), color: "#f59e0b" },
        { label: "Returned", value: String(statusCounts.returned), color: "#ef4444" },
      ]
    : fallbackCustomer.summaryCards;

  const overviewStats = [
    { iconKey: "receipt", label: "Total Orders", value: String(ordersCount), sub: `${historyOrders.length || displayTransactions.length ? "Live" : "No"} this month`, subColor: "#10b981" },
    { iconKey: "chart", label: "Total Purchases", value: purchasesTotal, sub: `Stock on hand ${totalStock}`, subColor: "#2563eb" },
    { iconKey: "bell", label: "Recent Activity", value: String(recentActivityCount), sub: `${lowStockCount + outOfStockCount} inventory alerts`, subColor: "#f59e0b" },
    { iconKey: "box", label: "Products Purchased", value: String(productsPurchased), sub: `${products.length} catalog items`, subColor: "#10b981" },
  ];

  return {
    overviewStats,
    catalogItems: buildCatalogItems(products),
    purchaseHistory: purchaseHistory.length ? purchaseHistory : [
      { id: "#ORD-1001", product: "Wireless Keyboard Pro", qty: 1, date: "May 12, 2024", total: "Rs. 129.00", status: "Delivered", tone: "green" },
    ],
    activityTimeline: fallbackCustomer.activityTimeline,
    summaryCards,
    revenueSeries: revenue.revenueSeries,
    dailyRevenue: revenue.dailyRevenue,
    revenueModeEnabled: revenue.enabled,
    notifications: buildCustomerNotifications({ products, restockRequests: db.restockRequests || [], fakeMode: revenue.enabled }),
    hasLiveData: orders.length > 0 || products.length > 0,
  };
}

export async function getSupplierSnapshot() {
  await restockService.syncCriticalRequests();
  const db = mockData.read();
  const products = db.products || [];
  const restockRequests = db.restockRequests || [];
  const suppliers = db.suppliers || [];
  const revenue = getRevenueSnapshot({ orders: db.orders || [], transactions: db.transactions || [] });
  const lowStockProducts = products.filter((p) => (p.quantity || 0) > 0 && (p.quantity || 0) < 20);
  const outOfStockProducts = products.filter((p) => (p.quantity || 0) === 0);
  const fulfilledRequests = restockRequests.filter((r) => String(r.status || "").toLowerCase().includes("complete"));
  const totalStock = products.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const supplierCount = suppliers.length || 0;

  const overviewStats = [
    { iconKey: "truck", label: "Active Requests", value: String(restockRequests.length || lowStockProducts.length || 24), sub: `Stock on hand ${totalStock}`, subColor: "#2563eb" },
    { iconKey: "clock", label: "Pending Requests", value: String(restockRequests.filter((r) => String(r.status || "").toLowerCase().includes("pending")).length || lowStockProducts.length || 8), sub: `${supplierCount} suppliers`, subColor: "#f59e0b" },
    { iconKey: "check", label: "Fulfilled Requests", value: String(fulfilledRequests.length || 61), sub: "This month", subColor: "#10b981" },
    { iconKey: "alert", label: "Critical Requests", value: String([...lowStockProducts, ...outOfStockProducts].length || 3), sub: "Immediate action", subColor: "#ef4444" },
  ];

  const normalizeRequest = (item, index) => {
    const quantity = Number(item.quantity || item.requestedQuantity || item.stock || 0);
    const source = item.source || (String(item.id || "").startsWith("AR-") ? "auto" : "manual");
    const status = String(item.status || "pending");
    const priority = item.priority || (quantity === 0 ? "Critical" : quantity <= 5 ? "High" : quantity < 15 ? "Medium" : "Low");
    return {
      id: item.id || `${source === "auto" ? "AR" : "MR"}-${index + 1}`,
      productId: item.productId || null,
      product: item.productName || item.product || "Restock Request",
      stock: item.stock ?? (products.find((p) => p.id === item.productId)?.quantity || 0),
      recommended: Number(item.recommended || item.quantity || item.requestedQuantity || Math.max(25, quantity * 8 || 0)),
      quantity: quantity || Number(item.recommended || 0),
      reason: item.reason || (source === "auto" ? "Auto restock request" : "Manual restock request"),
      priority,
      priorityTone: item.priorityTone || (priority === "Critical" ? "red" : priority === "High" ? "orange" : priority === "Low" ? "green" : "blue"),
      statusTone: item.statusTone || (String(status).toLowerCase().includes("complete") ? "green" : String(status).toLowerCase().includes("pend") ? "yellow" : "blue"),
      status,
      source,
      sourceLabel: source === "auto" ? "Auto" : "Manual",
      supplierId: item.supplierId || null,
      createdAt: item.createdAt || Date.now(),
    };
  };

  const orderedRequests = [...restockRequests].sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
  const automatedRequests = orderedRequests.filter((item) => (item.source || "").toLowerCase() === "auto").slice(0, 4).map(normalizeRequest);
  const manualRequests = orderedRequests.filter((item) => (item.source || "").toLowerCase() !== "auto").slice(0, 4).map(normalizeRequest);

  return {
    overviewStats,
    automatedRequests,
    manualRequests,
    activityItems: fallbackSupplier.activityItems,
    priorityLegend: [
      { label: "Critical", color: "#ef4444", tone: "red" },
      { label: "High", color: "#f59e0b", tone: "yellow" },
      { label: "Medium", color: "#2563eb", tone: "blue" },
      { label: "Low", color: "#10b981", tone: "green" },
    ],
    revenueSeries: revenue.revenueSeries,
    dailyRevenue: revenue.dailyRevenue,
    revenueModeEnabled: revenue.enabled,
    supplierRows: suppliers.map((s, index) => ({
      abbr: (s.companyName || s.contactName || `S${index + 1}`).split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
      name: s.companyName || s.contactName || "Supplier",
      category: s.category || products.find((p) => p.supplierId === s.id)?.category || "General",
      contact: s.contactName || s.companyName || "Contact",
      phone: s.phone || "-",
      email: s.email || "-",
      status: products.some((p) => p.supplierId === s.id && (p.quantity || 0) > 0) ? "ACTIVE" : "LOW STOCK",
      statusColor: products.some((p) => p.supplierId === s.id && (p.quantity || 0) > 0) ? "green" : "yellow",
    })),
    hasLiveData: products.length > 0 || restockRequests.length > 0 || suppliers.length > 0,
  };
}

export async function getAdminSnapshot() {
  const db = mockData.read();
  const products = db.products || [];
  const suppliers = db.suppliers || [];
  const orders = db.orders || [];
  const transactions = db.transactions || [];
  const restockRequests = db.restockRequests || [];
  const revenue = getRevenueSnapshot({ orders, transactions });
  const { displayOrders, displayTransactions, fakeHistory } = buildDisplayHistory({
    orders,
    transactions,
    products,
    suppliers,
    revenueSeries: revenue.revenueSeries,
    fakeMode: revenue.enabled,
  });

  const totalStock = products.reduce((sum, product) => sum + Number(product.quantity || 0), 0);
  const lowStockCount = products.filter((p) => (p.quantity || 0) > 0 && (p.quantity || 0) < 20).length;
  const outOfStockCount = products.filter((p) => (p.quantity || 0) === 0).length;
  const totalRevenue = revenue.totalRevenue;
  const totalOrders = revenue.enabled ? fakeHistory.length : (displayOrders.length || displayTransactions.length);
  const avgOrderValue = revenue.averageOrderValue;
  const supplierCount = suppliers.length;
  const activeSuppliers = suppliers.length ? suppliers.length : 124;
  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];
  const categoryBreakdown = buildCategoryBreakdown(products, revenue.revenueSeries, fakeHistory, revenue.enabled);

  const supplierRows = suppliers.slice(0, 4).map((s, index) => ({
    abbr: (s.companyName || s.contactName || `S${index + 1}`).split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
    name: s.companyName || s.contactName || "Supplier",
    category: s.category || products.find((p) => p.supplierId === s.id)?.category || "General",
    contact: s.contactName || s.companyName || "Contact",
    phone: s.phone || "-",
    email: s.email || "-",
    status: (products.filter((p) => p.supplierId === s.id && (p.quantity || 0) > 0).length > 0 ? "ACTIVE" : "LOW STOCK"),
    statusColor: "green",
  }));

  const salesSource = revenue.enabled && fakeHistory.length
    ? fakeHistory.map((entry) => entry.transaction)
    : (displayTransactions.length ? displayTransactions : displayOrders);
  const salesRows = salesSource.map((entry, index) => ({
    id: entry.id || `#TRX-${82910 - index}`,
    avatar: (entry.customerId || entry.username || "CU").slice(0, 2).toUpperCase(),
    name: entry.customerName || `Customer ${index + 1}`,
    date: new Date(entry.createdAt || Date.now()).toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    amount: `Rs. ${Number(entry.amount || entry.totalPrice || 0).toFixed(2)}`,
    status: String(entry.status || "Completed").replace(/^\w/, (m) => m.toUpperCase()),
    statusColor: String(entry.status || "completed").toLowerCase().includes("pend") ? "yellow" : String(entry.status || "").toLowerCase().includes("refund") ? "red" : "green",
  }));

  const reportRows = products.slice(0, 2).map((p) => ({
    sku: p.sku,
    sub: p.name,
    cat: p.category,
    open: Number(p.quantity || 0) + 20,
    sold: Math.max(0, 20 - Number(p.quantity || 0)),
    soldColor: "#2563eb",
    status: (p.quantity || 0) === 0 ? "Out of Stock" : (p.quantity || 0) < 20 ? "Low Stock" : "In Stock",
    statusColor: (p.quantity || 0) === 0 ? "red" : (p.quantity || 0) < 20 ? "yellow" : "green",
    val: `Rs. ${(Number(p.price || 0) * Number(p.quantity || 0)).toFixed(2)}`,
  }));

  return {
    totalProducts: products.length,
    totalStock,
    lowStockCount,
    outOfStockCount,
    totalRevenue,
    totalOrders,
    avgOrderValue,
    supplierCount,
    activeSuppliers,
    categories,
    supplierRows,
    salesRows,
    reportRows,
    products,
    revenueSeries: revenue.revenueSeries,
    dailyRevenue: revenue.dailyRevenue,
    revenueModeEnabled: revenue.enabled,
    transactionHistory: displayTransactions,
    orderHistory: displayOrders,
    fakeHistory,
    categoryBreakdown,
    autoRestockRows: buildAutoRestockRows(restockRequests, products, suppliers),
  };
}

export default {
  getCustomerSnapshot,
  getSupplierSnapshot,
  getAdminSnapshot,
  getRevenueMode,
  setRevenueMode,
};
