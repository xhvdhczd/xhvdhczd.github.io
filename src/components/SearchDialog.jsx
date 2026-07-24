import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import { useSearch } from '../hooks/useSearch.js';

/**
 * Site-wide fuzzy search dialog.
 *
 * Opens from the `NavBar` search entry. Runs a Fuse query (via `useSearch`) on
 * title / excerpt / tags and lists matches as links to the post detail page.
 *
 * @param {{
 *   open: boolean,
 *   onClose: () => void
 * }} props
 */
export default function SearchDialog({ open, onClose }) {
  const { query } = useSearch();
  const [term, setTerm] = useState('');

  const close = () => {
    setTerm('');
    onClose();
  };

  const trimmed = term.trim();
  const results = trimmed ? query(trimmed) : [];

  return (
    <Dialog
      open={open}
      onClose={close}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 14 } }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>站内搜索</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          variant="outlined"
          placeholder="搜索文章标题、摘要或标签…"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') close();
          }}
        />

        {trimmed && (
          <Box sx={{ mt: 1 }}>
            {results.length === 0 ? (
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                没有找到匹配的文章。
              </Typography>
            ) : (
              <List disablePadding>
                {results.map((post) => (
                  <ListItemButton
                    key={post.slug}
                    component={RouterLink}
                    to={`/post/${post.slug}`}
                    onClick={close}
                    sx={{ borderRadius: 2 }}
                  >
                    <ListItemText
                      primary={post.title}
                      secondary={post.excerpt}
                      primaryTypographyProps={{ fontWeight: 500 }}
                      secondaryTypographyProps={{
                        noWrap: true,
                        sx: { color: 'text.secondary' },
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
