# Testing and Validation Report

## 1. Testing Scope

Testing covered resource loading, menu filtering, cart behavior, checkout persistence, promotion calculations, and order validation.

## 2. Tests Available in the Workspace

No package manifest, test framework configuration, or source test files were found. Therefore, no unit or automated test command existed for this project.

## 3. Executed Validation

| Method | Test / Observation | Result |
|---|---|---|
| VS Code diagnostics | Checked `index.html`, `pages/checkout.html`, `scripts/app.js`, and `scripts/checkout.js` | No errors reported |
| Browser page load | Loaded `index.html` with `file:///.../index.html` | Page rendered with CampusCafe heading and all four menu cards |
| Browser cart test | Clicked Cold Brew once | Badge became `1`; cart subtotal became `₹120.00` |
| Browser duplicate test | Repeatedly clicked Cold Brew | Quantity became `2`; badge became `2`; no duplicate row; subtotal became `₹240.00` |
| Browser mixed-cart test | Added Grilled Veg Sandwich | Badge became `3`; cart subtotal became `₹325.00` |
| Browser navigation | Clicked Proceed to Checkout | Checkout loaded and displayed both saved items |
| Checkout total test | Checked initial summary | Subtotal `₹325.00`, tax `₹16.25`, grand total `₹341.25` |
| Promo test | Applied `STUDENT15` | Discount `₹48.75`; grand total `₹292.50` |
| Missing-details test | Submitted blank order details | Message requested Full Name and Roll Number |
| Valid-confirmation test | Entered name and roll number and submitted | Success message included generated Order ID; cart cleared |
| Return-navigation test | Returned to menu | Badge returned to `0` and empty cart state appeared |
| Combined filter test | Selected Drinks, then searched `orange` | Only Fresh Orange Juice remained |
| Empty checkout test | Returned to menu with an empty cart and clicked checkout | Inline error appeared and navigation remained on menu |

## 4. JavaScript Syntax Check Attempt

A `node --check` syntax check was attempted for `app.js`, `checkout.js`, and `menuData.js`, but the VS Code terminal could not launch because of the Winpty/ConPTY backend error. This terminal limitation also prevented confirming the Git repository state and running package-based tests.

## 5. Diagnostic Result

VS Code diagnostics reported no HTML or JavaScript errors in the four files checked. Browser execution confirmed the key cart and checkout flows. The successful tests above are reported as executed browser checks, not as an automated test-suite pass.

## 6. Residual Testing Gaps

- No formal automated tests were available.
- The terminal backend prevented command-line syntax/test automation.
- Git state and commit history could not be independently verified.
- Invalid promo codes and sub-₹150 promo behavior were implemented but were not separately exercised in the final browser pass. They should be included in future automated tests.

## 7. Recommended Future Tests

1. Add an item twice and verify that quantity equals 2 and line count equals 1.
2. Decrease an item to zero and verify removal.
3. Apply an invalid promotion and verify discount reset to zero.
4. Apply `STUDENT15` below ₹150 and verify that no discount is granted.
5. Apply `STUDENT15` at or above ₹150 and verify a 15% discount.
6. Submit missing student details and verify validation.
7. Confirm a valid order and verify local-storage clearing.
8. Verify all menu, stylesheet, script, icon, and navigation paths on a local server and via `file://` where supported.
