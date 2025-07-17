export function injectAdSense() {
  if (typeof window === 'undefined') return;

  const existingScript = document.querySelector('script[src*="adsbygoogle.js"]');
  if (existingScript) return; // Evita duplicar el script

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6493534174293024';
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
}
