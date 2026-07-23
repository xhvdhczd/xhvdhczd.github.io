import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import { usePosts } from '../hooks/usePosts.js';
import PostCard from '../components/PostCard.jsx';
import TagChips from '../components/TagChips.jsx';

/**
 * Home page: a spacious hero, a tag-cloud entry, and the
 * reverse-chronological post list.
 */
export default function HomePage() {
  const { posts, allTags } = usePosts();

  return (
    <Box>
      {/* 大留白 Hero：标题 + 一句副标题，清晰字号层级 */}
      <Box
        sx={{
          textAlign: 'center',
          py: { xs: 6, sm: 10 },
          mb: 2,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{ fontWeight: 700, letterSpacing: '-0.02em', mb: 2 }}
        >
          颜培志 · 博客
        </Typography>
        <Typography
          variant="h6"
          component="p"
          color="text.secondary"
          sx={{
            fontWeight: 400,
            letterSpacing: '-0.01em',
            maxWidth: 560,
            mx: 'auto',
          }}
        >
          脉冲涡流无损检测 · 学术随笔 · 生活记录
        </Typography>
      </Box>

      {allTags.length > 0 && (
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            按标签浏览：
          </Typography>
          <TagChips tags={allTags} />
        </Box>
      )}

      <Divider sx={{ mb: 4 }} />

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
