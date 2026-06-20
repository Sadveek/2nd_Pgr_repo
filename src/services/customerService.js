import mockData from "../mockData";

export default {
  listCustomers: async () => {
    const db = mockData.read();
    return db.users.filter(u => u.role === "customer").map(u => ({ id: u.id, username: u.username, email: u.email, createdAt: u.createdAt }));
  },
  getProfile: async (userId) => {
    const db = mockData.read();
    return db.users.find(u => u.id === userId) || null;
  },
  updateProfile: async (userId, patch) => {
    const db = mockData.read();
    const idx = db.users.findIndex(u => u.id === userId);
    if (idx === -1) throw new Error("User not found");
    db.users[idx] = { ...db.users[idx], ...patch };
    mockData.write(db);
    return db.users[idx];
  },
  changePassword: async (userId, oldPass, newPass) => {
    const db = mockData.read();
    const idx = db.users.findIndex(u => u.id === userId);
    if (idx === -1) throw new Error("User not found");
    if (db.users[idx].password !== oldPass) throw new Error("Invalid current password");
    db.users[idx].password = newPass;
    mockData.write(db);
    return true;
  }
};
