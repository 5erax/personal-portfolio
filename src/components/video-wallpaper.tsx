import * as React from 'react';
import { wallpaper } from '../portfolio.json';

export function VideoWallpaper() {
  const [enabled, setEnabled] = React.useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  React.useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const changed = () => setEnabled(!preference.matches);
    preference.addEventListener('change', changed);
    return () => preference.removeEventListener('change', changed);
  }, []);

  return (
    <div className="vp-wallpaper" aria-hidden="true">
      <img src="/media/autumn-poster.jpg" alt="" />
      {enabled && <video src={wallpaper.src} poster="/media/autumn-poster.jpg" autoPlay loop muted playsInline preload="metadata"
        onError={() => setEnabled(false)} />}
    </div>
  );
}
