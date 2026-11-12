
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

