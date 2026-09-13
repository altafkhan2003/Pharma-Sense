(() => {
  const sidebar = document.querySelector("[data-sidebar]");
  if (!sidebar) return;

  const activePage = document.body.dataset.activeNav;
  const navItems = [
    ["dashboard", "dashboard.html", "⌂", "Dashboard"],
    ["stock", "stock.html", "▣", "Stock Management"],
    ["expiry", "expiry.html", "♧", "Expiry Alerts"],
    ["sales", "sales.html", "▤", "Sales & Invoicing"],
    ["orders", "empty.html?page=orders", "🛒", "Order Management"],
    ["divider"],
    ["reports", "empty.html?page=reports", "▥", "Reports"],
    ["suppliers", "empty.html?page=suppliers", "♙", "Suppliers"],
    ["settings", "empty.html?page=settings", "⚙", "Settings"],
  ];

  sidebar.innerHTML = `
    <div class="brand">
      <span><img src="../../assets/images/core/logo_pharma_sense.png" alt="Pharma Sense logo"></span>
      <div><h1>Pharma Sense</h1><p>Pharmacy Management System</p></div>
    </div>
    <nav class="navigation" aria-label="Main navigation">
      ${navItems
        .map((item) =>
          item[0] === "divider"
            ? '<div class="sidebar-divider"></div>'
            : `<a href="${item[1]}" class="nav-item ${activePage === item[0] ? "active" : ""}"><span class="nav-icon">${item[2]}</span>${item[3]}</a>`,
        )
        .join("")}
    </nav>
    <div class="sidebar-bottom">
      <a href="../auth/login.html" class="nav-item logout"><span class="nav-icon">⇥</span>Log out</a>
    </div>`;
})();
