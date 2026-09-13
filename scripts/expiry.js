(() => {
  const alerts = [
    {
      name: "Cough Syrup 100ml",
      brand: "Benadryl",
      batch: "B2045",
      date: "Aug 10, 2025",
      days: -1,
      state: "expired",
      color: "orange",
    },
    {
      name: "Amoxicillin 500mg",
      brand: "Amoxil",
      batch: "A1187",
      date: "Aug 14, 2025",
      days: 3,
      state: "week",
      color: "purple",
    },
    {
      name: "Paracetamol 500mg",
      brand: "Crocin",
      batch: "P3321",
      date: "Aug 16, 2025",
      days: 5,
      state: "week",
      color: "orange",
    },
    {
      name: "Azithromycin 250mg",
      brand: "Azithral",
      batch: "Z7764",
      date: "Aug 22, 2025",
      days: 11,
      state: "week",
      color: "blue",
    },
    {
      name: "Metformin 500mg",
      brand: "Gluformin",
      batch: "M5590",
      date: "Aug 28, 2025",
      days: 17,
      state: "month",
      color: "green",
    },
    {
      name: "Ibuprofen 400mg",
      brand: "Brufen",
      batch: "B6732",
      date: "Sep 05, 2025",
      days: 25,
      state: "month",
      color: "blue",
    },
    {
      name: "Cetirizine 10mg",
      brand: "Zyrtec",
      batch: "C4421",
      date: "Sep 09, 2025",
      days: 29,
      state: "month",
      color: "purple",
    },
    {
      name: "Pantoprazole 40mg",
      brand: "Pantocid",
      batch: "P8810",
      date: "Sep 12, 2025",
      days: 32,
      state: "safe",
      color: "yellow",
    },
  ];
  const rows = document.querySelector("[data-expiry-rows]");
  const count = document.querySelector("[data-expiry-count]");
  const search = document.querySelector("[data-expiry-search]");
  let activeFilter = "all";
  const statusLabel = (state) =>
    ({
      expired: "Expired",
      week: "Due in 7 Days",
      month: "Due in 30 Days",
      safe: "Safe",
    })[state];
  const daysLabel = (item) => (item.days < 0 ? `${item.days}` : item.days);
  function render() {
    const query = search.value.trim().toLowerCase();
    const visible = alerts.filter(
      (alert) =>
        (activeFilter === "all" || alert.state === activeFilter) &&
        (!query ||
          [alert.name, alert.brand, alert.batch].some((value) =>
            value.toLowerCase().includes(query),
          )),
    );
    rows.innerHTML =
      visible
        .map(
          (alert) =>
            `<tr><td class="expiry-medicine"><span class="expiry-pill ${alert.color}"></span>${alert.name}</td><td>${alert.brand}</td><td>${alert.batch}</td><td>${alert.date}</td><td class="days-left ${alert.state}">${daysLabel(alert)}</td><td><span class="expiry-status ${alert.state}">● ${statusLabel(alert.state)}</span></td><td><button class="expiry-row-action" type="button" aria-label="Actions for ${alert.name}">⋮</button></td></tr>`,
        )
        .join("") ||
      '<tr><td colspan="7" class="expiry-empty">No expiry alerts match this filter.</td></tr>';
    count.textContent = `Showing ${visible.length} of ${alerts.length} items`;
  }
  document.querySelectorAll(".expiry-tab").forEach((tab) =>
    tab.addEventListener("click", () => {
      document
        .querySelectorAll(".expiry-tab")
        .forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");
      activeFilter = tab.dataset.expiryFilter;
      render();
    }),
  );
  search.addEventListener("input", render);
  document
    .querySelector("[data-expiry-report]")
    .addEventListener("click", () => {
      document.querySelector("[data-expiry-report-message]").hidden = false;
    });
  render();
})();
