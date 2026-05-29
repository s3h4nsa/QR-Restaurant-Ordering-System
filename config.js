/**
 * ============================================================
 *  RESTAURANT SYSTEM — CENTRAL CONFIG
 *  Edit this file to customize the entire system.
 *  All modules read from here. No need to touch other files.
 * ============================================================
 */

const RESTAURANT_CONFIG = {

  // ── RESTAURANT INFO ────────────────────────────────────────
  name: "The Golden Spoon",
  tagline: "Fresh. Local. Delicious.",
  logo: "", // URL or base64 image, leave empty for text logo
  currency: "LKR",
  currencySymbol: "Rs.",

  // ── MODE ──────────────────────────────────────────────────
  // "offline"  → uses localStorage only (no server needed)
  // "online"   → posts to API_BASE_URL below
  mode: "offline",
  API_BASE_URL: "https://your-server.com/api", // only used in "online" mode

  // ── SECURITY ───────────────────────────────────────────────
  kitchenPIN: "1234",
  cashierPIN: "5678",
  // Valid table tokens — QR codes encode these.
  // Format: "TABLE_ID:SECRET_TOKEN"
  // Generate tokens with the included qr-generator tool.
  validTables: {
    "T01": { label: "Table 1",  secret: "a3f8b2c1" },
    "T02": { label: "Table 2",  secret: "d9e4f7a2" },
    "T03": { label: "Table 3",  secret: "b5c6d8e3" },
    "T04": { label: "Table 4",  secret: "f1a2b9c4" },
    "T05": { label: "Table 5",  secret: "e7d3c2f5" },
    "T06": { label: "Table 6",  secret: "c4b8a1d6" },
    "BAR": { label: "Bar",      secret: "a9f2e3b7" },
  },

  // ── ORDER SETTINGS ─────────────────────────────────────────
  requireGuestName: true,       // Ask for name when QR scanned
  allowNotes: true,             // Notes per item
  taxRate: 0.10,                // 10% — set to 0 to disable
  serviceCharge: 0.05,          // 5% — set to 0 to disable
  orderTimeout: 8 * 60 * 60,   // seconds before order auto-closes (8h)

  // ── MENU ───────────────────────────────────────────────────
  // Categories and items. Add/remove freely.
  // item: { id, name, description, price, image (optional URL), available }
  menu: [
    {
      category: "🥗 Starters",
      items: [
        { id: "S01", name: "Garden Salad",       description: "Fresh mixed greens, cherry tomatoes, cucumber",        price: 650,  available: true },
        { id: "S02", name: "Soup of the Day",    description: "Ask your waiter for today's selection",               price: 550,  available: true },
        { id: "S03", name: "Garlic Bread",       description: "Toasted ciabatta with herb butter",                   price: 450,  available: true },
        { id: "S04", name: "Spring Rolls (4pc)", description: "Crispy vegetable rolls with sweet chilli dip",        price: 750,  available: true },
      ]
    },
    {
      category: "🍽️ Mains",
      items: [
        { id: "M01", name: "Grilled Chicken",    description: "Free-range chicken, seasonal veg, mashed potato",     price: 1850, available: true },
        { id: "M02", name: "Fish & Chips",       description: "Beer-battered snapper, thick-cut fries, tartar sauce",price: 1750, available: true },
        { id: "M03", name: "Pasta Arrabiata",    description: "Penne in spicy tomato sauce, parmesan",               price: 1450, available: true },
        { id: "M04", name: "Beef Burger",        description: "200g beef patty, cheese, lettuce, tomato, brioche",   price: 1650, available: true },
        { id: "M05", name: "Veggie Stir Fry",   description: "Seasonal vegetables, jasmine rice, soy-ginger sauce", price: 1250, available: true },
        { id: "M06", name: "Mutton Curry",       description: "Slow-cooked, fragrant spices, basmati rice, raita",   price: 1950, available: false },
      ]
    },
    {
      category: "🍰 Desserts",
      items: [
        { id: "D01", name: "Chocolate Lava Cake",description: "Warm with vanilla ice cream",                         price: 850,  available: true },
        { id: "D02", name: "Mango Panna Cotta",  description: "Seasonal fresh mango, coconut cream",                 price: 750,  available: true },
        { id: "D03", name: "Ice Cream (2 scoops)",description: "Vanilla / Chocolate / Strawberry",                   price: 550,  available: true },
      ]
    },
    {
      category: "🥤 Drinks",
      items: [
        { id: "K01", name: "Fresh Lime Soda",    description: "Sweet or salted",                                     price: 350,  available: true },
        { id: "K02", name: "Mango Juice",        description: "100% fresh pressed",                                  price: 450,  available: true },
        { id: "K03", name: "Coffee",             description: "Espresso / Americano / Latte",                        price: 400,  available: true },
        { id: "K04", name: "Tea",                description: "Ceylon / Herbal / Green",                             price: 300,  available: true },
        { id: "K05", name: "Mineral Water",      description: "500ml",                                               price: 200,  available: true },
        { id: "K06", name: "Soft Drink",         description: "Coca-Cola / Sprite / Fanta",                          price: 300,  available: true },
      ]
    }
  ]
};

// ── STORAGE ADAPTER (LEGO block — swap for real DB) ──────────
const Storage = {
  _key: "rst_orders",

  _load() {
    try { return JSON.parse(localStorage.getItem(this._key) || "{}"); }
    catch { return {}; }
  },

  _save(data) {
    localStorage.setItem(this._key, JSON.stringify(data));
  },

  async getOrders() {
    if (RESTAURANT_CONFIG.mode === "online") {
      const r = await fetch(`${RESTAURANT_CONFIG.API_BASE_URL}/orders`);
      return r.json();
    }
    return this._load();
  },

  async saveOrder(order) {
    if (RESTAURANT_CONFIG.mode === "online") {
      return fetch(`${RESTAURANT_CONFIG.API_BASE_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order)
      }).then(r => r.json());
    }
    const data = this._load();
    data[order.id] = order;
    this._save(data);
    return order;
  },

  async updateOrder(orderId, patch) {
    if (RESTAURANT_CONFIG.mode === "online") {
      return fetch(`${RESTAURANT_CONFIG.API_BASE_URL}/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch)
      }).then(r => r.json());
    }
    const data = this._load();
    if (data[orderId]) {
      data[orderId] = { ...data[orderId], ...patch };
      this._save(data);
      return data[orderId];
    }
    return null;
  },

  async getOrdersByTable(tableId) {
    const orders = await this.getOrders();
    return Object.values(orders).filter(o =>
      o.tableId === tableId && o.status !== "closed"
    );
  }
};

// ── SECURITY HELPERS ──────────────────────────────────────────
const Security = {
  // Validate QR token — returns table info or null
  validateTableToken(tableId, secret) {
    const table = RESTAURANT_CONFIG.validTables[tableId];
    if (!table) return null;
    if (table.secret !== secret) return null;
    return { id: tableId, label: table.label };
  },

  // PIN check for kitchen / cashier
  checkPIN(role, pin) {
    if (role === "kitchen") return pin === RESTAURANT_CONFIG.kitchenPIN;
    if (role === "cashier") return pin === RESTAURANT_CONFIG.cashierPIN;
    return false;
  },

  // Generate unique order ID
  generateOrderId() {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  },

  // Sanitize user input
  sanitize(str) {
    return String(str).replace(/[<>"'&]/g, c => ({
      "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "&": "&amp;"
    }[c])).trim().substring(0, 200);
  }
};

// ── PRICE HELPERS ─────────────────────────────────────────────
const Pricing = {
  subtotal(items) {
    return items.reduce((s, i) => s + i.price * i.qty, 0);
  },
  tax(subtotal) {
    return Math.round(subtotal * RESTAURANT_CONFIG.taxRate);
  },
  serviceCharge(subtotal) {
    return Math.round(subtotal * RESTAURANT_CONFIG.serviceCharge);
  },
  total(items) {
    const sub = this.subtotal(items);
    return sub + this.tax(sub) + this.serviceCharge(sub);
  },
  format(amount) {
    return `${RESTAURANT_CONFIG.currencySymbol} ${amount.toLocaleString()}`;
  }
};

// Export for module environments
if (typeof module !== "undefined") module.exports = { RESTAURANT_CONFIG, Storage, Security, Pricing };
