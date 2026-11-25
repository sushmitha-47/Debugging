const menuGrid = document.getElementById("menu-grid");
const cartList = document.getElementById("cart-list");
const cartSubtotalEl = document.getElementById("cart-subtotal");
const cartCountEl = document.getElementById("cart-count");
const cartMsgEl = document.getElementById("cart-msg");
const checkoutBtn = document.getElementById("checkout-btn");
const searchInput = document.getElementById("search-input");
const filterButtons = document.querySelectorAll(".filter-btn");

let cart = JSON.parse(localStorage.getItem("campus_cart")) || [];
let activeCategory = "all";

function renderMenu(items) {
  menuGrid.innerHTML = "";

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div class="card-header">
        <span class="category-tag">${item.category}</span>
        <span class="price">₹${item.price}</span>
      </div>
      <h3>${item.name}</h3>
      <p style="font-size: 0.85rem; color: #6b7280;">${item.description}</p>
      <button class="btn btn-primary add-btn" data-id="${item.id}">Add to Cart</button>
    `;
    menuGrid.appendChild(card);
  });

  menuGrid.querySelectorAll(".add-btn").forEach((button) => {
    button.addEventListener("click", () => {
      addToCart(Number(button.dataset.id));
    });
  });
}

function addToCart(itemId) {
  const found = MENU_ITEMS.find((item) => item.id === itemId);
  if (!found) return;

  const existing = cart.find((item) => item.id === itemId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: found.id,
      name: found.name,
      price: Number(found.price),
      qty: 1
    });
  }

  cartMsgEl.textContent = "";
  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem("campus_cart", JSON.stringify(cart));
}

function changeQuantity(itemId, delta) {
  const item = cart.find((entry) => entry.id === itemId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter((entry) => entry.id !== itemId);
  }

  saveCart();
  renderCart();
}

function renderCart() {
  cartList.innerHTML = "";

  if (cart.length === 0) {
    cartList.innerHTML = '<li class="empty-state">Your cart is empty.</li>';
  } else {
    cart.forEach((item) => {
      const li = document.createElement("li");
      li.className = "cart-row";
      li.innerHTML = `
        <span>${item.name}</span>
        <span class="qty-controls">
          <button class="qty-btn" data-id="${item.id}" data-action="decrease" aria-label="Decrease ${item.name} quantity">-</button>
          <span>${item.qty}</span>
          <button class="qty-btn" data-id="${item.id}" data-action="increase" aria-label="Increase ${item.name} quantity">+</button>
          <strong>₹${(Number(item.price) * item.qty).toFixed(2)}</strong>
        </span>
      `;
      cartList.appendChild(li);
    });

    cartList.querySelectorAll(".qty-btn").forEach((button) => {
      button.addEventListener("click", () => {
        changeQuantity(Number(button.dataset.id), button.dataset.action === "increase" ? 1 : -1);
      });
    });
  }

  const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * item.qty, 0);
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  cartSubtotalEl.textContent = subtotal.toFixed(2);
  cartCountEl.textContent = count;
}

function applyMenuFilters() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = MENU_ITEMS.filter((item) => {
    const categoryMatches = activeCategory === "all" || item.category === activeCategory;
    const nameMatches = item.name.toLowerCase().includes(query);
    return categoryMatches && nameMatches;
  });
  renderMenu(filtered);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    applyMenuFilters();
  });
});

searchInput.addEventListener("input", applyMenuFilters);

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    cartMsgEl.textContent = "Your cart is empty. Add an item before checkout.";
    return;
  }
  cartMsgEl.textContent = "";
  window.location.href = "pages/checkout.html";
});

renderMenu(MENU_ITEMS);
renderCart();
