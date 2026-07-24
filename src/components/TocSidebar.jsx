import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useThemeMode } from '../theme/ThemeModeProvider.jsx';

/**
 * @typedef {Object} TocItem
 * @property {string} id
 * @property {string} text
 * @property {number} depth
 */

/**
 * Floating, right-hand table-of-contents with scroll-spy highlighting.
 *
 * - Hidden below 960px (per design) so it never crowds narrow screens.
 * - Highlights the section currently in view by tracking heading offsets on
 *   scroll/resize.
 *
 * @param {{ items: TocItem[] }} props
 */
export default function TocSidebar({ items = [] }) {
  const { mode } = useThemeMode();
  const isWide = useMediaQuery('(min-width: 960px)');
  const [activeId, setActiveId] = useState(items[0] ? items[0].id : '');

  useEffect(() => {
    if (!items.length) return undefined;

    const computeActive = () => {
      const headings = items
        .map((it) => {
          const el = document.getElementById(it.id);
          if (!el) return null;
          return { id: it.id, top: el.getBoundingClientRect().top };
        })
        .filter(Boolean);

      if (!headings.length) return;
      const threshold = 120;
      let current = headings[0].id;
      for (const h of headings) {
        if (h.top - threshold <= 0) current = h.id;
        else break;
      }
      setActiveId(current);
    };

    computeActive();
    window.addEventListener('scroll', computeActive, { passive: true });
    window.addEventListener('resize', computeActive);
    return () => {
      window.removeEventListener('scroll', computeActive);
      window.removeEventListener('resize', computeActive);
    };
  }, [items]);

  if (!isWide || !items.length) return null;

  const borderColor =
    mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';

  return (
    <Box
      component="nav"
      aria-label="文章目录"
      sx={{
        position: 'sticky',
        top: 88,
        alignSelf: 'flex-start',
        width: 220,
        maxHeight: 'calc(100vh - 120px)',
        overflowY: 'auto',
        borderLeft: `2px solid ${borderColor}`,
        pl: 1.5,
        py: 1,
      }}
    >
      <Box
        sx={{
          fontSize: 12,
          fontWeight: 600,
          color: 'text.secondary',
          mb: 1,
          letterSpacing: '0.04em',
        }}
      >
        目录
      </Box>
      <List dense disablePadding>
        {items.map((it) => (
          <ListItemButton
            key={it.id}
            component="a"
            href={`#${it.id}`}
            selected={activeId === it.id}
            sx={{
              pl: it.depth === 3 ? 3 : 1.5,
              borderRadius: 1,
              fontSize: 13,
              lineHeight: 1.5,
              color: activeId === it.id ? 'primary.main' : 'text.secondary',
              '&.Mui-selected': {
                backgroundColor: 'transparent',
                color: 'primary.main',
                fontWeight: 600,
              },
            }}
          >
            {it.text}
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
