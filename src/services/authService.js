const TOKEN_KEY = "inventory_token_v1";

export default {
  login: async (identifier, password) => {
    const normalized = typeof identifier === "string" ? identifier.trim() : "";
    const token = {
      id: "u_admin",
      role: "admin",
      email: normalized || "admin@demo.local",
      username: normalized.includes("@") ? normalized.split("@")[0] : normalized || "admin",
      issuedAt: Date.now(),
    };
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

