(() => {
  const modules = {
    sales: { title: "Sales & Invoicing", description: "Create and manage pharmacy sales and invoices.", message: "No sales records are ready to show yet.", icon: "▤" },
    orders: { title: "Order Management", description: "Track medicine orders from your suppliers.", message: "No purchase orders are ready to show yet.", icon: "🛒" },
    reports: { title: "Reports", description: "Review your pharmacy's key business insights.", message: "No reports are ready to show yet.", icon: "▥" },
    suppliers: { title: "Suppliers", description: "Manage the suppliers that support your pharmacy.", message: "No suppliers are ready to show yet.", icon: "♙" },
    settings: { title: "Settings", description: "Set up pharmacy preferences and account details.", message: "No settings are ready to show yet.", icon: "⚙" },
  };
  const key = new URLSearchParams(window.location.search).get("page");
  const module = modules[key] || modules.sales;
  document.body.dataset.activeNav = modules[key] ? key : "sales";
  document.title = `Pharma Sense - ${module.title}`;
  document.querySelectorAll("[data-empty-title]").forEach((element) => { element.textContent = module.title; });
  document.querySelectorAll("[data-empty-description]").forEach((element) => { element.textContent = module.description; });
  document.querySelectorAll("[data-empty-message]").forEach((element) => { element.textContent = module.message; });
  document.querySelectorAll("[data-empty-icon]").forEach((element) => { element.textContent = module.icon; });
})();
