const categoryList = document.getElementById("categories");
const treeContainer = document.getElementById("tree-container");
const loader = document.getElementById("loader");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const modal = document.getElementById("tree-modal");

let cart = [];
let activeCategoryId = "all";

// -----------------------------
// Loader
// -----------------------------
function showLoader() {
  loader.classList.remove("hidden");
}
function hideLoader() {
  loader.classList.add("hidden");
}

// -----------------------------
// Load Categories
// -----------------------------
async function loadCategories() {
  showLoader();
  try {
    const res = await fetch("https://openapi.programming-hero.com/api/categories");
    const data = await res.json();

    const allCategories = [{ id: "all", category: "All Trees" }, ...data.categories];
    categoryList.innerHTML = "";

    allCategories.forEach((cat) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <button class="btn btn-sm w-full text-left ${
          activeCategoryId === cat.id ? "bg-[#15803D] text-white rounded-md px-4 py-2" : "bg-[#f0fdf4] text-[#000000]"
        } hover:bg-[#15803D] text-white rounded-md px-4 py-2" data-id="${cat.id}">
          ${cat.category}
        </button>
      `;
      categoryList.appendChild(li);
    });
  } catch (err) {
    console.error("Category loading error:", err);
  } finally {
    hideLoader();
  }
}

// -----------------------------
// Load Trees by Category
// -----------------------------
async function loadTrees(categoryId = "all") {
  showLoader();
  treeContainer.innerHTML = "";

  try {
    const url =
      categoryId === "all"
        ? "https://openapi.programming-hero.com/api/plants"
        : `https://openapi.programming-hero.com/api/category/${categoryId}`;

    const res = await fetch(url);
    const data = await res.json();
    const trees = data.plants || data.data || [];

    if (trees.length === 0) {
      treeContainer.innerHTML = `<p class="col-span-3 text-center text-gray-500">No trees found.</p>`;
      hideLoader();
      return;
    }

    trees.forEach((tree) => {
      const card = document.createElement("div");
      card.className = "card bg-base-100 shadow-sm border border-gray-100";
      card.innerHTML = `
        <figure class="bg-gray-100"><img src="${
          tree.image || ""
        }" alt="${tree.name}" class="h-40 object-cover w-full" /></figure>
        <div class="card-body">
          <h2 class="card-title cursor-pointer text-green-700" data-tree-id="${tree.id}">
            ${tree.name}
          </h2>
          <p class="text-sm text-gray-600">${tree.description.slice(0, 80)}...</p>
          <div class="flex justify-between items-center">
            <span class="badge badge-outline">${tree.category}</span>
            <span class="font-semibold text-green-600">৳${tree.price}</span>
          </div>
          <button class="btn btn-sm bg-green-600 text-white mt-2 add-to-cart hover:bg-green-700"
            data-id="${tree.id}" data-name="${tree.name}" data-price="${tree.price}">
            Add to Cart
          </button>
        </div>
      `;
      treeContainer.appendChild(card);
    });
  } catch (err) {
    console.error("Tree loading error:", err);
  } finally {
    hideLoader();
  }
}

// -----------------------------
// Open Modal with Tree Details
// -----------------------------
async function openModal(treeId) {
  showLoader();
  try {
    const res = await fetch(`https://openapi.programming-hero.com/api/plant/${treeId}`);
    const { plant } = await res.json();

    document.getElementById("modal-title").innerText = plant.name;
    document.getElementById("modal-image").src = plant.image;
    document.getElementById("modal-description").innerText = plant.description;
    document.getElementById("modal-category").innerText = `Category: ${plant.category}`;
    document.getElementById("modal-price").innerText = `Price: ৳${plant.price}`;
    modal.showModal();
  } catch (err) {
    console.error("Modal loading error:", err);
  } finally {
    hideLoader();
  }
}

// -----------------------------
// Cart Functions
// -----------------------------
function addToCart(item) {
  const existing = cart.find((c) => c.id === item.id);
  if (existing) existing.quantity++;
  else cart.push({ ...item, quantity: 1 });
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter((c) => c.id !== id);
  renderCart();
}

function renderCart() {
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    total += item.price * item.quantity;
    const div = document.createElement("div");
    div.className =
      "flex justify-between items-center bg-green-50 px-2 py-1 rounded text-sm";
    div.innerHTML = `
      <span>${item.name}<br><small>৳${item.price} × ${item.quantity}</small></span>
      <button class="text-red-500" onclick="removeFromCart(${item.id})">✖</button>
    `;
    cartItems.appendChild(div);
  });

  cartTotal.textContent = `৳${total}`;
}

// -----------------------------
// Event Listeners
// -----------------------------
categoryList.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-id]");
  if (!btn) return;
  activeCategoryId = btn.dataset.id;
  loadCategories();
  loadTrees(activeCategoryId);
});

treeContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    const { id, name, price } = e.target.dataset;
    addToCart({ id: Number(id), name, price: Number(price) });
  } else if (e.target.dataset.treeId) {
    openModal(e.target.dataset.treeId);
  }
});

// -----------------------------
// Initialize
// -----------------------------
loadCategories();
loadTrees();
