import mockData from "../mockData";
import inventoryService from "./inventoryService";

function uid(prefix = "o_") {
  return `${prefix}${Math.random().toString(36).slice(2, 9)}`;
}

export default {
  list: async () => {
    const db = mockData.read();
    return db.orders.slice();
  },
  get: async (id) => {
    const db = mockData.read();
    return db.orders.find(o => o.id === id) || null;
  },
  create: async (payload) => {
    // payload: { customerId, items: [{ productId, qty }], paymentMethod }
    const db = mockData.read();
    const id = uid();
    const totalPrice = payload.items.reduce((acc, it) => {
      const p = db.products.find(x => x.id === it.productId);
      return acc + (p ? p.price * (it.qty || 0) : 0);
    }, 0);
    const order = { id, customerId: payload.customerId, items: payload.items, totalPrice, status: "placed", createdAt: Date.now() };
    // deduct stock
    for (const it of payload.items) {
      await inventoryService.adjustStock(it.productId, -Math.abs(it.qty || 0));
    }
    db.orders.push(order);
    mockData.write(db);
    return order;
  },
  updateStatus: async (id, status) => {
    const db = mockData.read();
    const idx = db.orders.findIndex(o => o.id === id);
    if (idx === -1) throw new Error("Order not found");
    db.orders[idx].status = status;
    mockData.write(db);
    return db.orders[idx];
  }
};
