(() => {
  const inventoryKey = "pharmaSenseInventory";
  const categories = ["Pain Relief", "Antibiotic", "Anti-Allergy", "Gastrointestinal", "Diabetes", "Cough & Cold"];
  const units = ["Tablet", "Capsule", "Bottle", "Syrup", "Injection", "Tube"];
  const statuses = ["In Stock", "Low Stock", "Expiring Soon", "Out of Stock"];
  const seedInventory = [
    ["Paracetamol 500mg", "PCM-500-24", "Crocin", "Pain Relief", 1250, 100, "Tablet", "2026-11-01", "In Stock", 2.5, "PCM-2408"],
    ["Amoxicillin 500mg", "AMX-500-24", "Amoxil", "Antibiotic", 985, 50, "Capsule", "2026-02-01", "In Stock", 8, "AMX-2411"],
    ["Cetirizine 10mg", "CTZ-010-25", "Zyrtec", "Anti-Allergy", 780, 60, "Tablet", "2027-01-01", "In Stock", 3, "CTZ-1124"],
    ["Pantoprazole 40mg", "PTZ-040-24", "Pantocid", "Gastrointestinal", 650, 50, "Tablet", "2026-12-01", "In Stock", 6, "PTZ-0831"],
    ["Azithromycin 250mg", "AZT-250-18", "Azithral", "Antibiotic", 540, 40, "Tablet", "2026-03-01", "Expiring Soon", 12, "AZT-2410"],
    ["Metformin 500mg", "MET-500-31", "Gluformin", "Diabetes", 320, 50, "Tablet", "2026-08-01", "In Stock", 4.5, "MET-0924"],
    ["Ibuprofen 400mg", "IBU-400-07", "Brufen", "Pain Relief", 120, 150, "Tablet", "2026-06-01", "Low Stock", 5, "IBU-2307"],
    ["Cough Syrup", "CSY-100-11", "Benadryl", "Cough & Cold", 0, 20, "Bottle", "", "Out of Stock", 95, "CSY-0918"],
  ].map(([name, sku, brand, category, stockQty, minStock, unit, expiryDate, status, price, batchNumber], index) => ({ id: `demo-${index + 1}`, name, sku, brand, category, stockQty, minStock, unit, expiryDate, status, price, batchNumber }));

  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
  const getInventory = () => JSON.parse(localStorage.getItem(inventoryKey) || "[]");
  const saveInventory = (inventory) => localStorage.setItem(inventoryKey, JSON.stringify(inventory));
  const formatDate = (value) => value ? new Intl.DateTimeFormat("en-IN", { month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00`)) : "—";
  const statusClass = (status) => ({ "In Stock": "in-stock", "Low Stock": "low-stock", "Expiring Soon": "expiring", "Out of Stock": "out-stock" })[status] || "in-stock";

  function initializeInventory() {
    if (!getInventory().length) saveInventory(seedInventory);
  }

  function modalMarkup() {
    return `<div class="inventory-modal-backdrop" data-inventory-modal hidden>
      <section class="inventory-modal" role="dialog" aria-modal="true" aria-labelledby="add-medicine-title">
        <header class="inventory-modal-header"><div><h2 id="add-medicine-title">Add Medicine</h2><p>Add an item to your pharmacy inventory.</p></div><button type="button" class="modal-close" data-close-inventory-modal aria-label="Close">×</button></header>
        <form class="inventory-form" data-inventory-form>
          <div class="inventory-form-grid">
            <label>Medicine Name<input name="name" required autocomplete="off" placeholder="e.g. Paracetamol 500mg" /></label>
            <label>SKU<input name="sku" required autocomplete="off" placeholder="e.g. PCM-500-24" /></label>
            <label>Brand<input name="brand" required autocomplete="off" placeholder="e.g. Crocin" /></label>
            <label>Category<select name="category" required>${categories.map((item) => `<option>${item}</option>`).join("")}</select></label>
            <label>Stock Quantity<input name="stockQty" type="number" min="0" required placeholder="0" /></label>
            <label>Minimum Stock Quantity<input name="minStock" type="number" min="0" required placeholder="0" /></label>
            <label>Unit<select name="unit" required>${units.map((item) => `<option>${item}</option>`).join("")}</select></label>
            <label>Expiry Date<input name="expiryDate" type="date" required /></label>
            <label>Status<select name="status" required>${statuses.map((item) => `<option>${item}</option>`).join("")}</select></label>
            <label>Price (₹)<input name="price" type="number" min="0" step="0.01" required placeholder="0.00" /></label>
            <label class="form-span-two">Batch Number<input name="batchNumber" required autocomplete="off" placeholder="e.g. PCM-2408" /></label>
          </div>
          <p class="inventory-form-message" data-inventory-message hidden role="alert"></p>
          <footer class="inventory-modal-footer"><button type="button" class="modal-cancel" data-close-inventory-modal>Cancel</button><button type="submit" class="primary-button">Add Medicine</button></footer>
        </form>
      </section>
    </div>`;
  }

  function setUpModal() {
    document.body.insertAdjacentHTML("beforeend", modalMarkup());
    const modal = document.querySelector("[data-inventory-modal]");
    const form = modal.querySelector("[data-inventory-form]");
    const open = () => { modal.hidden = false; document.body.classList.add("modal-open"); form.elements.name.focus(); };
    const close = () => { modal.hidden = true; document.body.classList.remove("modal-open"); };
    document.querySelectorAll("[data-open-inventory-modal]").forEach((button) => button.addEventListener("click", (event) => { event.preventDefault(); open(); }));
    modal.querySelectorAll("[data-close-inventory-modal]").forEach((button) => button.addEventListener("click", close));
    modal.addEventListener("click", (event) => { if (event.target === modal) close(); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !modal.hidden) close(); });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const sku = data.get("sku").trim().toUpperCase();
      if (getInventory().some((item) => item.sku === sku)) {
        const message = modal.querySelector("[data-inventory-message]");
        message.textContent = "A medicine with this SKU already exists.";
        message.hidden = false;
        return;
      }
      const item = Object.fromEntries(data.entries());
      item.id = `medicine-${Date.now()}`;
      item.sku = sku;
      item.stockQty = Number(item.stockQty);
      item.minStock = Number(item.minStock);
      item.price = Number(item.price);
      saveInventory([...getInventory(), item]);
      form.reset();
      close();
      renderStockPage();
    });
  }

  function renderStockPage() {
    const rows = document.querySelector("[data-stock-rows]");
    if (!rows) return;
    const activeFilter = document.querySelector(".stock-tab.active")?.dataset.filter || "all";
    const query = document.querySelector("[data-stock-search]")?.value.trim().toLowerCase() || "";
    const filtered = getInventory().filter((item) => {
      const matchesFilter = activeFilter === "all" || item.status === activeFilter;
      const matchesQuery = !query || [item.name, item.brand, item.sku].some((value) => value.toLowerCase().includes(query));
      return matchesFilter && matchesQuery;
    });
    rows.innerHTML = filtered.map((item) => `<tr><td><span class="medicine-dot green"></span>${escapeHtml(item.name)}</td><td>${escapeHtml(item.brand)}</td><td>${escapeHtml(item.category)}</td><td>${item.stockQty.toLocaleString("en-IN")}</td><td>${escapeHtml(item.unit)}</td><td>${formatDate(item.expiryDate)}</td><td><span class="stock-status ${statusClass(item.status)}">● ${escapeHtml(item.status)}</span></td><td><button class="row-action" aria-label="Edit ${escapeHtml(item.name)}">✎</button></td></tr>`).join("") || '<tr><td colspan="8" class="stock-empty">No medicines match this filter.</td></tr>';
    const count = document.querySelector("[data-stock-count]");
    if (count) count.textContent = `Showing ${filtered.length} of ${getInventory().length} medicines`;
  }

  function setUpStockFilters() {
    document.querySelectorAll(".stock-tab").forEach((tab) => tab.addEventListener("click", () => {
      document.querySelectorAll(".stock-tab").forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");
      renderStockPage();
    }));
    document.querySelector("[data-stock-search]")?.addEventListener("input", renderStockPage);
    renderStockPage();
  }

  initializeInventory();
  setUpModal();
  setUpStockFilters();
})();
