document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("transaction-form");
  const transactionList = document.getElementById("transaction-list");
  const walletBalance = document.getElementById("wallet-balance");

  let balance = parseFloat(localStorage.getItem("balance")) || 0;
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  function saveData() {
      localStorage.setItem("transactions", JSON.stringify(transactions));
      localStorage.setItem("balance", balance.toFixed(2));
  }

  function loadTransactions() {
      transactionList.innerHTML = "";
      transactions.forEach(({ name, amount, type }) => {
          addTransaction(name, amount, type, false);
      });
      walletBalance.textContent = balance.toFixed(2);
  }

  form.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = document.getElementById("transaction-name").value.trim();
      const amount = parseFloat(document.getElementById("transaction-amount").value.trim());
      const type = document.getElementById("transaction-type").value;

      if (name === "" || isNaN(amount) || amount <= 0) {
          alert("Please enter a valid name and amount.");
          return;
      }

      transactions.push({ name, amount, type });
      saveData();
      addTransaction(name, amount, type, true);
      updateWallet(type, amount);
      form.reset();
  });

  function addTransaction(name, amount, type, save = true) {
      const li = document.createElement("li");
      li.classList.add(type);
      li.innerHTML = `${name} - $${amount} 
          <button onclick="removeTransaction(this, ${amount}, '${type}', '${name}')">❌</button>`;

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

  window.removeTransaction = function (button, amount, type, name) {
      button.parentElement.remove();
      transactions = transactions.filter(transaction => transaction.name !== name);
      
      if (type === "income") {
          balance -= amount;
      } else {
          balance += amount;
      }

      walletBalance.textContent = balance.toFixed(2);
      saveData();
  };

  loadTransactions();
});
