
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

async function displayProducts() {
  const products = await getProducts();
  const list = document.getElementById("productList");

  list.innerHTML = "";

  if (products.length === 0) {
    list.textContent = "No products added yet.";
    return;
  }

  products.forEach((product) => {
    const item = document.createElement("div");
    item.style.padding = "10px";
    item.style.borderBottom = "1px solid #ddd";

    const name = document.createElement("strong");
    name.textContent = product.name;

    const details = document.createElement("p");
    details.textContent =
      `${product.quantity} ${product.unit} | Cost: ₦${product.costPrice} | Selling: ₦${product.sellingPrice}`;

    item.append(name, details);
    list.appendChild(item);
  });
}

document.getElementById("productForm").addEventListener("submit", async function(event) {
  event.preventDefault();

  try {
    await 
async function addProduct(product) {
  if (!product.name || !product.name.trim()) {
    throw new Error("Shigar da sunan kaya.");
  }

  const quantity = Number(product.quantity) || 0;
  const unit = product.unit || "Bag";
  const muduPerBag = Number(product.muduPerBag) || 21;

  const record = {
    name: product.name.trim(),
    category: product.category || "Other",
    quantity: quantity,
    unit: unit,
    muduPerBag: muduPerBag,
    stockInMudu: unit === "Bag" ? quantity * muduPerBag : null,
    costPrice: Number(product.costPrice) || 0,
    sellingPrice: Number(product.sellingPrice) || 0,
    createdAt: new Date().toISOString()
  };

  return saveRecord("products", record);
}

    this.reset();
    await displayProducts();
    alert("Product saved successfully!");
  } catch (error) {
    alert("Error: " + error.message);
  }
});

displayProducts();
