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
  ],
  orders: [],
  transactions: [],
  restockRequests: [],
};

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return JSON.parse(JSON.stringify(initial));
    return JSON.parse(raw);
  } catch (e) {
    return JSON.parse(JSON.stringify(initial));
  }
}

function write(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default {
  read,
  write,
  reset() {
    write(initial);
  },
};
