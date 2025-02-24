document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("transaction-form");
  const transactionList = document.getElementById("transaction-list");
  const walletBalance = document.getElementById("wallet-balance");
  const clearButton = document.getElementById("clear-data");
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const monthFilter = document.getElementById("month-filter");
  const yearFilter = document.getElementById("year-filter");
  const applyFilterButton = document.getElementById("apply-filter");
  const resetFilterButton = document.getElementById("reset-filter"); // New Reset Filter Button

  const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
  ];

  months.forEach((month, index) => {
      let option = document.createElement("option");
      option.value = index + 1; // Month number (1-12)
      option.textContent = month;
      monthFilter.appendChild(option);
  });

  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= currentYear - 5; i--) {
      let option = document.createElement("option");
      option.value = i;
      option.textContent = i;
      yearFilter.appendChild(option);
  }

  let balance = parseFloat(localStorage.getItem("balance")) || 0;
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  let darkMode = localStorage.getItem("darkMode") === "enabled";

  if (darkMode) {
      document.body.classList.add("dark-mode");
  }

  if (darkModeToggle) {
      darkModeToggle.addEventListener("click", function () {
          document.body.classList.toggle("dark-mode");
          localStorage.setItem("darkMode", document.body.classList.contains("dark-mode") ? "enabled" : "disabled");
      });
  }

  function saveData() {
      localStorage.setItem("transactions", JSON.stringify(transactions));
      localStorage.setItem("balance", balance.toFixed(2));
  }

  function loadTransactions() {
      transactionList.innerHTML = "";
      transactions.forEach(({ name, amount, type, date }) => {
          addTransaction(name, amount, type, false, date);
      });
      walletBalance.textContent = balance.toFixed(2);
  }

  applyFilterButton.addEventListener("click", function () {
      const selectedMonth = parseInt(monthFilter.value);
      const selectedYear = parseInt(yearFilter.value);

      transactionList.innerHTML = "";

      transactions.forEach(({ name, amount, type, date }) => {
          const transactionDate = new Date(date);
          const transactionMonth = transactionDate.getMonth() + 1;
          const transactionYear = transactionDate.getFullYear();

          if (transactionMonth === selectedMonth && transactionYear === selectedYear) {
              addTransaction(name, amount, type, false, date);
          }
      });
  });

  // ✅ New "Reset Filter" button event
  resetFilterButton.addEventListener("click", function () {
      loadTransactions(); // Reloads all transactions
      monthFilter.value = "";
      yearFilter.value = "";
  });

  form.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = document.getElementById("transaction-name").value.trim();
      const amount = parseFloat(document.getElementById("transaction-amount").value.trim());
      const type = document.getElementById("transaction-type").value;

      if (name === "" || isNaN(amount) || amount <= 0) {
          alert("Please enter a valid name and amount.");
          return;
      }

      const date = new Date().toISOString();
      transactions.push({ name, amount, type, date });

      saveData();
      addTransaction(name, amount, type, true, date);
      updateWallet(type, amount);
      form.reset();
  });

  function addTransaction(name, amount, type, save = true, date = new Date().toISOString()) {
      const transactionDate = new Date(date);
      const formattedDate = transactionDate.toLocaleDateString();

      const li = document.createElement("li");
      li.classList.add(type);
      li.innerHTML = `${formattedDate} - ${name} - $${amount} 
          <button onclick="removeTransaction(this, ${amount}, '${type}', '${name}', '${date}')">❌</button>`;

      transactionList.appendChild(li);

      if (save) saveData();
  }

  function updateWallet(type, amount) {
      if (type === "income") {
          balance += amount;
      } else if (type === "expense") {
          balance -= amount;
      }
      walletBalance.textContent = balance.toFixed(2);
      saveData();
  }

  window.removeTransaction = function (button, amount, type, name, date) {
      const index = transactions.findIndex(t => t.name === name && t.amount === amount && t.type === type && t.date === date);
      if (index !== -1) transactions.splice(index, 1);

      button.parentElement.remove();

      balance += (type === "income") ? -amount : amount;
      walletBalance.textContent = balance.toFixed(2);
      saveData();
  };

  clearButton.addEventListener("click", function () {
      if (confirm("Are you sure you want to clear all data?")) {
          localStorage.clear();
          transactions = [];
          balance = 0;
          transactionList.innerHTML = "";
          walletBalance.textContent = "0.00";
      }
  });

  loadTransactions();
});
