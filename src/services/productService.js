import mockData from "../mockData";
<<<<<<< HEAD
=======
import restockService from "./restockService";
>>>>>>> testing

function uid(prefix = "id_") {
  return `${prefix}${Math.random().toString(36).slice(2, 9)}`;
}

export default {
  list: async () => {
    const db = mockData.read();
    return db.products.slice();
  },
  get: async (id) => {
    const db = mockData.read();
    return db.products.find(p => p.id === id) || null;
  },
  create: async (payload) => {
    const db = mockData.read();
    const item = { id: uid('p_'), ...payload };
    db.products.push(item);
    mockData.write(db);
<<<<<<< HEAD
=======
    await restockService.syncCriticalRequests();
>>>>>>> testing
    return item;
  },
  update: async (id, patch) => {
    const db = mockData.read();
    const idx = db.products.findIndex(p => p.id === id);
    if (idx === -1) throw new Error("Product not found");
    db.products[idx] = { ...db.products[idx], ...patch };
    mockData.write(db);
<<<<<<< HEAD
=======
    await restockService.syncCriticalRequests();
>>>>>>> testing
    return db.products[idx];
  },
  remove: async (id) => {
    const db = mockData.read();
    const idx = db.products.findIndex(p => p.id === id);
    if (idx === -1) throw new Error("Product not found");
    const [deleted] = db.products.splice(idx, 1);
    mockData.write(db);
<<<<<<< HEAD
=======
    await restockService.syncCriticalRequests();
>>>>>>> testing
    return deleted;
  },
};
