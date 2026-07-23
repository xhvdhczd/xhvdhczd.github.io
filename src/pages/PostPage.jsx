import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts.js';
import TagChips from '../components/TagChips.jsx';
import MarkdownRenderer from '../components/MarkdownRenderer.jsx';

/**
 * Article detail page. Reads `:slug` from the URL and renders the Markdown
 * body with a title, date, and tags.
 */
export default function PostPage() {
  const { slug } = useParams();
  const { getPostBySlug } = usePosts();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h5" gutterBottom>
          文章不存在
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          找不到 slug 为 “{slug}” 的文章。
        </Typography>
        <Button component={RouterLink} to="/" variant="contained" startIcon={<ArrowBackIcon />}>
          返回首页
        </Button>
      </Box>
    );
  }

  return (
    <Paper elevation={1} sx={{ p: { xs: 2, sm: 4 } }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {post.title}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1,
          mb: 1,
        }}
      >
        {post.date && (
          <Typography variant="caption" color="text.secondary">
            {post.date}
          </Typography>
        )}
        <TagChips tags={post.tags} />
      </Box>
      <Box sx={{ my: 3 }}>
        <MarkdownRenderer content={post.content} />
      </Box>
      <Button
        component={RouterLink}
        to="/"
        variant="outlined"
        startIcon={<ArrowBackIcon />}
      >
        返回文章列表
      </Button>
    </Paper>
  );
}
