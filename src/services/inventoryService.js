import mockData from "../mockData";
<<<<<<< HEAD
=======
import restockService from "./restockService";
>>>>>>> testing

export default {
  getStock: async (productId) => {
    const db = mockData.read();
    const p = db.products.find(x => x.id === productId);
    return p ? p.quantity : null;
  },
  adjustStock: async (productId, delta) => {
    const db = mockData.read();
    const p = db.products.find(x => x.id === productId);
    if (!p) throw new Error("Product not found");
    p.quantity = Math.max(0, (p.quantity || 0) + Number(delta));
    if (p.quantity === 0) p.status = "out_of_stock";
    else if (p.quantity < 20) p.status = "low_stock";
    else p.status = "in_stock";
    mockData.write(db);
<<<<<<< HEAD
=======
    await restockService.syncCriticalRequests();
>>>>>>> testing
    return p;
  },
  lowStock: async (threshold = 20) => {
    const db = mockData.read();
    return db.products.filter(p => (p.quantity || 0) > 0 && p.quantity < threshold);
  },
  outOfStock: async () => {
    const db = mockData.read();
    return db.products.filter(p => (p.quantity || 0) === 0);
  },
  totals: async () => {
    const db = mockData.read();
    return {
      totalProducts: db.products.length,
      totalStock: db.products.reduce((s, p) => s + (p.quantity || 0), 0),
      lowStockCount: db.products.filter(p => (p.quantity || 0) < 20 && (p.quantity || 0) > 0).length,
      outOfStockCount: db.products.filter(p => (p.quantity || 0) === 0).length,
    };
  }
};
