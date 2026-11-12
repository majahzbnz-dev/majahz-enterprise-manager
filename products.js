
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
    await addProduct({
      name: document.getElementById("productName").value,
      category: document.getElementById("productCategory").value,
      quantity: document.getElementById("productQuantity").value,
      unit: document.getElementById("productUnit").value,
      costPrice: document.getElementById("productCost").value,
      sellingPrice: document.getElementById("productSelling").value
    });

    this.reset();
    await displayProducts();
    alert("Product saved successfully!");
  } catch (error) {
    alert("Error: " + error.message);
  }
});

displayProducts();
