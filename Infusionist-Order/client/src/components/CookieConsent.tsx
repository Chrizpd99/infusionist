import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const CONSENT_KEY = "infusionist_cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const existing = localStorage.getItem(CONSENT_KEY);
      if (!existing) setVisible(true);
    } catch (e) {
      setVisible(true);
    }
  }, []);

  const acceptAll = async () => {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({ marketing: true, analytics: true, timestamp: Date.now() }));
      // notify server (non-blocking)
      fetch('/api/consent', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ marketing: true, analytics: true }) })
        .catch((err) => console.warn('Failed to send consent to server:', err));
    } catch (e) {
      console.warn('Failed to save consent:', e);
    }
    setVisible(false);
  };

  const acceptEssential = async () => {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({ marketing: false, analytics: false, timestamp: Date.now() }));
      fetch('/api/consent', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ marketing: false, analytics: false }) })
        .catch((err) => console.warn('Failed to send consent to server:', err));
    } catch (e) {
      console.warn('Failed to save consent:', e);
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed left-4 right-4 bottom-6 z-50">
      <div className="max-w-4xl mx-auto bg-zinc-900/95 border border-white/10 p-4 rounded-lg shadow-2xl text-white/90 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1">
          <p className="font-bold">We use cookies</p>
          <p className="text-sm text-white/60">We use essential cookies to run the site. With your permission we also use analytics and marketing cookies to improve your experience and send offers.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={acceptEssential} variant="outline">Only essential</Button>
          <Button onClick={acceptAll} className="bg-amber-500 hover:bg-amber-400 text-black">Accept all</Button>
          <a href="/privacy" className="text-sm text-white/50 underline ml-2">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}
