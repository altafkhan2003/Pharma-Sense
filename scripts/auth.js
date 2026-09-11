(() => {
  const usersKey = "pharmaSenseUsers";
  const sessionKey = "pharmaSenseSession";
  const demoUsers = [
    { fullName: "Altaf Khan", email: "altaf@user.com", password: "123456" },
    { fullName: "Priya Sharma", email: "priya@user.com", password: "123456" },
    { fullName: "Rahul Verma", email: "rahul@user.com", password: "123456" },
  ];

  function users() {
    const savedUsers = JSON.parse(localStorage.getItem(usersKey) || "[]");
    const mergedUsers = [
      ...savedUsers,
      ...demoUsers.filter((demoUser) => !savedUsers.some((savedUser) => savedUser.email === demoUser.email)),
    ];
    if (mergedUsers.length !== savedUsers.length) localStorage.setItem(usersKey, JSON.stringify(mergedUsers));
    return mergedUsers;
  }

  function showMessage(element, message, kind = "error") {
    element.textContent = message;
    element.hidden = false;
    element.dataset.kind = kind;
  }

  function setUpPasswordToggle(input, toggle) {
    if (!input || !toggle) return;
    toggle.addEventListener("click", () => {
      const visible = input.type === "password";
      input.type = visible ? "text" : "password";
      toggle.setAttribute("aria-label", visible ? "Hide password" : "Show password");
    });
  }

  function setUpRegistration() {
    const form = document.querySelector(".register");
    const message = document.querySelector("[data-form-message]");
    setUpPasswordToggle(form.elements.password, document.querySelector("[data-toggle-password='password']"));
    setUpPasswordToggle(form.elements.confirmPassword, document.querySelector("[data-toggle-password='confirmPassword']"));

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const fullName = data.get("fullName").trim();
      const email = data.get("email").trim().toLowerCase();
      const password = data.get("password");

      if (password.length < 6) return showMessage(message, "Use a password with at least 6 characters.");
      if (password !== data.get("confirmPassword")) return showMessage(message, "Passwords do not match.");
      if (users().some((user) => user.email === email)) return showMessage(message, "An account already exists for this email.");

      localStorage.setItem(usersKey, JSON.stringify([...users(), { fullName, email, password }]));
      window.location.href = "login.html?registered=1";
    });
  }

  function setUpLogin() {
    const form = document.querySelector(".three");
    const message = document.querySelector("[data-form-message]");
    setUpPasswordToggle(form.elements.password, document.querySelector("[data-toggle-password='password']"));
    if (new URLSearchParams(window.location.search).has("registered")) showMessage(message, "Account created. Log in to continue.", "success");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const email = data.get("email").trim().toLowerCase();
      const password = data.get("password");
      const user = users().find((candidate) => candidate.email === email && candidate.password === password);
      if (!user) return showMessage(message, "Email or password is incorrect.");

      localStorage.setItem(sessionKey, JSON.stringify({ fullName: user.fullName, email: user.email }));
      window.location.href = "../app/dashboard.html";
    });
  }

  function setUpDashboard() {
    const session = JSON.parse(localStorage.getItem(sessionKey) || "null");
    if (!session) {
      window.location.href = "../auth/login.html";
      return;
    }

    const fullName = session.fullName || "User";
    const firstName = fullName.split(" ")[0];
    const initials = fullName.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join("");
    document.querySelectorAll("[data-user-name]").forEach((element) => { element.textContent = fullName; });
    document.querySelectorAll("[data-user-first-name]").forEach((element) => { element.textContent = firstName; });
    document.querySelectorAll("[data-user-initials]").forEach((element) => { element.textContent = initials; });
  }

  users();

  if (document.body.dataset.page === "register") setUpRegistration();
  if (document.body.dataset.page === "login") setUpLogin();
  if (document.body.dataset.page === "dashboard") setUpDashboard();
})();
