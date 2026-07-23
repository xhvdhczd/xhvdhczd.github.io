import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import { usePosts } from '../hooks/usePosts.js';
import PostCard from '../components/PostCard.jsx';
import TagChips from '../components/TagChips.jsx';

/**
 * Home page: a tag cloud entry plus the reverse-chronological post list.
 */
export default function HomePage() {
  const { posts, allTags } = usePosts();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        文章列表
      </Typography>

      {allTags.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            按标签浏览：
          </Typography>
          <TagChips tags={allTags} />
        </Box>
      )}

      <Divider sx={{ mb: 3 }} />

      {posts.length === 0 ? (
        <Typography color="text.secondary">暂无文章。</Typography>
      ) : (
        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid item xs={12} sm={6} key={post.slug}>
              <PostCard post={post} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
