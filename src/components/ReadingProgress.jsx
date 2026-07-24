import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { useThemeMode } from '../theme/ThemeModeProvider.jsx';

/**
 * Thin fixed progress bar at the very top of the viewport reflecting how far
 * the reader has scrolled through the document.
 */
export default function ReadingProgress() {
  const { mode } = useThemeMode();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const compute = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop || 0;
      const height = el.scrollHeight - el.clientHeight;
      const pct = height > 0 ? (scrollTop / height) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
    };

    compute();
    window.addEventListener('scroll', compute, { passive: true });
    window.addEventListener('resize', compute);
    return () => {
      window.removeEventListener('scroll', compute);
      window.removeEventListener('resize', compute);
    };
  }, []);

  const color = mode === 'dark' ? '#2997ff' : '#0071e3';

  return (
    <Box
      className="reading-progress"
      sx={{
        background: `linear-gradient(90deg, ${color} ${progress}%, transparent ${progress}%)`,
        transition: 'background 0.05s linear',
      }}
    />
  );
}
