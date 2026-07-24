import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Link as RouterLink } from 'react-router-dom';
import TagChips from './TagChips.jsx';

/**
 * A single article preview card used in list / tag pages.
 *
 * @param {{
 *   post: {
 *     slug: string,
 *     title: string,
 *     date: string,
 *     tags: string[],
 *     excerpt: string
 *   }
 * }} props
 */
export default function PostCard({ post }) {
  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 12px 36px rgba(0,0,0,0.5)'
              : '0 12px 36px rgba(0,0,0,0.12)',
        },
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={`/post/${post.slug}`}
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <CardContent sx={{ width: '100%' }}>
          <Typography variant="h6" component="h2" gutterBottom>
            {post.title}
          </Typography>
          {post.date && (
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              {post.date}
              {typeof post.readingTime === 'number'
                ? ` · 约 ${post.readingTime} 分钟阅读`
                : ''}
            </Typography>
          )}
          {post.excerpt && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              {post.excerpt}
            </Typography>
          )}
          <Box>
            {/* The whole card is already a link via CardActionArea, so the
                tags must not be links to avoid nested <a> in <a>. */}
            <TagChips tags={post.tags} clickable={false} />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
