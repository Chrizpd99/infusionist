import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background text-white">
      <Navigation />
      <div className="container mx-auto px-6 py-24 max-w-4xl">
        <h1 className="font-display text-4xl font-bold mb-6">Terms of Service</h1>
        <p className="text-white/70 mb-4">Last updated: February 2026</p>

        <section className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Ordering</h2>
          <p className="text-white/70">By placing an order you agree to our terms. Orders are subject to availability and confirmation by the kitchen. Prices shown are accurate at the time of ordering and stored on the order as `priceAtTime`.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Cancellations</h2>
          <p className="text-white/70">Orders can be cancelled within 2 minutes of placement unless already accepted by the kitchen. Contact support for assistance.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Liability</h2>
          <p className="text-white/70">We are not liable for delays caused by third-party delivery partners. Our liability for any order is limited to the order value.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Contact</h2>
          <p className="text-white/70">For questions: infusionist.messyapron@gmail.com</p>
        </section>
      </div>
      <Footer />
    </div>
  );
}
