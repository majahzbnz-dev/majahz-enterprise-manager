
async function recordExpense(category, description, amount) {
  const value = Number(amount);

  if (!category || value <= 0) {
    throw new Error("Shigar da nau'in kashe kuɗi da adadi mai inganci.");
  }

  const record = {
    category,
    description: description.trim(),
    amount: value,
    date: new Date().toISOString()
  };

  return saveRecord("expenses", record);
}

async function displayExpenses() {
  const expenses = await getAllRecords("expenses");
  const list = document.getElementById("expenseList");

  list.innerHTML = "";

  if (expenses.length === 0) {
    list.textContent = "No expenses recorded yet.";
    return;
  }

  expenses.slice().reverse().forEach(expense => {
    const item = document.createElement("p");

    item.textContent =
      `${expense.category} | ${expense.description} | ₦${expense.amount}`;

    list.appendChild(item);
  });
}

document.getElementById("expenseForm").addEventListener(
  "submit",
  async function(event) {
    event.preventDefault();

    try {
      await recordExpense(
        document.getElementById("expenseCategory").value,
        document.getElementById("expenseDescription").value,
        document.getElementById("expenseAmount").value
      );

      this.reset();

      await displayExpenses();

      alert("Expense recorded successfully!");
    } catch (error) {
      alert("Error: " + error.message);
    }
  }
);

displayExpenses();

