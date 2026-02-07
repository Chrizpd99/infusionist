// App configuration - centralized settings
// These can be moved to environment variables or fetched from backend in future

export const config = {
  // Domain
  domain: "infusionist.in",

  // Contact info
  whatsappNumber: "919876543210", // Format: country code + number (no +) - UPDATE THIS
  email: "hello@infusionist.in",

  // Delivery settings
  freeDeliveryThreshold: 500, // Free delivery for orders >= this amount
  deliveryCharge: 60, // Delivery charge for orders below threshold

  // Order settings
  estimatedDeliveryTime: "35-45 Mins",

  // Promo codes are validated server-side, but these are shown in UI
  // See server/routes.ts VALID_PROMOS for actual validation
};
