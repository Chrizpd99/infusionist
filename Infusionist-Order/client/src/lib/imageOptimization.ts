/**
 * Image optimization utilities for lazy loading and blur-up effects
 */

export function getOptimizedImageUrl(url: string, width: number = 800): string {
  // Use Unsplash's URL parameters for image optimization
  if (url.includes("unsplash.com")) {
    return `${url}?q=75&w=${width}&auto=format&fit=crop`;
  }
  return url;
}

export function getBlurDataUrl(width: number = 20, height: number = 20): string {
  // SVG placeholder - lightweight and fast
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
      <rect fill="#1a1a1a" width="${width}" height="${height}"/>
      <filter id="blur">
        <feGaussianBlur stdDeviation="2"/>
      </filter>
      <rect fill="#2a2a2a" width="${width}" height="${height}" filter="url(#blur)" opacity="0.5"/>
    </svg>
  `.replace(/\n/g, "").replace(/\s+/g, " ");

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// For intersection observer based lazy loading
export function useImageLazyLoad(ref: React.RefObject<HTMLImageElement>) {
  if (!ref.current || !("IntersectionObserver" in window)) return;

  const imageElement = ref.current;
  const dataSrc = imageElement.dataset.src;

  if (!dataSrc) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || "";
          img.classList.add("loaded");
          observer.unobserve(img);
        }
      });
    },
    { rootMargin: "50px" }
  );

  observer.observe(imageElement);

  return observer;
}
