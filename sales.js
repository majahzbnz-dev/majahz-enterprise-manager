
async function recordSale(productId, quantityMudu, saleAmount) {
  const products = await getProducts();
  const product = products.find(
    item => Number(item.id) === Number(productId)
  );

  if (!product) {
    throw new Error("Ba a samu wannan kaya ba.");
  }

  const muduPerBag = Number(product.muduPerBag) || 21;
  const quantity = Number(quantityMudu);
  const amount = Number(saleAmount);

  const currentStock = Number(
    product.stockInMudu ?? product.quantity * muduPerBag
  );

  if (quantity <= 0 || amount <= 0) {
    throw new Error("Shigar da adadi da kuɗi masu inganci.");
  }

  if (quantity > currentStock) {
    throw new Error("Stock bai isa ba.");
  }

  const costPerMudu = Number(product.costPrice) / muduPerBag;
  const totalCost = costPerMudu * quantity;
  const profit = amount - totalCost;
  const remainingStock = currentStock - quantity;

  await saveRecord("products", {
    ...product,
    quantity: remainingStock / muduPerBag,
    stockInMudu: remainingStock
  });

  await saveRecord("sales", {
    productId: product.id,
    productName: product.name,
    quantityMudu: quantity,
    saleAmount: amount,
    costAmount: totalCost,
    profit: profit,
    date: new Date().toISOString()
  });

  return {
    remainingStock,
    profit
  };
}

async function getSales() {
  return getAllRecords("sales");
}

async function displaySalesProducts() {
  const products = await getProducts();
  const select = document.getElementById("saleProduct");

  select.innerHTML = '<option value="">Choose product</option>';

  products.forEach((product) => {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = `${product.name} (${product.stockInMudu ?? product.quantity * (product.muduPerBag || 21)} Mudu)`;
    select.appendChild(option);
  });
}

async function displaySalesHistory() {
  const sales = await getSales();
  const list = document.getElementById("salesList");

  list.innerHTML = "";

  if (sales.length === 0) {
    list.textContent = "No sales recorded yet.";
    return;
  }

  sales.slice().reverse().forEach((sale) => {
    const item = document.createElement("p");
    item.textContent =
      `${sale.productName} | ${sale.quantityMudu} Mudu | ` +
      `₦${sale.saleAmount} | Profit: ₦${sale.profit.toFixed(2)}`;
    list.appendChild(item);
  });
}

document.getElementById("salesForm").addEventListener("submit", async function(event) {
  event.preventDefault();

  try {
    const result = await recordSale(
      document.getElementById("saleProduct").value,
      document.getElementById("saleQuantityMudu").value,
      document.getElementById("saleAmount").value
    );

    this.reset();

   await displaySalesProducts();
await displaySalesHistory();
await displayProducts();

if (typeof updateDashboard === "function") {
  await updateDashboard();
}
    alert(
      `Sale recorded successfully!\nRemaining stock: ${result.remainingStock} Mudu\nProfit: ₦${result.profit.toFixed(2)}`
    );
  } catch (error) {
    alert("Error: " + error.message);
  }
});

displaySalesProducts();
displaySalesHistory();
