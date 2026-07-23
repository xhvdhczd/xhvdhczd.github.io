import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { Link as RouterLink } from 'react-router-dom';

/**
 * Render a list of tag chips. Clicking a chip navigates to the tag filter
 * page (`/tag/:tag`).
 *
 * @param {{
 *   tags: string[],
 *   size?: 'small' | 'medium',
 *   clickable?: boolean
 * }} props
 */
export default function TagChips({ tags = [], size = 'small', clickable = true }) {
  if (!tags || tags.length === 0) return null;

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
      {tags.map((tag) => (
        <Chip
          key={tag}
          label={tag}
          size={size}
          variant="outlined"
          color="primary"
          clickable={clickable}
          component={clickable ? RouterLink : 'span'}
          to={clickable ? `/tag/${encodeURIComponent(tag)}` : undefined}
        />
      ))}
    </Box>
  );
}
