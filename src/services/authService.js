<<<<<<< HEAD
import mockData from "../mockData";

function findUserByEmail(email) {
  const db = mockData.read();
  return db.users.find(u => u.email === email || u.username === email || u.username === email.split("@")[0]);
}

=======
>>>>>>> testing
const TOKEN_KEY = "inventory_token_v1";

export default {
  login: async (identifier, password) => {
<<<<<<< HEAD
    // naive validation against mock users
    const user = findUserByEmail(identifier);
    if (!user) throw new Error("User not found");
    if (user.password !== password) throw new Error("Invalid credentials");
    const token = { id: user.id, role: user.role, email: user.email, username: user.username, issuedAt: Date.now() };
=======
    const normalized = typeof identifier === "string" ? identifier.trim() : "";
    const token = {
      id: "u_admin",
      role: "admin",
      email: normalized || "admin@demo.local",
      username: normalized.includes("@") ? normalized.split("@")[0] : normalized || "admin",
      issuedAt: Date.now(),
    };
>>>>>>> testing
    localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
    return token;
  },
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
  },
  getSession: () => {
    try {
      const raw = localStorage.getItem(TOKEN_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  },
  currentUser: () => {
    try {
      const raw = localStorage.getItem(TOKEN_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  },
};

