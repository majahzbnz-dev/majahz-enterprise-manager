
async function addProduct(product) {
  if (!product.name || !product.name.trim()) {
    throw new Error("Shigar da sunan kaya.");
  }

  const record = {
    name: product.name.trim(),
    category: product.category || "Other",
    quantity: Number(product.quantity) || 0,
    unit: product.unit || "bag",
    costPrice: Number(product.costPrice) || 0,
    sellingPrice: Number(product.sellingPrice) || 0,
    createdAt: new Date().toISOString()
  };

  return saveRecord("products", record);
}

async function getProducts() {
  return getAllRecords("products");
}

async function removeProduct(id) {
  return deleteRecord("products", Number(id));
}
