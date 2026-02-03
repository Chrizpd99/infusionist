import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background text-white">
      <Navigation />
      <div className="container mx-auto px-6 py-24 max-w-4xl">
        <h1 className="font-display text-4xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-white/70 mb-4">
          Last updated: February 2026
        </p>

        <section className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Data we collect</h2>
          <p className="text-white/70">We collect the minimum personal information required to process your orders: name, phone number, and delivery address. We do not store payment card details; payments are handled by our POS partner.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Cookies and tracking</h2>
          <p className="text-white/70">We use cookies for essential site functionality. With your consent we also use analytics and marketing cookies. You can change your cookie preferences anytime via the cookie banner.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Data retention</h2>
          <p className="text-white/70">We retain order data for 2 years for support and audit purposes. If you want your data deleted sooner, please contact us at infusionist.messyapron@gmail.com.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-bold mb-2">POS & third parties</h2>
          <p className="text-white/70">When we integrate with a POS partner, minimal order metadata (order id, items, totals) will be shared to fulfil the order. API keys and secrets are stored server-side only.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Contact</h2>
          <p className="text-white/70">Questions about privacy? Email infusionist.messyapron@gmail.com</p>
        </section>
      </div>
      <Footer />
    </div>
  );
}
