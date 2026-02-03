# Infusionist App - Testing Guide

## App URL
**https://studious-funicular-4rjr7qvjrpwc5gqx-5000.app.github.dev**

> Note: If this URL doesn't work, the tester needs to request access or the owner needs to make the port public.

---

## Test Scenarios

### 1. Customer Flow (No Login Required)

#### Browse Menu
- [ ] Open the app → Home page loads with hero section
- [ ] Click "View Our Menu" → Menu page shows all products
- [ ] Verify 5 categories display: Signature Combos, Infused Chickens, Sides & Breads, Global Sauces, Beverages
- [ ] Click category pills → Page scrolls to that section
- [ ] Scroll down → Active category pill updates automatically

#### Add to Cart
- [ ] Click "Add to Cart" on any product → Shows "Added to Cart" confirmation
- [ ] For products with sizes (Rumali Roti, Fresh Lime Soda) → Select size first, then add
- [ ] Cart icon in navbar shows item count badge
- [ ] Click cart icon → Cart drawer opens with items

#### Checkout Flow
- [ ] Go to Cart page (`/cart`)
- [ ] Adjust quantities using +/- buttons
- [ ] Remove items using trash icon
- [ ] Fill delivery details:
  - Name: Test User
  - Phone: 9876543210
  - Address: Test Address, Bangalore
- [ ] Try promo code: `SAVE50` (should give ₹50 off)
- [ ] Click "Review Order" → Order summary modal appears
- [ ] Click "Confirm Order" → Redirects to success page with order ID

#### Order Success
- [ ] Verify order ID is displayed
- [ ] "Track on WhatsApp" button works
- [ ] Progress tracker shows: Confirmed → Preparing → On the Way

---

### 2. Admin Flow (Login Required)

#### Login
- [ ] Go to `/login`
- [ ] Use credentials:
  - **Email:** `infusionist.messyapron@gmail.com`
  - **Password:** `Cheeka@123`
- [ ] Should redirect to Admin Dashboard

#### Dashboard
- [ ] Verify stats cards show: Total Revenue, Total Orders, Pending Orders, Avg Order Value
- [ ] Order Status Breakdown chart displays
- [ ] Revenue by Month chart displays
- [ ] Recent Orders list shows expandable order details

#### Menu Management (`/admin/menu`)
- [ ] View all products
- [ ] Edit a product → Changes save correctly
- [ ] Toggle product availability

#### Orders Management (`/admin/orders`)
- [ ] View all orders
- [ ] Filter by status (pending, confirmed, delivered, etc.)
- [ ] Update order status → Status changes
- [ ] Export orders as CSV/JSON

#### Customer Analytics (`/admin/customers`)
- [ ] View customer list with insights
- [ ] Check active vs inactive customers
- [ ] Export customer data

#### Logout
- [ ] Click Logout button
- [ ] Should redirect to home page
- [ ] Admin pages should be inaccessible after logout

---

### 3. Mobile Responsiveness
- [ ] Test on mobile device or browser dev tools (responsive mode)
- [ ] Navigation collapses to hamburger menu
- [ ] Menu cards stack vertically
- [ ] Cart drawer works on mobile
- [ ] Checkout form is usable on mobile

---

### 4. Performance Checks
- [ ] Page transitions are smooth (no lag)
- [ ] Images load properly
- [ ] Animations don't stutter
- [ ] Cart operations are instant

---

## Bug Report Template

If you find any issues, please report using this format:

```
**Page:** [e.g., Menu, Cart, Admin Dashboard]
**Browser:** [e.g., Chrome 120, Safari 17]
**Device:** [e.g., Desktop, iPhone 14, Android]

**Steps to Reproduce:**
1.
2.
3.

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happened]

**Screenshot/Video:**
[Attach if possible]
```

---

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | infusionist.messyapron@gmail.com | Cheeka@123 |

## Promo Codes for Testing

| Code | Discount |
|------|----------|
| SAVE50 | ₹50 off |
| SAVE100 | ₹100 off |
| WELCOME | ₹75 off |
| FIRST20 | 20% off |

---

## Contact

Report issues to the development team or create a GitHub issue.

**Testing Period:** [Add your dates]
**Feedback Deadline:** [Add deadline]
