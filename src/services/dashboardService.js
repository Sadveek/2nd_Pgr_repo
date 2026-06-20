import mockData from "../mockData";
import restockService from "./restockService";

const fallbackCustomer = {
  overviewStats: [
    { iconKey: "receipt", label: "Total Orders", value: "128", sub: "+12 this month", subColor: "#10b981" },
    { iconKey: "chart", label: "Total Purchases", value: "$12,480", sub: "Avg. order $97", subColor: "#2563eb" },
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
  return `$${Number(amount || 0).toFixed(2)}`;
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

export async function getCustomerSnapshot() {
  const db = mockData.read();
  const products = db.products || [];
  const orders = db.orders || [];
  const transactions = db.transactions || [];
  const totalStock = products.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const lowStockCount = products.filter((p) => (p.quantity || 0) > 0 && (p.quantity || 0) < 20).length;
  const outOfStockCount = products.filter((p) => (p.quantity || 0) === 0).length;
  const uniquePurchasedProducts = new Set();

  const purchaseHistory = orders.slice(0, 5).map((order, index) => {
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

  const ordersCount = orders.length || transactions.length || 0;
  const purchasesTotal = money(orders.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0) || transactions.reduce((sum, tx) => sum + Number(tx.amount || 0), 0) || 12480);
  const recentActivityCount = transactions.length || orders.length || 3;
  const productsPurchased = uniquePurchasedProducts.size || products.length || 42;
  const statusCounts = getOrderStatusCounts(orders);
  const summaryCards = orders.length
    ? [
        { label: "Delivered", value: String(statusCounts.delivered), color: "#10b981" },
        { label: "Shipped", value: String(statusCounts.shipped), color: "#2563eb" },
        { label: "Processing", value: String(statusCounts.processing), color: "#f59e0b" },
        { label: "Returned", value: String(statusCounts.returned), color: "#ef4444" },
      ]
    : fallbackCustomer.summaryCards;

  const overviewStats = [
    { iconKey: "receipt", label: "Total Orders", value: String(ordersCount), sub: `${orders.length || transactions.length ? "Live" : "No"} this month`, subColor: "#10b981" },
    { iconKey: "chart", label: "Total Purchases", value: purchasesTotal, sub: `Stock on hand ${totalStock}`, subColor: "#2563eb" },
    { iconKey: "bell", label: "Recent Activity", value: String(recentActivityCount), sub: `${lowStockCount + outOfStockCount} inventory alerts`, subColor: "#f59e0b" },
    { iconKey: "box", label: "Products Purchased", value: String(productsPurchased), sub: `${products.length} catalog items`, subColor: "#10b981" },
  ];

  return {
    overviewStats,
    catalogItems: buildCatalogItems(products),
    purchaseHistory: purchaseHistory.length ? purchaseHistory : [
      { id: "#ORD-1001", product: "Wireless Keyboard Pro", qty: 1, date: "May 12, 2024", total: "$129.00", status: "Delivered", tone: "green" },
    ],
    activityTimeline: fallbackCustomer.activityTimeline,
    summaryCards,
    hasLiveData: orders.length > 0 || products.length > 0,
  };
}

export async function getSupplierSnapshot() {
  await restockService.syncCriticalRequests();
  const db = mockData.read();
  const products = db.products || [];
  const restockRequests = db.restockRequests || [];
  const suppliers = db.suppliers || [];
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

  const totalStock = products.reduce((sum, product) => sum + Number(product.quantity || 0), 0);
  const lowStockCount = products.filter((p) => (p.quantity || 0) > 0 && (p.quantity || 0) < 20).length;
  const outOfStockCount = products.filter((p) => (p.quantity || 0) === 0).length;
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0) || transactions.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
  const totalOrders = orders.length || transactions.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const supplierCount = suppliers.length;
  const activeSuppliers = suppliers.length ? suppliers.length : 124;
  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];

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

  const salesRows = (transactions.length ? transactions : orders).slice(0, 5).map((entry, index) => ({
    id: entry.id || `#TRX-${82910 - index}`,
    avatar: (entry.customerId || entry.username || "CU").slice(0, 2).toUpperCase(),
    name: entry.customerName || `Customer ${index + 1}`,
    date: new Date(entry.createdAt || Date.now()).toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    amount: `$${Number(entry.amount || entry.totalPrice || 0).toFixed(2)}`,
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
    val: `$${(Number(p.price || 0) * Number(p.quantity || 0)).toFixed(2)}`,
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
  };
}

export default {
  getCustomerSnapshot,
  getSupplierSnapshot,
  getAdminSnapshot,
};
