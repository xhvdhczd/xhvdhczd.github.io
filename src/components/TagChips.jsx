import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { Link as RouterLink } from 'react-router-dom';

/**
 * Render a list of tag chips. Clicking a chip navigates to the tag filter
 * page (`/tag/:tag`).
 *
 * Variants:
 *  - `'default'` : uniform chips (used inside post cards).
 *  - `'cloud'`   : font size scales with each tag's post count, supplied via
 *                  the `counts` Map. No new heading (`h2`) is introduced, so it
 *                  stays compatible with the HomePage test contract.
 *
 * @param {{
 *   tags: string[],
 *   size?: 'small' | 'medium',
 *   clickable?: boolean,
 *   variant?: 'default' | 'cloud',
 *   counts?: Map<string, number>
 * }} props
 */
export default function TagChips({
  tags = [],
  size = 'small',
  clickable = true,
  variant = 'default',
  counts,
}) {
  if (!tags || tags.length === 0) return null;

  const values = counts && counts.size ? Array.from(counts.values()) : [];
  const max = values.length ? Math.max(...values) : 0;
  const min = values.length ? Math.min(...values) : 0;

  /**
   * Font size (rem) for a tag in cloud mode, scaled by its post count.
   * Returns `undefined` (default size) when not in cloud mode or counts are
   * flat (no visible difference possible).
   * @param {string} tag
   * @return {number | undefined}
   */
  const fontSizeFor = (tag) => {
    if (variant !== 'cloud' || !counts || !counts.has(tag)) return undefined;
    if (max === min) return undefined;
    const t = (counts.get(tag) - min) / (max - min);
    return 0.8 + t * 0.9; // 0.8rem .. 1.7rem
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 0.75,
        alignItems: 'center',
        lineHeight: 2,
      }}
    >
      {tags.map((tag) => {
        const fs = fontSizeFor(tag);
        return (
          <Chip
            key={tag}
            label={tag}
            size={size}
            variant="outlined"
            color="primary"
            clickable={clickable}
            component={clickable ? RouterLink : 'span'}
            to={clickable ? `/tag/${encodeURIComponent(tag)}` : undefined}
            sx={fs ? { fontSize: `${fs}rem`, fontWeight: 600 } : undefined}
          />
        );
      })}
    </Box>
  );
}
