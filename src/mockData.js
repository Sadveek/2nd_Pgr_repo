// Simple mock database persisted to localStorage
const STORAGE_KEY = "inventory_mock_db_v1";

const initial = {
  users: [
    { id: "u_admin", username: "admin", email: "admin@demo.local", password: "adminpass", role: "admin", createdAt: Date.now() },
    { id: "u_customer", username: "customer", email: "customer@demo.local", password: "custpass", role: "customer", createdAt: Date.now() },
    { id: "u_supplier", username: "supplier", email: "supplier@demo.local", password: "suppass", role: "supplier", createdAt: Date.now() },
  ],
  products: [
    { id: "p_1", sku: "IP-8821-BLK", name: "Ergonomic Office Chair", category: "Furniture", price: 249.99, quantity: 120, supplierId: "s_1", status: "in_stock" },
    { id: "p_2", sku: "IP-4402-WHT", name: "Wireless Keyboard Pro", category: "Electronics", price: 129.0, quantity: 18, supplierId: "s_2", status: "low_stock" },
    { id: "p_3", sku: "IP-2199-SLV", name: 'Ultra HD Monitor 27"', category: "Electronics", price: 499.0, quantity: 65, supplierId: "s_1", status: "in_stock" },
    { id: "p_4", sku: "IP-1105-GRY", name: "Smart Lighting Kit", category: "Electronics", price: 89.0, quantity: 0, supplierId: "s_3", status: "out_of_stock" },
  ],
  suppliers: [
    { id: "s_1", companyName: "Acme Electronics", contactName: "Ankit Neupane", email: "ankit@acme.local", phone: "+9779801123456" },
    { id: "s_2", companyName: "Sujal Supplies", contactName: "Sujal", email: "sujal@supplies.local", phone: "+9779814234567" },
    { id: "s_3", companyName: "Govind Hardware", contactName: "Govind", email: "govind@hardware.local", phone: "+9779823345678" },
    { id: "s_4", companyName: "Nepa Office Mart", contactName: "Ramesh Karki", email: "ramesh@nepaoffice.local", phone: "+9779834456789" },
    { id: "s_5", companyName: "Himalaya Tech", contactName: "Mina Sharma", email: "mina@himalayatech.local", phone: "+9779845567890" },
    { id: "s_6", companyName: "Everest Logistics", contactName: "Prabin Gurung", email: "prabin@everestlogistics.local", phone: "+9779856678901" },
    { id: "s_7", companyName: "Blue Ridge Wholesale", contactName: "Sagar Bista", email: "sagar@blueridge.local", phone: "+9779867789012" },
  ],
  orders: [],
  transactions: [],
  restockRequests: [],
};

function cloneInitial() {
  return JSON.parse(JSON.stringify(initial));
}

function mergeDefaults(data) {
  const base = cloneInitial();
  const incoming = data && typeof data === "object" ? data : {};
  const mergedUsers = Array.isArray(incoming.users) ? [...incoming.users] : [];
  const mergedSuppliers = Array.isArray(incoming.suppliers) ? [...incoming.suppliers] : [];

  for (const user of base.users) {
    if (!mergedUsers.some((existing) => existing.id === user.id || existing.email === user.email || existing.username === user.username)) {
      mergedUsers.push(user);
    }
  }

  for (const supplier of base.suppliers) {
    if (!mergedSuppliers.some((existing) => existing.id === supplier.id || existing.companyName === supplier.companyName)) {
      mergedSuppliers.push(supplier);
    }
  }

  return {
    ...base,
    ...incoming,
    users: mergedUsers,
    products: Array.isArray(incoming.products) ? incoming.products : base.products,
    suppliers: mergedSuppliers,
    orders: Array.isArray(incoming.orders) ? incoming.orders : base.orders,
    transactions: Array.isArray(incoming.transactions) ? incoming.transactions : base.transactions,
    restockRequests: Array.isArray(incoming.restockRequests) ? incoming.restockRequests : base.restockRequests,
  };
}

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return cloneInitial();
    const parsed = JSON.parse(raw);
    const merged = mergeDefaults(parsed);
    if (JSON.stringify(merged) !== raw) {
      write(merged);
    }
    return merged;
  } catch (e) {
    return cloneInitial();
  }
}

function write(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("inventory-db-changed"));
  }
}

export default {
  read,
  write,
  reset() {
    write(cloneInitial());
  },
};
