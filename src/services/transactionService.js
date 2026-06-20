import mockData from "../mockData";

function uid(prefix = "t_") {
  return `${prefix}${Math.random().toString(36).slice(2, 9)}`;
}

export default {
  list: async () => {
    const db = mockData.read();
    return db.transactions.slice();
  },
  create: async ({ orderId, amount, paymentMethod }) => {
    const db = mockData.read();
    const t = { id: uid(), orderId, amount, paymentMethod, createdAt: Date.now() };
    db.transactions.push(t);
    mockData.write(db);
    return t;
  },
  get: async (id) => {
    const db = mockData.read();
    return db.transactions.find(t => t.id === id) || null;
  }
};
