
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
    const purchases = await getAllRecords("purchases");

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

    const totalPurchases = purchases.reduce(
      (sum, purchase) => sum + (Number(purchase.totalCost) || 0), 0
    );

    const values = {
      totalMoney: totalSales - totalExpenses,
      totalSales,
      totalProfit: totalProfit - totalExpenses,
      totalExpenses,
      totalProducts,
      totalStock,
      totalPurchases
    };

    Object.entries(values).forEach(([key, value]) => {
      const element = document.getElementById(key);
      if (element) {
        element.textContent = [
          "totalMoney", "totalSales", "totalProfit",
          "totalExpenses", "totalPurchases"
        ].includes(key)
          ? moneyFormat(value)
          : Number(value).toLocaleString("en-NG");
      }
    });

  } catch (error) {
    console.error("Dashboard error:", error);
  }
}

document.addEventListener("DOMContentLoaded", updateDashboard);
