import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';
import { Link as RouterLink } from 'react-router-dom';

/**
 * Fallback page for unmatched routes.
 */
export default function NotFoundPage() {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        404
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        页面走丢了。
      </Typography>
      <Button component={RouterLink} to="/" variant="contained" startIcon={<HomeIcon />}>
        回到首页
      </Button>
    </Box>
  );
}
