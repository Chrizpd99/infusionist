# Restaurant Menu Management Design Guidelines

## Design Approach
**Reference-Based**: Drawing from **Caviar** (premium feel), **Uber Eats** (menu browsing), and **Toast POS** (admin efficiency). Balancing warmth and appetite appeal with functional clarity.

## Core Design Elements

### Typography
- **Headings**: Playfair Display (serif, elegant for restaurant name/sections) - 900 weight for impact, 700 for subheadings
- **Body/UI**: Inter (clean, readable for menus/descriptions) - 400 regular, 600 semibold for emphasis
- **Pricing**: Inter 700 bold - makes prices clear and confident
- **Hierarchy**: Hero titles (text-5xl to text-7xl), Section headers (text-3xl), Menu items (text-xl), Descriptions (text-base), Metadata (text-sm)

### Layout System
**Spacing Primitives**: 2, 4, 6, 8, 12, 16, 20, 24 units
- Section padding: py-20 desktop, py-12 mobile
- Card padding: p-6 to p-8
- Component gaps: gap-6 for grids, gap-4 for lists
- Consistent 24-unit rhythm between major sections

### Component Library

**Customer-Facing Application:**

Navigation (Sticky)
- Restaurant logo/name left, Cart icon with item count right, "Sign In" link
- Secondary nav: Categories (Appetizers, Mains, Desserts, Drinks) horizontal scroll on mobile
- Subtle shadow on scroll

Hero Section
- Full-width, 75vh height, dramatic food photography background
- Center-aligned content: Restaurant name (Playfair Display, massive), Tagline, "View Menu" CTA with backdrop-blur-md background
- Overlay gradient (dark-to-transparent from bottom) for text readability

Menu Grid
- 3-column grid (lg:grid-cols-3 md:grid-cols-2 grid-cols-1)
- Menu Item Cards: Square aspect-ratio food image top, Title (text-xl semibold), Description (text-sm, line-clamp-2), Price (text-lg bold), "Add to Cart" button bottom
- Hover: Subtle lift effect (transform scale)

Cart Sidebar/Modal
- Slide-in panel from right, Item list with thumbnails, quantity controls (+/- buttons), Running subtotal, "Checkout" primary button

Checkout Flow
- Two-column layout (lg:): Left = Order summary sticky, Right = Multi-step form
- Steps: Account (login/register), Delivery details, Payment
- Progress indicator at top
- Form inputs: Large touch targets (h-12), clear labels above inputs, inline validation

User Registration/Login Modal
- Centered card (max-w-md), Tabs for "Sign In" / "Register", Social login options (Google, Apple), Clean form fields

**Admin Dashboard:**

Admin Navigation
- Left sidebar (w-64): Logo top, Menu sections (Dashboard, Menu Items, Orders, Settings), Logout bottom
- Collapsible on mobile to hamburger menu

Dashboard Overview
- Grid of stat cards (4 columns): Total Orders, Revenue, Active Items, Pending Orders
- Recent orders table below, Quick actions panel

Menu Management Interface
- Data table: Columns (Image thumbnail, Name, Category, Price, Status, Actions)
- Inline editing capability
- "Add New Item" prominent button top-right
- Filter/search bar above table

Add/Edit Menu Item Form
- Two-column form: Left = Image upload (large preview), Right = Details (Name, Description textarea, Category dropdown, Price input, Availability toggle)
- Image upload: Drag-drop zone with preview
- Rich text editor for description
- Save/Cancel buttons bottom-right

### Images

**Customer-Facing:**
1. **Hero Image**: Full-width hero, 75vh - Premium food photography showing restaurant's signature dish, professional styling, warm lighting, shallow depth of field. This is the main hero image.
2. **Menu Item Cards**: Square thumbnails (aspect-square) - Each dish photographed from 45° angle, plated beautifully, consistent lighting/backdrop across all items
3. **Category Headers**: Optional banner images for each menu section

**Admin Dashboard:**
- Menu item thumbnails in tables (small, 60x60px)
- Image upload previews (large format for editing)
- No decorative imagery - focus on functionality

### Key Interactions
- Smooth add-to-cart animations (item flies to cart icon)
- Quantity steppers with immediate feedback
- Cart total updates in real-time
- Admin: Drag-and-drop menu item reordering
- Toast notifications for actions (item added, order placed, changes saved)

### Responsive Behavior
- Desktop: Multi-column grids, sidebar navigation
- Tablet: 2-column grids, persistent top nav
- Mobile: Single column, bottom tab navigation for customer app, hamburger for admin

**Critical**: All buttons on image overlays (especially hero) use backdrop-blur-md with semi-transparent backgrounds for legibility.