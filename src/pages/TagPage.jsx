import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts.js';
import PostCard from '../components/PostCard.jsx';
import TagChips from '../components/TagChips.jsx';

/**
 * Tag page. Two modes:
 *   - `/tag`          -> shows the full tag cloud (all tags).
 *   - `/tag/:tag`     -> shows posts filtered by that tag.
 */
export default function TagPage() {
  const { tag } = useParams();
  const { allTags, getPostsByTag } = usePosts();

  // Overview mode: list every tag as a clickable chip cloud.
  if (!tag) {
    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          全部标签
        </Typography>
        {allTags.length === 0 ? (
          <Typography color="text.secondary">暂无标签。</Typography>
        ) : (
          <TagChips tags={allTags} size="medium" />
        )}
      </Box>
    );
  }

  const decodedTag = decodeURIComponent(tag);
  const filtered = getPostsByTag(decodedTag);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        标签：{decodedTag}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        共 {filtered.length} 篇文章 ·{' '}
        <RouterLink to="/tag" style={{ textDecoration: 'underline' }}>
          查看全部标签
        </RouterLink>
      </Typography>

      {filtered.length === 0 ? (
        <Typography color="text.secondary">该标签下暂无文章。</Typography>
      ) : (
        <Grid container spacing={3}>
          {filtered.map((post) => (
            <Grid item xs={12} sm={6} key={post.slug}>
              <PostCard post={post} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
