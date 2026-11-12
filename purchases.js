
async function recordPurchase(productId, quantity, totalCost) {
  const products = await getProducts();

  const product = products.find(
    item => Number(item.id) === Number(productId)
  );

  if (!product) {
    throw new Error("Ba a samu wannan kaya ba.");
  }

  const qty = Number(quantity);
  const cost = Number(totalCost);

  if (qty <= 0 || cost <= 0) {
    throw new Error("Shigar da adadi da kuɗi masu inganci.");
  }

  const oldQuantity = Number(product.quantity) || 0;
  const oldCost = Number(product.costPrice) || 0;

  const newQuantity = oldQuantity + qty;
  const averageCost =
    ((oldQuantity * oldCost) + cost) / newQuantity;

  const muduPerBag = Number(product.muduPerBag) || 21;

  let stockInMudu = product.stockInMudu;

  if (product.unit === "Bag") {
    stockInMudu =
      Number(product.stockInMudu ?? oldQuantity * muduPerBag)
      + (qty * muduPerBag);
  }

  await saveRecord("products", {
    ...product,
    quantity: newQuantity,
    costPrice: averageCost,
    stockInMudu
  });

  await saveRecord("purchases", {
    productId: product.id,
    productName: product.name,
    quantity: qty,
    unit: product.unit,
    totalCost: cost,
    date: new Date().toISOString()
  });

  return { newQuantity, averageCost };
}

async function displayPurchaseProducts() {
  const products = await getProducts();
  const select = document.getElementById("purchaseProduct");

  select.innerHTML = '<option value="">Choose product</option>';

  products.forEach(product => {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = `${product.name} (${product.unit})`;
    select.appendChild(option);
  });
}

async function displayPurchaseHistory() {
  const purchases = await getAllRecords("purchases");
  const list = document.getElementById("purchaseList");

  list.innerHTML = "";

  if (purchases.length === 0) {
    list.textContent = "No purchases recorded yet.";
    return;
  }

  purchases.slice().reverse().forEach(purchase => {
    const item = document.createElement("p");

    item.textContent =
      `${purchase.productName} | ${purchase.quantity} ${purchase.unit} | ₦${purchase.totalCost}`;

    list.appendChild(item);
  });
}

document.getElementById("purchaseForm").addEventListener(
  "submit",
  async function(event) {
    event.preventDefault();

    try {
      const result = await recordPurchase(
        document.getElementById("purchaseProduct").value,
        document.getElementById("purchaseQuantity").value,
        document.getElementById("purchaseCost").value
      );

      this.reset();

      await displayPurchaseProducts();
      await displayPurchaseHistory();
      await displayProducts();

      alert(
        "Purchase recorded successfully!\n" +
        "New stock: " + result.newQuantity
      );
    } catch (error) {
      alert("Error: " + error.message);
    }
  }
);

displayPurchaseProducts();
displayPurchaseHistory();
