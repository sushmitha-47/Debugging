# Before-and-After Code Comparison

The tables below compare verified source from before and after the bug-fix session. "Recovered snapshot" means the snippet was captured during the fixing session when the original code was still available. Git history could not be independently queried.

## 1. Home Page CSS Link

| Previous Code | Fixed Code | Description of Change | Reason for Fix |
|---|---|---|---|
| `<link rel="stylesheet" href="css/main.css" />` at `index.html:6` | `<link rel="stylesheet" href="styles/main.css" />` at `index.html:6` | Corrected the stylesheet directory | `css/main.css` did not exist; the actual directory is `styles/` |

## 2. Script Loading Order

| Previous Code | Fixed Code | Description of Change | Reason for Fix |
|---|---|---|---|
| `app.js` loaded before `menuData.js`; later form used `js/menuData.js` | `menuData.js` loaded first, followed by `app.js` | Reordered menu data and application scripts | `app.js` depends on `MENU_ITEMS`; loading `app.js` first could evaluate references before the menu data was available |

Verified fixed code: `index.html:53-54`:

```html
<script src="scripts/menuData.js"></script>
<script src="scripts/app.js"></script>
```

## 3. Checkout Resource Paths

| Previous Code | Fixed Code | Description of Change | Reason for Fix |
|---|---|---|---|
| `styles/main.css` and `styles/theme.css` | `../styles/main.css` and `../styles/theme.css` | Added parent-directory traversal | Checkout is inside `pages/`, so `styles/` must be resolved from the project root |
| `href="index.html"` | `href="../index.html"` | Corrected back-navigation | `index.html` is one directory above `pages/` |
| `scripts/checkout.js` | `../scripts/checkout.js` | Corrected script path | The script is at the project root under `scripts/` |

## 4. Grand Total Element ID

| Previous Code | Fixed Code | Description of Change | Reason for Fix |
|---|---|---|---|
| `<span id="grand-total">0</span>` in checkout markup | `<span id="total-amount">0</span>` in `pages/checkout.html:44` | Matched markup and JavaScript ID | `checkout.js` selects `total-amount`, so `grand-total` would not receive the calculated value |

## 5. Menu Icons

| Previous Code | Fixed Code | Description of Change | Reason for Fix |
|---|---|---|---|
| `images/coffee-cup.svg` | `assets/icons/coffee.svg` | Replaced nonexistent coffee path | Used the icon present in `assets/icons/` |
| `assets/icons/sandwhich.svg` | `assets/icons/sandwich.svg` | Corrected spelling | The available file is `sandwich.svg` |
| `assets/muffin.svg` | `assets/icons/muffin.svg` | Corrected muffin directory | The icon is inside `assets/icons/` |
| `assets/icons/fresh-juice.svg` | `assets/icons/juice.svg` | Replaced nonexistent juice path | Used the actual `juice.svg` file |

## 6. Add-to-Cart Button Wiring

Previous code from the recovered snapshot:

```javascript
const addButton = document.querySelector(".add-btn");
if (addButton) {
  addButton.addEventListener("click", () => {
    const id = Number(addButton.dataset.id);
    addToCart(id);
  });
}
```

Fixed code in `scripts/app.js:30-34`:

```javascript
menuGrid.querySelectorAll(".add-btn").forEach((button) => {
  button.addEventListener("click", () => {
    addToCart(Number(button.dataset.id));
  });
});
```

The fixed version attaches a handler to every rendered card button rather than only the first matching button.

## 7. Duplicate Cart Items and Numeric Prices

Previous code from the recovered snapshot:

```javascript
cart.push({
  id: found.id,
  name: found.name,
  price: found.price,
  qty: 1
});
```

Fixed code in `scripts/app.js:36-53`:

```javascript
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
```

The correction increases an existing quantity and converts menu prices to numbers before arithmetic.

## 8. Cart Subtotal and Badge

Previous code from the recovered snapshot:

```javascript
let subtotal = 0;
cart.forEach((item) => {
  subtotal = subtotal + item.price;
});
cartSubtotalEl.textContent = subtotal;
cartCountEl.textContent = cart.length;
```

Fixed code in `scripts/app.js:95-98`:

```javascript
const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * item.qty, 0);
const count = cart.reduce((sum, item) => sum + item.qty, 0);
cartSubtotalEl.textContent = subtotal.toFixed(2);
cartCountEl.textContent = count;
```

The old badge showed line counts rather than total quantities and did not multiply price by quantity. The fixed code calculates the aggregate quantity and the extended line total.

## 9. Quantity Buttons

Previous code had only a name and line total, with no working quantity controls.

Fixed code in `scripts/app.js:63-93` creates `+` and `-` buttons, binds each button to `changeQuantity()`, and removes items whose quantity reaches zero.

## 10. Filtering and Search

Previous code contained only a TODO comment for category and search logic.

Fixed code in `scripts/app.js:100-123` combines active category and a case-insensitive name search. Filter buttons receive active-state styling.

## 11. Empty Checkout Check

Previous code navigated unconditionally:

```javascript
checkoutBtn.addEventListener("click", () => {
  window.location.href = "pages/checkout.html";
});
```

Fixed code in `scripts/app.js:125-132` checks `cart.length` and displays a message before navigation.

## 12. Shared Cart Storage

| Previous Code | Fixed Code | Description of Change | Reason for Fix |
|---|---|---|---|
| Menu uses `campus_cart`; checkout uses `cartItems` | Both pages use `campus_cart` | Standardized local-storage key | Checkout could not read items saved by the menu page |

## 13. Promo Logic

Previous code:

```javascript
applyPromoBtn.addEventListener("click", () => {
  // TODO: Implement STUDENT15 promo logic
  promoMsgEl.textContent = "Promo logic not implemented yet.";
});
```

Fixed code in `scripts/checkout.js:50-68` normalizes the entered code, resets discount to zero, validates invalid codes and the ₹150 minimum, applies 15%, and updates the totals through `renderCheckout()`.

## 14. Order Confirmation

Previous code:

```javascript
orderForm.addEventListener("submit", (event) => {
  event.preventEvent();
  // TODO: Validate non-empty cart, student name, and roll number
  orderMsgEl.textContent = "Order confirmation logic not implemented yet.";
});
```

Fixed code in `scripts/checkout.js:70-94` prevents submission, trims both fields, rejects empty carts and missing details, generates `CC-` plus a six-digit timestamp suffix, clears the cart, and rerenders the checkout summary.
