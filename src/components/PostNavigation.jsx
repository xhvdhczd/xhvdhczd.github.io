import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Link as RouterLink } from 'react-router-dom';
import PostCard from './PostCard.jsx';

/**
 * Bottom-of-article navigation:
 *  - previous / next post links (chronological reading order)
 *  - related posts grid (hidden when empty — graceful degradation)
 *
 * @param {{
 *   prev?: object | undefined,
 *   next?: object | undefined,
 *   related?: object[]
 * }} props
 */
export default function PostNavigation({ prev, next, related = [] }) {
  const hasPrevNext = Boolean(prev || next);

  return (
    <Box sx={{ mt: 4 }}>
      <Divider sx={{ mb: 3 }} />

      {hasPrevNext && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
            mb: 4,
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {prev ? (
              <Button
                component={RouterLink}
                to={`/post/${prev.slug}`}
                startIcon={<ArrowBackIosNewIcon />}
                sx={{
                  textTransform: 'none',
                  justifyContent: 'flex-start',
                  width: '100%',
                }}
              >
                <Box sx={{ textAlign: 'left', overflow: 'hidden' }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    上一篇
                  </Typography>
                  <Typography variant="body2" noWrap>
                    {prev.title}
                  </Typography>
                </Box>
              </Button>
            ) : (
              <Box />
            )}
          </Box>

          <Box sx={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
            {next ? (
              <Button
                component={RouterLink}
                to={`/post/${next.slug}`}
                endIcon={<ArrowForwardIosIcon />}
                sx={{
                  textTransform: 'none',
                  justifyContent: 'flex-end',
                  width: '100%',
                }}
              >
                <Box sx={{ textAlign: 'right', overflow: 'hidden' }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    下一篇
                  </Typography>
                  <Typography variant="body2" noWrap>
                    {next.title}
                  </Typography>
                </Box>
              </Button>
            ) : (
              <Box />
            )}
          </Box>
        </Box>
      )}

      {related.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            相关文章
          </Typography>
          <Grid container spacing={3}>
            {related.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post.slug}>
                <PostCard post={post} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
}
