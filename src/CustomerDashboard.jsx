import React, { useEffect, useRef, useState } from "react";
import {
  Icon,
  Badge,
  StatCard,
  APP_CONTROL_INPUT_STYLE,
  APP_CONTROL_BUTTON_STYLE,
  APP_ACCENT_GRADIENT,
  APP_ACCENT_SHADOW,
  ThemeSelect,
  Pagination,
} from "./components/UI";
import dashboardService from "./services/dashboardService";

const ITEMS_PER_PAGE = 100;
const icons = {
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  box: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
  receipt: "M4 2h16a1 1 0 0 1 1 1v18l-3-2-2 2-2-2-2 2-2-2-3 2V3a1 1 0 0 1 1-1z",
  chart: "M18 20V10M12 20V4M6 20v-6",
  star: "M12 2l2.93 6.65 7.07.61-5.34 4.64 1.6 6.93L12 16.88 5.74 20.83l1.6-6.93L2 9.26l7.07-.61z",
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

const catalogItems = [
  { sku: "IP-2199-SLV", name: 'Ultra HD Monitor 27"', category: "Electronics", price: "Rs. 499.00", stock: 86, status: "In Stock", tone: "green", badge: "green" },
  { sku: "IP-4402-WHT", name: "Wireless Keyboard Pro", category: "Electronics", price: "Rs. 129.00", stock: 18, status: "Low Stock", tone: "yellow", badge: "yellow" },
  { sku: "IP-1105-GRY", name: "Smart Lighting Kit", category: "Accessories", price: "Rs. 89.00", stock: 0, status: "Out of Stock", tone: "red", badge: "red" },
  { sku: "IP-8821-BLK", name: "Ergonomic Office Chair", category: "Furniture", price: "Rs. 249.99", stock: 64, status: "In Stock", tone: "green", badge: "green" },
  { sku: "IP-7712-BLU", name: "USB-C Docking Station", category: "Electronics", price: "Rs. 179.00", stock: 14, status: "Low Stock", tone: "yellow", badge: "yellow" },
  { sku: "IP-3347-GRN", name: "Desk Organizer Set", category: "Office", price: "Rs. 39.00", stock: 0, status: "Out of Stock", tone: "red", badge: "red" },
];

const purchaseHistory = [
  { id: "#ORD-1001", product: "Wireless Keyboard Pro", qty: 1, date: "May 12, 2024", total: "Rs. 129.00", status: "Delivered", tone: "green" },
  { id: "#ORD-1002", product: "Ergonomic Office Chair", qty: 2, date: "May 09, 2024", total: "Rs. 499.98", status: "Shipped", tone: "yellow" },
  { id: "#ORD-1003", product: "Smart Lighting Kit", qty: 1, date: "Apr 27, 2024", total: "Rs. 89.00", status: "Returned", tone: "red" },
  { id: "#ORD-1004", product: "USB-C Docking Station", qty: 3, date: "Apr 18, 2024", total: "Rs. 537.00", status: "Processing", tone: "blue" },
  { id: "#ORD-1005", product: "Desk Organizer Set", qty: 2, date: "Apr 11, 2024", total: "Rs. 78.00", status: "Delivered", tone: "green" },
];

const customerWishlistKey = "inventory_customer_wishlist_v1";
const customerRemindersKey = "inventory_customer_reminders_v1";

const readStoredArray = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const normalizeHistoryStatus = (status) => {
  const raw = String(status || "").trim().toLowerCase();
  if (raw.includes("deliver") || raw.includes("complete")) return "delivered";
  if (raw.includes("ship")) return "shipped";
  if (raw.includes("return") || raw.includes("refund")) return "returned";
  if (raw.includes("process") || raw.includes("pend")) return "processing";
  return raw;
};

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

const ControlChip = ({ icon, label, onClick, active = false }) => (
  <button
    type="button"
      onClick={onClick}
      style={{
        ...APP_CONTROL_BUTTON_STYLE,
        background: active ? "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)" : "#fff",
        borderColor: active ? "#bfdbfe" : "#dbe2ea",
        color: active ? "#1d4ed8" : "#111827",
        boxShadow: active ? "0 8px 18px rgba(37, 99, 235, 0.10)" : APP_CONTROL_BUTTON_STYLE.boxShadow,
      }}
  >
    <Icon d={icon} size={14} />
    {label}
  </button>
);

const CustomerDashboard = ({ page = "customer", revenueModeEnabled, onToggleRevenueMode }) => {
  const [snapshot, setSnapshot] = useState(null);
  const [wishlistItems, setWishlistItems] = useState(() => readStoredArray(customerWishlistKey));
  const [reminderItems, setReminderItems] = useState(() => readStoredArray(customerRemindersKey));
  const [localNotifications, setLocalNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [catalogQuery, setCatalogQuery] = useState("");
  const [catalogCategory, setCatalogCategory] = useState("all");
  const [catalogAvailability, setCatalogAvailability] = useState("all");
  const [historyQuery, setHistoryQuery] = useState("");
  const [historyStatus, setHistoryStatus] = useState("all");
  const [historyRange, setHistoryRange] = useState("all");
  const [catalogPage, setCatalogPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const catalogSearchRef = useRef(null);
  const historySearchRef = useRef(null);
  const previousStockRef = useRef({});
  const notificationsPanelRef = useRef(null);
  const [showWishlistedOnly, setShowWishlistedOnly] = useState(false);

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

  useEffect(() => {
    try {
      localStorage.setItem(customerWishlistKey, JSON.stringify(wishlistItems));
    } catch (error) {
      // ignore storage failures
    }
  }, [wishlistItems]);

  useEffect(() => {
    try {
      localStorage.setItem(customerRemindersKey, JSON.stringify(reminderItems));
    } catch (error) {
      // ignore storage failures
    }
  }, [reminderItems]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsPanelRef.current && !notificationsPanelRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeSnapshot = snapshot;
  const catalog = activeSnapshot?.catalogItems || catalogItems;
  const history = activeSnapshot?.purchaseHistory || purchaseHistory;
  const serverNotifications = activeSnapshot?.notifications || [];
  const notifications = [...localNotifications, ...serverNotifications];
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
    const matchesWishlist = !showWishlistedOnly || wishlistItems.includes(item.sku);
    return matchesQuery && matchesCategory && matchesAvailability && matchesWishlist;
  });

  const isWithinHistoryRange = (dateText) => {
    if (historyRange === "all") return true;
    const parsed = Date.parse(dateText);
    if (Number.isNaN(parsed)) return true;
    const diffDays = (Date.now() - parsed) / (1000 * 60 * 60 * 24);
    if (historyRange === "30") return diffDays <= 30;
    if (historyRange === "90") return diffDays <= 90;
    if (historyRange === "180") return diffDays <= 180;
    return true;
  };

  const filteredHistory = history.filter((row) => {
    const query = historyQuery.trim().toLowerCase();
    const matchesQuery =
      !query ||
      row.id.toLowerCase().includes(query) ||
      row.product.toLowerCase().includes(query) ||
      row.total.toLowerCase().includes(query);
    const matchesStatus = historyStatus === "all" || normalizeHistoryStatus(row.status) === historyStatus;
    return matchesQuery && matchesStatus && isWithinHistoryRange(row.date);
  });
  const catalogPageCount = Math.max(1, Math.ceil(filteredCatalog.length / ITEMS_PER_PAGE));
  const visibleCatalog = filteredCatalog.slice((catalogPage - 1) * ITEMS_PER_PAGE, catalogPage * ITEMS_PER_PAGE);
  const historyPageCount = Math.max(1, Math.ceil(filteredHistory.length / ITEMS_PER_PAGE));
  const visibleHistory = filteredHistory.slice((historyPage - 1) * ITEMS_PER_PAGE, historyPage * ITEMS_PER_PAGE);

  useEffect(() => {
    setCatalogPage(1);
  }, [catalogQuery, catalogCategory, catalogAvailability, showWishlistedOnly, wishlistItems]);

  useEffect(() => {
    setCatalogPage((current) => Math.min(current, catalogPageCount));
  }, [catalogPageCount]);

  useEffect(() => {
    setHistoryPage(1);
  }, [historyQuery, historyStatus]);

  useEffect(() => {
    setHistoryPage((current) => Math.min(current, historyPageCount));
  }, [historyPageCount]);

  const cycleHistoryRange = () => {
    setHistoryRange((current) => (current === "all" ? "30" : current === "30" ? "90" : current === "90" ? "180" : "all"));
  };
  useEffect(() => {
    const currentStocks = new Map(catalog.map((item) => [item.sku, Number(item.stock || 0)]));
    const completedRestocks = [];
    for (const item of catalog) {
      const previousStock = Number(previousStockRef.current[item.sku]);
      const currentStock = currentStocks.get(item.sku) || 0;
      if (reminderItems.includes(item.sku) && !Number.isNaN(previousStock) && previousStock <= 0 && currentStock > 0) {
        completedRestocks.push({
          id: `restock-${item.sku}-${currentStock}`,
          title: `${item.name} is back in stock`,
          detail: "Your reminder was triggered after the admin restock completed.",
          time: "Just now",
          tone: "green",
          type: "restock",
        });
      }
    }
    if (completedRestocks.length) {
      setLocalNotifications((current) => {
        const seen = new Set(current.map((entry) => entry.id));
        const merged = [...completedRestocks.filter((entry) => !seen.has(entry.id)), ...current];
        return merged.slice(0, 6);
      });
      setReminderItems((current) => current.filter((sku) => currentStocks.get(sku) <= 0));
    }
    previousStockRef.current = Object.fromEntries(currentStocks.entries());
  }, [catalog, reminderItems]);

  const toggleWishlist = (sku) => {
    setWishlistItems((current) => (current.includes(sku) ? current.filter((item) => item !== sku) : [...current, sku]));
  };

  const toggleReminder = (sku) => {
    setReminderItems((current) => (current.includes(sku) ? current.filter((item) => item !== sku) : [...current, sku]));
  };

  const renderProfile = () => (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", background: "#f9fafb" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.08, letterSpacing: -0.2 }}>Profile</h1>
      <p style={{ color: "#6b7280" }}>Basic account information for the current user.</p>
      <div style={{ marginTop: 12, background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #e5e7eb", display: "grid", gap: 12 }}>
        <div>
          <div style={{ fontWeight: 700 }}>Inventory Pro</div>
          <div style={{ color: "#6b7280", marginTop: 6 }}>Role: Customer</div>
        </div>
        <div style={{ padding: 14, borderRadius: 12, background: revenueModeEnabled ? "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)" : "#f9fafb", border: `1px solid ${revenueModeEnabled ? "#bfdbfe" : "#e5e7eb"}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Fake Revenue Mode</div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
              {revenueModeEnabled ? "Using the generated 7-day revenue dataset across the site." : "Using live revenue totals from the stored orders and transactions."}
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleRevenueMode}
            style={{
              padding: "10px 14px",
              borderRadius: 999,
              border: `1px solid ${revenueModeEnabled ? "#2563eb" : "#dbe2ea"}`,
              background: revenueModeEnabled ? APP_ACCENT_GRADIENT : "#fff",
              color: revenueModeEnabled ? "#fff" : "#111827",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: revenueModeEnabled ? APP_ACCENT_SHADOW : "0 1px 3px rgba(15, 23, 42, 0.06)",
            }}
          >
            {revenueModeEnabled ? "Enabled" : "Disabled"}
          </button>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div>
      <PageHeader
        title="Product Catalog"
        subtitle="Browse the catalog like a shopping site. Add items to your wishlist or set a restock reminder."
        actions={[
          <div key="notifications" ref={notificationsPanelRef} style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setNotificationsOpen((current) => !current)}
              style={{
                ...APP_CONTROL_BUTTON_STYLE,
                width: 44,
                height: 44,
                padding: 0,
                borderRadius: 12,
                position: "relative",
              }}
              aria-label="Notifications"
              title="Notifications"
            >
              <Icon d={icons.bell} size={15} />
              {notifications.length ? (
                <span
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    minWidth: 18,
                    height: 18,
                    padding: "0 4px",
                    borderRadius: 999,
                    background: "#ef4444",
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 800,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 6px 12px rgba(239, 68, 68, 0.24)",
                  }}
                >
                  {Math.min(9, notifications.length)}
                </span>
              ) : null}
            </button>
            {notificationsOpen ? (
              <div
                style={{
                  position: "absolute",
                  top: 52,
                  right: 0,
                  width: 320,
                  maxWidth: "calc(100vw - 48px)",
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 16,
                  boxShadow: "0 20px 50px rgba(15, 23, 42, 0.16)",
                  overflow: "hidden",
                  zIndex: 20,
                }}
              >
                <div style={{ padding: "12px 14px", borderBottom: "1px solid #e5e7eb", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#111827" }}>Notifications</div>
                    <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>Wishlist and restock updates</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotificationsOpen(false)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      background: "#fff",
                      cursor: "pointer",
                      color: "#6b7280",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    aria-label="Close notifications"
                  >
                    <Icon d={icons.x} size={12} />
                  </button>
                </div>
                <div style={{ maxHeight: 280, overflowY: "auto" }}>
                  {notifications.length ? (
                    notifications.slice(0, 6).map((item) => (
                      <div key={item.id} style={{ padding: "12px 14px", borderBottom: "1px solid #f1f5f9", background: item.tone === "green" ? "#f0fdf4" : item.tone === "yellow" ? "#fffbeb" : "#eff6ff" }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{item.title}</div>
                        <div style={{ marginTop: 3, fontSize: 12, color: "#6b7280" }}>{item.detail}</div>
                        <div style={{ marginTop: 6, fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>{item.time}</div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: 14, fontSize: 13, color: "#6b7280" }}>No notifications yet.</div>
                  )}
                </div>
              </div>
            ) : null}
          </div>,
          <button
            key="wishlist-filter"
            type="button"
            onClick={() => setShowWishlistedOnly((current) => !current)}
            style={{
              ...APP_CONTROL_BUTTON_STYLE,
              width: 44,
              height: 44,
              padding: 0,
              borderRadius: 12,
              position: "relative",
              border: `1px solid ${showWishlistedOnly ? "#f59e0b" : "#dbe2ea"}`,
              background: showWishlistedOnly ? "#fffbeb" : "#fff",
              color: showWishlistedOnly ? "#b45309" : "#111827",
            }}
            aria-label={showWishlistedOnly ? "Showing wishlisted items" : "Show wishlisted items"}
            title={showWishlistedOnly ? "Showing wishlisted items" : "Show wishlisted items"}
          >
            <Icon d={icons.star} size={15} stroke={showWishlistedOnly ? "#b45309" : "#111827"} fill={showWishlistedOnly ? "#b45309" : "none"} />
          </button>,
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
              ref={catalogSearchRef}
              style={{ ...APP_CONTROL_INPUT_STYLE, paddingLeft: 38 }}
            />
          </div>
          <ThemeSelect
            value={catalogCategory}
            onChange={setCatalogCategory}
            options={catalogCategories.map((category) => ({
              value: category,
              label: category === "all" ? "All Categories" : category,
            }))}
          />
          <ThemeSelect
            value={catalogAvailability}
            onChange={setCatalogAvailability}
            options={catalogAvailabilityOptions}
          />
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
          const isWishlisted = wishlistItems.includes(item.sku);
          const hasReminder = reminderItems.includes(item.sku);
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
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                      <button
                        type="button"
                        onClick={() => toggleWishlist(item.sku)}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 12,
                          border: `1px solid ${isWishlisted ? "#f59e0b" : "#dbe2ea"}`,
                          background: isWishlisted ? "#fffbeb" : "#fff",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          color: isWishlisted ? "#b45309" : "#111827",
                        }}
                        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                        title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <Icon d={icons.star} size={14} stroke={isWishlisted ? "#b45309" : "#111827"} fill={isWishlisted ? "#b45309" : "none"} />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleReminder(item.sku)}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 12,
                          border: `1px solid ${hasReminder ? "#2563eb" : "#dbe2ea"}`,
                          background: hasReminder ? "#eff6ff" : "#fff",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          color: hasReminder ? "#1d4ed8" : "#111827",
                        }}
                        aria-label={hasReminder ? "Remove reminder" : "Set reminder"}
                        title={hasReminder ? "Remove reminder" : "Set reminder"}
                      >
                        <Icon d={icons.bell} size={14} stroke={hasReminder ? "#1d4ed8" : "#111827"} />
                      </button>
                      <button type="button" style={{ border: "1px solid #111827", background: "#fff", borderRadius: 12, padding: "11px 14px", fontSize: 13, fontWeight: 600, color: "#111827", cursor: "pointer" }}>
                        Details
                      </button>
                    </div>
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
          <ControlChip key="date" icon={icons.calendar} label={historyRange === "all" ? "Date Filter" : `Last ${historyRange} Days`} active={historyRange !== "all"} onClick={cycleHistoryRange} />,
        ]}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 20 }}>
        <StatCard icon={<Icon d={icons.receipt} />} label="Orders this year" value="48" sub="+9 from last quarter" subColor="#10b981" />
        <StatCard icon={<Icon d={icons.chart} />} label="Total spend" value="Rs. 12,480" sub="Strong retention" subColor="#2563eb" />
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
              ref={historySearchRef}
              style={{ ...APP_CONTROL_INPUT_STYLE, paddingLeft: 38 }}
            />
          </div>
          <button type="button" onClick={cycleHistoryRange} style={APP_CONTROL_BUTTON_STYLE}>
            {historyRange === "all" ? "Last 90 Days" : `Last ${historyRange} Days`}
          </button>
          <ThemeSelect
            value={historyStatus}
            onChange={setHistoryStatus}
            options={[
              { value: "all", label: "All Status" },
              { value: "delivered", label: "Delivered" },
              { value: "shipped", label: "Shipped" },
              { value: "processing", label: "Processing" },
              { value: "returned", label: "Returned" },
            ]}
          />
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
    products: renderProducts,
    purchase_history: renderPurchaseHistory,
    profile: renderProfile,
  };

  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "20px 24px", background: "#f9fafb" }}>
      {(renderByPage[page] || renderProducts)()}
    </div>
  );
};

export default CustomerDashboard;

