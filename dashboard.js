
const moneyFormat = (amount) =>
  "₦" + (Number(amount) || 0).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

async function updateDashboard() {
  try {
    const products = await getAllRecords("products");
    const sales = await getAllRecords("sales");
    const expenses = await getAllRecords("expenses");

    const totalSales = sales.reduce(
      (sum, sale) => sum + (Number(sale.saleAmount) || 0), 0
    );

    const totalProfit = sales.reduce(
      (sum, sale) => sum + (Number(sale.profit) || 0), 0
    );

    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + (Number(expense.amount) || 0), 0
    );

    const totalProducts = products.length;

    const totalStock = products.reduce((sum, product) => {
      return sum + Number(
        product.stockInMudu ??
        (Number(product.quantity) * (Number(product.muduPerBag) || 21))
      );
    }, 0);

    const values = {
      totalMoney: totalSales - totalExpenses,
      totalProducts,
      totalStock,
      totalSales,
      totalProfit: totalProfit - totalExpenses,
      totalExpenses,
      totalOutstanding: 0
    };

    Object.entries(values).forEach(([key, value]) => {
      const element = document.getElementById(key);

      if (element) {
        if (key === "totalProducts") {
          element.textContent = value.toLocaleString("en-NG");
        } else if (key === "totalStock") {
          element.textContent = value.toLocaleString("en-NG") + " Mudu";
        } else {
          element.textContent = moneyFormat(value);
        }
      }
    });

  } catch (error) {
    console.error("Dashboard error:", error);
  }
}

document.addEventListener("DOMContentLoaded", updateDashboard);
