(() => {
  const inventoryKey = "pharmaSenseInventory";
  const salesKey = "pharmaSenseSales";
  const cart = [];
  const seedSales = [
    {
      id: "INV-2026-042",
      customer: "Aarav Shah",
      items: 3,
      payment: "UPI",
      total: 1248,
      status: "Paid",
    },
    {
      id: "INV-2026-041",
      customer: "Walk-in customer",
      items: 2,
      payment: "Cash",
      total: 436,
      status: "Paid",
    },
    {
      id: "INV-2026-040",
      customer: "Meera Patel",
      items: 4,
      payment: "Credit",
      total: 1860,
      status: "Pending",
    },
    {
      id: "INV-2026-039",
      customer: "Rohan Mehta",
      items: 1,
      payment: "Card",
      total: 265,
      status: "Paid",
    },
  ];
  const currency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  const inventory = () =>
    JSON.parse(localStorage.getItem(inventoryKey) || "[]");
  const sales = () => JSON.parse(localStorage.getItem(salesKey) || "[]");
  const saveSales = (items) =>
    localStorage.setItem(salesKey, JSON.stringify(items));
  const escapeHtml = (value) =>
    String(value).replace(
      /[&<>"']/g,
      (character) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[character],
    );
  const getLine = (id) => cart.find((line) => line.id === id);
  const totals = () => {
    const subtotal = cart.reduce(
      (sum, line) => sum + line.price * line.quantity,
      0,
    );
    const tax = Math.round(subtotal * 0.05);
    return { subtotal, tax, total: subtotal + tax };
  };

  function nextNumber() {
    return `INV-2026-${String(43 + sales().length).padStart(3, "0")}`;
  }
  function renderSummary() {
    const { subtotal, tax, total } = totals();
    document.querySelector("[data-subtotal]").textContent = currency(subtotal);
    document.querySelector("[data-tax]").textContent = currency(tax);
    document.querySelector("[data-grand-total]").textContent = currency(total);
    document.querySelector("[data-invoice-items]").textContent =
      `${cart.reduce((sum, line) => sum + line.quantity, 0)} item${cart.reduce((sum, line) => sum + line.quantity, 0) === 1 ? "" : "s"}`;
    document.querySelector("[data-complete-sale]").disabled = !cart.length;
    document.querySelector("[data-clear-sale]").disabled = !cart.length;
  }
  function renderCart() {
    const rows = document.querySelector("[data-invoice-lines]");
    rows.innerHTML = cart.length
      ? cart
          .map(
            (line) =>
              `<tr><td>${escapeHtml(line.name)}<span class="line-meta">${escapeHtml(line.brand)} · ${escapeHtml(line.sku)}</span></td><td>${currency(line.price)}</td><td><div class="line-quantity"><button type="button" data-quantity="${line.id}" data-change="-1" aria-label="Decrease ${escapeHtml(line.name)}">−</button><span>${line.quantity}</span><button type="button" data-quantity="${line.id}" data-change="1" aria-label="Increase ${escapeHtml(line.name)}">+</button></div></td><td>${currency(line.price * line.quantity)}</td><td><button type="button" class="remove-line" data-remove-line="${line.id}" aria-label="Remove ${escapeHtml(line.name)}">×</button></td></tr>`,
          )
          .join("")
      : '<tr class="invoice-empty"><td colspan="5"><span>⊕</span> Search for a medicine to start this invoice.</td></tr>';
    renderSummary();
  }
  function renderRecentSales() {
    const rows = [...sales(), ...seedSales].slice(0, 6);
    document.querySelector("[data-recent-sales]").innerHTML = rows
      .map(
        (sale) =>
          `<tr><td>${escapeHtml(sale.id)}</td><td>${escapeHtml(sale.customer)}</td><td>${sale.items} item${sale.items === 1 ? "" : "s"}</td><td><span class="payment-method">${escapeHtml(sale.payment)}</span></td><td>${currency(sale.total)}</td><td><span class="invoice-status ${sale.status === "Paid" ? "paid" : "pending"}">${escapeHtml(sale.status)}</span></td><td><button class="invoice-link" type="button" aria-label="View ${escapeHtml(sale.id)}">↗</button></td></tr>`,
      )
      .join("");
    const allSales = [...sales(), ...seedSales];
    const completedSales = sales().filter((sale) => sale.status === "Paid");
    const completedTotal = completedSales.reduce(
      (sum, sale) => sum + sale.total,
      24680,
    );
    document.querySelector("[data-today-sales]").textContent =
      currency(completedTotal);
    document.querySelector("[data-invoice-count]").textContent =
      42 + sales().length;
    document.querySelector("[data-average-invoice]").textContent = currency(
      Math.round(completedTotal / (42 + sales().length)),
    );
    document.querySelector("[data-amount-due]").textContent = currency(
      sales()
        .filter((sale) => sale.status === "Pending")
        .reduce((sum, sale) => sum + sale.total, 3240),
    );
  }
  function showResults(query) {
    const results = document.querySelector("[data-medicine-results]");
    const matches = inventory()
      .filter(
        (item) =>
          item.stockQty > 0 &&
          [item.name, item.brand, item.sku].some((value) =>
            value.toLowerCase().includes(query.toLowerCase()),
          ),
      )
      .slice(0, 6);
    results.hidden = !query || !matches.length;
    results.innerHTML = matches
      .map(
        (item) =>
          `<button class="medicine-result" type="button" data-add-medicine="${escapeHtml(item.id)}" role="option"><span class="result-dot"></span><span><b>${escapeHtml(item.name)}</b> · ${escapeHtml(item.brand)}</span><small>${item.stockQty} in stock · ${currency(item.price)}</small></button>`,
      )
      .join("");
  }
  function addMedicine(id) {
    const item = inventory().find((medicine) => medicine.id === id);
    if (!item) return;
    const line = getLine(id);
    if (line) line.quantity += 1;
    else cart.push({ ...item, quantity: 1 });
    document.querySelector("[data-medicine-search]").value = "";
    document.querySelector("[data-medicine-results]").hidden = true;
    renderCart();
  }
  function clearSale() {
    cart.length = 0;
    document.querySelector("[data-customer-name]").value = "";
    document.querySelector("[data-payment-method]").value = "Cash";
    document.querySelector("[data-sale-feedback]").hidden = true;
    renderCart();
  }
  function completeSale() {
    if (!cart.length) return;
    const { total } = totals();
    const payment = document.querySelector("[data-payment-method]").value;
    const sale = {
      id: document.querySelector("[data-invoice-number]").textContent,
      customer:
        document.querySelector("[data-customer-name]").value.trim() ||
        "Walk-in customer",
      items: cart.reduce((sum, line) => sum + line.quantity, 0),
      payment,
      total,
      status: payment === "Credit" ? "Pending" : "Paid",
    };
    saveSales([sale, ...sales()]);
    const feedback = document.querySelector("[data-sale-feedback]");
    feedback.textContent = `${sale.id} saved locally${sale.status === "Paid" ? " as paid" : " as payment due"}.`;
    feedback.hidden = false;
    cart.length = 0;
    document.querySelector("[data-customer-name]").value = "";
    document.querySelector("[data-invoice-number]").textContent = nextNumber();
    renderCart();
    renderRecentSales();
  }
  document
    .querySelector("[data-medicine-search]")
    .addEventListener("input", (event) => showResults(event.target.value));
  document
    .querySelector("[data-medicine-search]")
    .addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const first = document.querySelector("[data-add-medicine]");
        if (first) {
          event.preventDefault();
          addMedicine(first.dataset.addMedicine);
        }
      }
    });
  document
    .querySelector("[data-medicine-results]")
    .addEventListener("click", (event) => {
      const button = event.target.closest("[data-add-medicine]");
      if (button) addMedicine(button.dataset.addMedicine);
    });
  document
    .querySelector("[data-invoice-lines]")
    .addEventListener("click", (event) => {
      const quantity = event.target.closest("[data-quantity]");
      const remove = event.target.closest("[data-remove-line]");
      if (quantity) {
        const line = getLine(quantity.dataset.quantity);
        line.quantity += Number(quantity.dataset.change);
        if (line.quantity < 1) cart.splice(cart.indexOf(line), 1);
        renderCart();
      }
      if (remove) {
        const line = getLine(remove.dataset.removeLine);
        cart.splice(cart.indexOf(line), 1);
        renderCart();
      }
    });
  document
    .querySelector("[data-clear-sale]")
    .addEventListener("click", clearSale);
  document
    .querySelector("[data-complete-sale]")
    .addEventListener("click", completeSale);
  document
    .querySelector("[data-new-sale]")
    .addEventListener("click", clearSale);
  document.querySelector("[data-invoice-number]").textContent = nextNumber();
  renderCart();
  renderRecentSales();
})();
