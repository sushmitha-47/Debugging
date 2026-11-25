# CampusCafe — Complete Bug-Fix Report

**Prepared as an academic and technical project report**

## 1. Abstract

This report documents the identification and correction of defects in a two-page CampusCafe web application. The system allows a student to browse menu items, combine category and name filters, add items to a cart, adjust quantities, apply an eligible student promotion, enter student information, and confirm an order.

GitHub Copilot was used as an AI-assisted coding tool to inspect the workspace, modify the implementation, and validate the browser workflow. The original project used HTML, CSS, and JavaScript; no server-side framework or package build process was identified.

## 2. Original Problem Statement

According to the workspace README, the original application suffered from broken layout, image, script, navigation, and calculation behavior. Several requested features were incomplete, including filtering, cart quantity controls, checkout validation, promotion logic, and order confirmation.

## 3. Project Structure

| File | Responsibility |
|---|---|
| `index.html` | Menu UI and cart panel |
| `pages/checkout.html` | Checkout summary and student form |
| `scripts/app.js` | Menu, cart, filters, navigation |
| `scripts/checkout.js` | Checkout totals, promotion, confirmation |
| `scripts/menuData.js` | Menu records and image paths |
| `styles/main.css` | Layout and component presentation |
| `styles/theme.css` | Theme and background settings |
| `assets/icons/` | Four SVG menu images |

## 4. Identified Bug Categories

### 4.1 Resource and Path Defects

Incorrect relative paths affected the home stylesheet, checkout stylesheet, checkout script, back link, background asset, and menu images. The fixes use project-relative paths and the actual filenames present in `assets/icons/`.

### 4.2 JavaScript Initialization Defects

The menu data script was expected before `app.js`, but it was loaded in the wrong order or from an incorrect path. The corrected markup loads `menuData.js` before `app.js`.

### 4.3 Cart Logic Defects

The original code attached an add listener only to the first matching add button. It added duplicate cart rows instead of incrementing quantities and added string prices without multiplication by quantity. The cart badge used distinct line count instead of total units.

The corrected implementation:

- Converts each price to a number.
- Searches by item ID.
- Increments existing quantities.
- Creates a new cart row only for an unseen item.
- Computes total units and extended subtotal.
- Adds quantity controls that remove zero-quantity entries.

### 4.4 Filtering Defects

The original source had TODO placeholders for category filtering and search. The corrected implementation combines the active category with a real-time case-insensitive name search.

### 4.5 Checkout and Persistence Defects

The menu and checkout used different local-storage keys, `campus_cart` and `cartItems`, respectively. This prevented checkout from reading the menu's saved cart. Both pages now use `campus_cart`.

The checkout markup had a mismatched grand-total ID. JavaScript looked for `total-amount`, while markup used `grand-total`. The markup now uses `total-amount`.

### 4.6 Promotion Defects

The original promotion handler was unimplemented. The corrected logic:

- Normalizes code input.
- Resets discount before every attempt.
- Rejects invalid codes.
- Rejects subtotals below ₹150.
- Applies 15% only to eligible subtotals.
- Re-renders subtotal, GST, discount, and grand total.

### 4.7 Order Validation Defects

The original submit handler was incomplete and used an incorrect event-prevention method. The corrected handler rejects an empty cart, missing full name, or missing roll number. A valid order receives an ID in the form `CC-` followed by six timestamp digits, and the cart is cleared.

## 5. Before-and-After Summary

| Area | Previous State | Fixed State |
|---|---|---|
| Home stylesheet | Wrong `css/main.css` path | Existing `styles/main.css` path |
| Script loading | Menu data script after or wrong path | Menu data loads before application |
| Checkout paths | Relative paths failed from `pages/` | Paths include `../` |
| Icons | Missing or misspelled paths | Existing SVG files under `assets/icons/` |
| Add buttons | First button only | Every rendered add button |
| Duplicate products | New row appended | Existing quantity incremented |
| Subtotal | String or quantity-unaware arithmetic | Numeric price multiplied by quantity |
| Badge | Distinct cart row count | Sum of item quantities |
| Filters | TODO placeholder | Combined category and search filtering |
| Quantity controls | Not implemented | Plus/minus controls and zero removal |
| Empty checkout | Navigation allowed | Navigation blocked with message |
| Checkout storage | `cartItems` key | Shared `campus_cart` key |
| Grand total | ID mismatch | Matching `total-amount` ID |
| Promotion | TODO placeholder | Validated STUDENT15 behavior |
| Confirmation | TODO placeholder | Validation, generated ID, and cart clearing |

## 6. Testing and Validation

No formal test suite or package manifest was present. VS Code diagnostics found no reported errors in the four checked HTML and JavaScript files.

Browser validation confirmed:

- All four menu cards loaded.
- Repeated adds merged quantities.
- Mixed cart total reached ₹325.00.
- Checkout displayed the saved cart.
- GST was calculated as 5%.
- `STUDENT15` removed ₹48.75 from a ₹325.00 subtotal.
- Missing student details were rejected.
- Valid confirmation generated an order ID and cleared the cart.
- Drinks plus `orange` search returned only Fresh Orange Juice.
- Empty checkout navigation was blocked.

The JavaScript command-line syntax check and Git history lookup could not run because the terminal backend failed to start. These limitations are recorded and not represented as successful tests.

## 7. Reflection Question

Pasting a single file into a standard online chat window removes the surrounding project context. The assistant cannot directly inspect sibling files, verify that a directory or asset exists, trace script dependencies, read browser storage behavior across pages, or interact with the running application. A workspace-aware AI tool such as GitHub Copilot can search and read the connected workspace, understand the relationship among HTML, JavaScript, CSS, assets, and local storage, and validate changes through an integrated editor and browser workflow.

## 8. Conclusion

The CampusCafe project was corrected across resource loading, cart behavior, filtering, checkout persistence, promotion handling, and order validation. The implementation now preserves the cart between the menu and checkout pages and presents consistent numeric totals. The most important structural correction was standardizing on the `campus_cart` storage key and ensuring that script and element IDs match across files.

GitHub Copilot was used as an AI-assisted implementation and validation tool. The source code was not modified as part of the documentation process beyond the earlier bug-fix session. This report does not claim recovery of original Git history, because repository history was unavailable in the terminal environment.
