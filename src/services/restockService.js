import mockData from "../mockData";

const CRITICAL_THRESHOLD = 5;

function normalizeStatus(value) {
  return String(value || "pending").toLowerCase();
}

function getPriority(quantity = 0) {
  if (Number(quantity) === 0) return "Critical";
  if (Number(quantity) <= CRITICAL_THRESHOLD) return "High";
  if (Number(quantity) < 15) return "Medium";
  return "Low";
}

function getPriorityTone(priority) {
  if (priority === "Critical") return "red";
  if (priority === "High") return "orange";
  if (priority === "Medium") return "blue";
  return "green";
}

function getSuggestedQuantity(product) {
  const quantity = Number(product?.quantity || 0);
  if (quantity === 0) return 100;
  return Math.max(25, quantity * 8);
}

function updateProductStatus(product) {
  const quantity = Number(product.quantity || 0);
  if (quantity === 0) product.status = "out_of_stock";
  else if (quantity < 20) product.status = "low_stock";
  else product.status = "in_stock";
}

function findNextRequestNumber(requests, prefix) {
  const numbers = requests
    .filter((request) => String(request.id || "").startsWith(prefix))
    .map((request) => Number(String(request.id).replace(prefix, "")))
    .filter((n) => Number.isFinite(n));
  const next = numbers.length ? Math.max(...numbers) + 1 : prefix === "AR-" ? 1001 : 2001;
  return next;
}

function buildAutoRequest(product, requests = []) {
  const quantity = Number(product?.quantity || 0);
  const priority = getPriority(quantity);
  return {
    id: `AR-${findNextRequestNumber(requests, "AR-")}`,
    productId: product.id,
    productName: product.name,
    supplierId: product.supplierId || null,
    quantity: getSuggestedQuantity(product),
    source: "auto",
    status: "pending",
    reason: quantity === 0 ? "Auto restock triggered: out of stock" : "Auto restock triggered: critical stock level",
    priority,
    priorityTone: getPriorityTone(priority),
    statusTone: "yellow",
    createdAt: Date.now(),
  };
}

function buildManualRequest(payload, product) {
  const quantity = Math.max(1, Number(payload.quantity || 0));
  const priority = payload.priority || getPriority(quantity);
  return {
    id: `MR-${findNextRequestNumber(mockData.read().restockRequests || [], "MR-")}`,
    productId: product?.id || payload.productId || null,
    productName: payload.productName || product?.name || "Restock Request",
    supplierId: payload.supplierId ?? product?.supplierId ?? null,
    quantity,
    source: "manual",
    status: "pending",
    reason: payload.reason || "Manual restock request",
    priority,
    priorityTone: getPriorityTone(priority),
    statusTone: "yellow",
    createdAt: Date.now(),
  };
}

function writeDb(db) {
  mockData.write(db);
}

export default {
  criticalThreshold: CRITICAL_THRESHOLD,
  syncCriticalRequests: async () => {
    const db = mockData.read();
    const products = db.products || [];
    const requests = db.restockRequests || [];
    let changed = false;

    for (const product of products) {
      const quantity = Number(product.quantity || 0);
      if (quantity > CRITICAL_THRESHOLD) continue;

      const existing = requests.find(
        (request) =>
          request.productId === product.id &&
          request.source === "auto" &&
          ["pending", "accepted"].includes(normalizeStatus(request.status))
      );

      if (existing) {
        existing.quantity = getSuggestedQuantity(product);
        existing.productName = product.name;
        existing.supplierId = product.supplierId || existing.supplierId || null;
        existing.priority = getPriority(quantity);
        existing.priorityTone = getPriorityTone(existing.priority);
        existing.reason = quantity === 0 ? "Auto restock triggered: out of stock" : "Auto restock triggered: critical stock level";
        existing.updatedAt = Date.now();
        changed = true;
        continue;
      }

      requests.push(buildAutoRequest(product, requests));
      changed = true;
    }

    if (changed) {
      db.restockRequests = requests;
      writeDb(db);
    }

    return db.restockRequests || [];
  },

  list: async () => {
    const db = mockData.read();
    return (db.restockRequests || []).slice();
  },

  createManualRequest: async (payload = {}) => {
    const db = mockData.read();
    const product = (db.products || []).find((item) => item.id === payload.productId) || null;
    const request = buildManualRequest(payload, product);
    db.restockRequests = db.restockRequests || [];
    db.restockRequests.push(request);
    writeDb(db);
    return request;
  },

  acceptRequest: async (requestId, supplierId = null) => {
    const db = mockData.read();
    const request = (db.restockRequests || []).find((item) => item.id === requestId);
    if (!request) throw new Error("Request not found");

    const normalizedStatus = normalizeStatus(request.status);
    if (normalizedStatus.includes("complete")) {
      return request;
    }

    request.status = "accepted";
    request.statusTone = "blue";
    request.acceptedBy = supplierId || request.acceptedBy || null;
    request.acceptedAt = Date.now();

    writeDb(db);
    return request;
  },

  markDelivered: async (requestId) => {
    const db = mockData.read();
    const request = (db.restockRequests || []).find((item) => item.id === requestId);
    if (!request) throw new Error("Request not found");

    const normalizedStatus = normalizeStatus(request.status);
    if (normalizedStatus.includes("complete")) {
      return request;
    }

    const product = (db.products || []).find((item) => item.id === request.productId) || null;
    if (product) {
      product.quantity = Number(product.quantity || 0) + Number(request.quantity || 0);
      updateProductStatus(product);
    }

    request.status = "completed";
    request.statusTone = "green";
    request.deliveredAt = Date.now();
    request.fulfilledAt = Date.now();

    writeDb(db);
    return request;
  },

  markPending: async (requestId) => {
    const db = mockData.read();
    const request = (db.restockRequests || []).find((item) => item.id === requestId);
    if (!request) throw new Error("Request not found");
    request.status = "pending";
    request.statusTone = "yellow";
    writeDb(db);
    return request;
  },
};
