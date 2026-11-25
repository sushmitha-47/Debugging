const checkoutItemsEl = document.getElementById("checkout-items");
const subtotalEl = document.getElementById("subtotal");
const taxEl = document.getElementById("tax");
const discountEl = document.getElementById("discount");
const grandTotalEl = document.getElementById("total-amount");

const promoInput = document.getElementById("promo-input");
const applyPromoBtn = document.getElementById("apply-promo-btn");
const promoMsgEl = document.getElementById("promo-msg");

const orderForm = document.getElementById("order-form");
const studentNameInput = document.getElementById("student-name");
const rollNumberInput = document.getElementById("roll-number");
const orderMsgEl = document.getElementById("order-msg");

const cart = JSON.parse(localStorage.getItem("campus_cart")) || [];
let discountAmount = 0;

function calculateSubtotal() {
  return cart.reduce((sum, item) => sum + Number(item.price) * (item.qty || 1), 0);
}

function renderCheckout() {
  checkoutItemsEl.innerHTML = "";

  if (cart.length === 0) {
    checkoutItemsEl.innerHTML = '<li class="empty-state">No items found in your order.</li>';
  } else {
    cart.forEach((item) => {
      const li = document.createElement("li");
      li.className = "cart-row";
      li.innerHTML = `
        <span>${item.name} × ${item.qty || 1}</span>
        <span>₹${(Number(item.price) * (item.qty || 1)).toFixed(2)}</span>
      `;
      checkoutItemsEl.appendChild(li);
    });
  }

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.05;
  const grandTotal = Math.max(0, subtotal + tax - discountAmount);

  subtotalEl.textContent = subtotal.toFixed(2);
  taxEl.textContent = tax.toFixed(2);
  discountEl.textContent = discountAmount.toFixed(2);
  grandTotalEl.textContent = grandTotal.toFixed(2);
}

applyPromoBtn.addEventListener("click", () => {
  const code = promoInput.value.trim().toUpperCase();
  const subtotal = calculateSubtotal();
  discountAmount = 0;

  if (code !== "STUDENT15") {
    promoMsgEl.textContent = "Invalid promo code.";
  } else if (subtotal < 150) {
    promoMsgEl.textContent = "STUDENT15 requires a subtotal of at least ₹150.";
  } else {
    discountAmount = subtotal * 0.15;
    promoMsgEl.textContent = "STUDENT15 applied: 15% discount.";
    promoMsgEl.className = "msg-success";
  }

  if (code !== "STUDENT15" || subtotal < 150) {
    promoMsgEl.className = "msg-error";
  }
  renderCheckout();
});

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = studentNameInput.value.trim();
  const rollNumber = rollNumberInput.value.trim();

  if (cart.length === 0) {
    orderMsgEl.textContent = "Cannot confirm an empty cart. Add items from the menu.";
    orderMsgEl.className = "msg-error";
    return;
  }
  if (!name || !rollNumber) {
    orderMsgEl.textContent = "Please enter both Full Name and Roll Number.";
    orderMsgEl.className = "msg-error";
    return;
  }

  const orderId = `CC-${Date.now().toString().slice(-6)}`;
  orderMsgEl.textContent = `Order confirmed! Your Order ID is ${orderId}.`;
  orderMsgEl.className = "msg-success";
  cart.splice(0, cart.length);
  localStorage.setItem("campus_cart", JSON.stringify(cart));
  discountAmount = 0;
  renderCheckout();
});

renderCheckout();
