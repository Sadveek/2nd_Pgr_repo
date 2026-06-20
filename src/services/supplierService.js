import mockData from "../mockData";

function uid(prefix = "s_") {
  return `${prefix}${Math.random().toString(36).slice(2, 9)}`;
}

export default {
  list: async () => {
    const db = mockData.read();
    return db.suppliers.slice();
  },
  get: async (id) => {
    const db = mockData.read();
    return db.suppliers.find(s => s.id === id) || null;
  },
  create: async (payload) => {
    const db = mockData.read();
    const item = { id: uid(), ...payload };
    db.suppliers.push(item);
    mockData.write(db);
    return item;
  },
  update: async (id, patch) => {
    const db = mockData.read();
    const idx = db.suppliers.findIndex(s => s.id === id);
    if (idx === -1) throw new Error("Supplier not found");
    db.suppliers[idx] = { ...db.suppliers[idx], ...patch };
    mockData.write(db);
    return db.suppliers[idx];
  },
  remove: async (id) => {
    const db = mockData.read();
    const idx = db.suppliers.findIndex(s => s.id === id);
    if (idx === -1) throw new Error("Supplier not found");
    const [deleted] = db.suppliers.splice(idx, 1);
    mockData.write(db);
    return deleted;
  },
  assignProducts: async (supplierId, productIds = []) => {
    const db = mockData.read();
    productIds.forEach(pid => {
      const p = db.products.find(x => x.id === pid);
      if (p) p.supplierId = supplierId;
    });
    mockData.write(db);
    return db.products.filter(p => productIds.includes(p.id));
  }
};
