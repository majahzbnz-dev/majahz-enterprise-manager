

// MAJAHZ ENTERPRISE MANAGER
// CREDIT & OUTSTANDING MANAGEMENT

async function addDebt(customerName, phone, amount) {
  const name = String(customerName || "").trim();
  const value = Number(amount);

  if (!name || !Number.isFinite(value) || value <= 0) {
    throw new Error("Shigar da sunan kwastoma da adadin bashi mai inganci.");
  }

  const now = new Date().toISOString();

  return saveRecord("debts", {
    customerName: name,
    phone: String(phone || "").trim(),
    originalAmount: value,
    paidAmount: 0,
    balance: value,
    status: "Unpaid",
    date: now,
    updatedAt: now
  });
}

async function getDebts() {
  return getAllRecords("debts");
}

async function recordDebtPayment(debtId, amount) {
  const debts = await getDebts();

  const debt = debts.find(
    item => Number(item.id) === Number(debtId)
  );

  if (!debt) {
    throw new Error("Ba a samu bashin wannan kwastoma ba.");
  }

  const payment = Number(amount);
  const balance = Number(debt.balance ?? debt.originalAmount);

  if (!Number.isFinite(payment) || payment <= 0) {
    throw new Error("Shigar da adadin kuɗin da aka biya.");
  }

  if (payment > balance) {
    throw new Error("Kuɗin da aka biya ya fi ragowar bashi.");
  }

  const newPaidAmount = Number(debt.paidAmount || 0) + payment;
  const newBalance = balance - payment;

  const updatedDebt = {
    ...debt,
    paidAmount: newPaidAmount,
    balance: newBalance,
    status: newBalance === 0 ? "Paid" : "Partly Paid",
    updatedAt: new Date().toISOString()
  };

  await saveRecord("debts", updatedDebt);

  return updatedDebt;
}

// DELETE DEBT RECORD
async function removeDebt(id) {
  return deleteRecord("debts", Number(id));
}

async function displayDebts() {
  const list = document.getElementById("debtList");
  const selector = document.getElementById("debtSelect");

  if (!list) return;

  const debts = await getDebts();

  list.innerHTML = "";

  if (selector) {
    selector.innerHTML =
      '<option value="">Select customer debt</option>';
  }

  if (debts.length === 0) {
    list.textContent = "No customer debts recorded yet.";
    return;
  }

  debts.slice().reverse().forEach(debt => {
    const item = document.createElement("div");
    item.style.padding = "10px";
    item.style.borderBottom = "1px solid #ddd";

    const name = document.createElement("strong");
    name.textContent = debt.customerName;

    const details = document.createElement("p");
    details.textContent =
      `Phone: ${debt.phone || "Not provided"} | ` +
      `Debt: ₦${Number(debt.originalAmount || 0).toLocaleString()} | ` +
      `Paid: ₦${Number(debt.paidAmount || 0).toLocaleString()} | ` +
      `Balance: ₦${Number(debt.balance ?? debt.originalAmount ?? 0).toLocaleString()} | ` +
      `Status: ${debt.status || "Unpaid"}`;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete Debt";
    deleteButton.style.background = "#b42318";
    deleteButton.style.color = "#ffffff";
    deleteButton.style.marginTop = "5px";

    deleteButton.addEventListener("click", async () => {
      const confirmed = confirm(
        `Kana tabbatar kana son goge rikodin bashin ${debt.customerName}? Wannan aikin ba za a iya warware shi kai tsaye ba.`
      );

      if (!confirmed) return;

      try {
        await removeDebt(debt.id);
        await displayDebts();

        if (typeof updateDashboard === "function") {
          await updateDashboard();
        }

        alert("An goge rikodin bashin.");
      } catch (error) {
        alert("Error: " + error.message);
      }
    });

    item.append(name, details, deleteButton);
    list.appendChild(item);

    if (
      selector &&
      Number(debt.balance ?? debt.originalAmount) > 0
    ) {
      const option = document.createElement("option");
      option.value = debt.id;
      option.textContent =
        `${debt.customerName} - ₦${Number(
          debt.balance ?? debt.originalAmount
        ).toLocaleString()}`;

      selector.appendChild(option);
    }
  });
}

// ADD NEW DEBT
const debtForm = document.getElementById("debtForm");

if (debtForm) {
  debtForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    try {
      await addDebt(
        document.getElementById("debtCustomerName").value,
        document.getElementById("debtCustomerPhone").value,
        document.getElementById("debtAmount").value
      );

      this.reset();
      await displayDebts();

      if (typeof updateDashboard === "function") {
        await updateDashboard();
      }

      alert("Customer debt saved successfully!");
    } catch (error) {
      alert("Error: " + error.message);
    }
  });
}

// RECORD DEBT PAYMENT
const debtPaymentForm =
  document.getElementById("debtPaymentForm");

if (debtPaymentForm) {
  debtPaymentForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    try {
      await recordDebtPayment(
        document.getElementById("debtSelect").value,
        document.getElementById("debtPaymentAmount").value
      );

      this.reset();
      await displayDebts();

      if (typeof updateDashboard === "function") {
        await updateDashboard();
      }

      alert("Debt payment recorded successfully!");
    } catch (error) {
      alert("Error: " + error.message);
    }
  });
}

displayDebts();
