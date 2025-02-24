document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("transaction-form");
  const transactionList = document.getElementById("transaction-list");
  const walletBalance = document.getElementById("wallet-balance"); // Wallet balance display

  let balance = 0; // Initial balance

  form.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = document.getElementById("transaction-name").value.trim();
      const amount = parseFloat(document.getElementById("transaction-amount").value.trim());
      const type = document.getElementById("transaction-type").value;

      if (name === "" || isNaN(amount) || amount <= 0) {
          alert("Please enter a valid name and amount.");
          return;
      }

      addTransaction(name, amount, type);
      updateWallet(type, amount);
      form.reset();
  });

  function addTransaction(name, amount, type) {
      const li = document.createElement("li");
      li.classList.add(type);
      li.innerHTML = `${name} - $${amount} 
          <button onclick="removeTransaction(this, ${amount}, '${type}')">❌</button>`;

      transactionList.appendChild(li);
  }

  function updateWallet(type, amount) {
      if (type === "income") {
          balance += amount;
      } else if (type === "expense") {
          balance -= amount;
      }
      walletBalance.textContent = balance.toFixed(2);
  }

  window.removeTransaction = function (button, amount, type) {
      button.parentElement.remove();
      if (type === "income") {
          balance -= amount; // Deduct income from balance when deleted
      } else {
          balance += amount; // Add expense back when deleted
      }
      walletBalance.textContent = balance.toFixed(2);
  };
});
