# Detailed Bug Analysis

## Evidence Scope

This analysis combines the captured original-source snapshot, TODO markers in `README.md` and source files, and inspection of the current fixed source. Git history was unavailable at analysis time, so exact historical recovery is limited as described in `README.md`.

## Bug 1: Incorrect Home Page Stylesheet Path

**File:** `index.html:6`

**Original code:**

```html
<link rel="stylesheet" href="css/main.css" />
```

**Cause:** The stylesheet directory is `styles/`, but the link references a nonexistent `css/` directory.

**Effect:** The main layout was not loaded from the home page.

**Correction:**

```html
<link rel="stylesheet" href="styles/main.css" />
```

**Result:** The browser resolves the existing stylesheet and applies menu, cart, and grid styles.

## Bug 2: Incorrect Checkout Resource and Navigation Paths

**File:** `pages/checkout.html:6-7, 13, 61`

**Cause:** The checkout file is inside `pages/`, so project-root assets require `../`.

**Effect:** Checkout styles, navigation, and JavaScript could fail to load.

**Correction:** CSS links, the back link, and `checkout.js` now use paths beginning with `../`.

**Result:** Relative resources resolve correctly from the nested page.

## Bug 3: Theme Background Path

**File:** `styles/theme.css:15`

**Original code:** `background-image: url("assets/bg-pattern.svg");`

**Cause:** CSS resolves `assets/bg-pattern.svg` relative to `styles/theme.css`, which incorrectly pointed to `styles/assets/`.

**Correction:** `background-image: url("../assets/bg-pattern.svg");`

**Result:** The existing background asset is resolved from the project root.

## Bug 4: Incorrect Menu Icon Paths

**File:** `scripts/menuData.js:1-32`

**Cause:** Four image values used nonexistent names or directories: `images/coffee-cup.svg`, misspelled `sandwhich.svg`, `assets/muffin.svg`, and `assets/icons/fresh-juice.svg`.

**Correction:** All four values now point to existing files under `assets/icons/`:

- `assets/icons/coffee.svg`
- `assets/icons/sandwich.svg`
- `assets/icons/muffin.svg`
- `assets/icons/juice.svg`

**Result:** Each card loads a valid SVG icon.

## Bug 5: Script Loading Dependency

**File:** `index.html:53-54`

**Cause:** `app.js` must run after `menuData.js` because it reads `MENU_ITEMS`.

**Effect:** Loading the application script first could cause reference errors or empty menu rendering.

**Correction:** `menuData.js` is loaded first and `app.js` second.

**Result:** Menu data is defined before application initialization.

## Bug 6: Only the First Add Button Received an Event

**File:** `scripts/app.js:30-34`

**Original code:** `document.querySelector(".add-btn")` selected one button only.

**Cause:** `querySelector()` returns the first matching element, not every add button.

**Effect:** Most menu cards did not respond to adding items.

**Correction:** `menuGrid.querySelectorAll(".add-btn")` adds an event listener to every rendered button.

**Result:** All menu card add buttons work.

## Bug 7: Repeated Items Created Duplicate Cart Rows

**File:** `scripts/app.js:36-53`

**Original code:** `cart.push()` always appended a new item.

**Cause:** The implementation did not search for an existing item ID.

**Effect:** Re-adding an item duplicated cart rows rather than updating quantity.

**Correction:** The code searches for an existing item and increments `qty`; a new row is created only for a new item.

**Result:** The cart has one row per product with an accurate quantity.

## Bug 8: String or Unit Prices Were Used in Arithmetic

**File:** `scripts/app.js:44-48, 95-98`; `scripts/checkout.js:11, 17, 39`

**Cause:** Menu prices are represented as strings and original subtotal code added `item.price` without quantity or numeric conversion.

**Effect:** Arithmetic could concatenate values or omit quantity, and checkout totals could be incorrect.

**Correction:** `Number(item.price)` and `Number(item.price) * item.qty` are used. Subtotals and totals use `reduce()` and `toFixed(2)`.

**Result:** Totals are calculated numerically and displayed consistently in rupees with two decimals.

## Bug 9: Cart Badge Used Product-Line Count

**File:** `scripts/app.js:96-98`

**Original code:** `cartCountEl.textContent = cart.length;`

**Cause:** Array length counts distinct products, not units.

**Effect:** A cart containing two units of one product and one unit of another would show the wrong quantity.

**Correction:** Quantity is aggregated using `cart.reduce((sum, item) => sum + item.qty, 0)`.

**Result:** The badge displays total item units.

## Bug 10: Cart Quantity Controls Did Not Exist

**File:** `scripts/app.js:63-93`

**Cause:** The original cart rendering showed text quantities but did not provide interactive controls.

**Effect:** Users could not decrease, increase, or remove items individually.

**Correction:** Working `+` and `-` buttons call `changeQuantity()`. A quantity of zero removes the item.

**Result:** Cart quantity updates immediately and persists to `localStorage`.

## Bug 11: Category and Search Filtering Were Missing

**File:** `scripts/app.js:100-123`

**Cause:** TODO logic was not implemented.

**Effect:** Category buttons and search input could not change the menu display.

**Correction:** `applyMenuFilters()` combines `activeCategory` and a lower-cased search term. Filter-button state is updated with `active` CSS class changes.

**Result:** Filtering is category-aware and updates in real time.

## Bug 12: Empty Checkout Was Not Blocked

**File:** `scripts/app.js:125-132`

**Cause:** Checkout navigation was unconditional.

**Effect:** Users could open a meaningless empty checkout page.

**Correction:** The handler checks `cart.length === 0`, writes a helpful message, and returns before navigation.

**Result:** Empty checkout is blocked with clear feedback.

## Bug 13: Cart Storage Keys Did Not Match

**File:** `scripts/app.js:10,61,129`; `scripts/checkout.js:16`

**Original checkout key:** `cartItems`.

**Original menu key:** `campus_cart`.

**Cause:** The two pages used different local-storage keys.

**Effect:** Checkout could not find cart data saved from the menu.

**Correction:** Both pages now use `campus_cart` consistently.

**Result:** Items, quantities, and prices persist across navigation.

## Bug 14: Grand Total Element ID Did Not Match

**File:** `pages/checkout.html:44`; `scripts/checkout.js:5`

**Cause:** The JavaScript selected `total-amount`, while checkout markup used `grand-total`.

**Effect:** The grand total calculation ran but was not written to the rendered element.

**Correction:** The markup now uses `id="total-amount"`.

**Result:** The grand total is displayed beside `Grand Total`.

## Bug 15: Student Promotion Logic Was Missing

**File:** `scripts/checkout.js:50-68`

**Cause:** The original handler was a TODO and always printed "Promo logic not implemented yet."

**Effect:** Discounts were never calculated or applied.

**Correction:** The code trims and uppercases input, rejects invalid codes, requires a subtotal of ₹150 or more, and applies 15% to eligible subtotals.

**Result:** Discount is recalculated and reset correctly, with clear success or error messages.

## Bug 16: Order Confirmation Validation Was Missing

**File:** `scripts/checkout.js:70-94`

**Cause:** The original submit handler used an incorrect `preventEvent()` call and only showed a TODO message.

**Effect:** Browser submission behavior was inconsistent, and no order conditions were enforced.

**Correction:** `preventDefault()` is used, cart/name/roll validation is performed, an order ID is generated, and valid confirmation clears saved cart data.

**Result:** Only complete, non-empty orders can be confirmed, and the UI returns to an empty state after success.
