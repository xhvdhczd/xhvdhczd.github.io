import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { usePosts } from '../hooks/usePosts.js';
import { extractToc } from '../utils/extractToc.js';
import {
  SITE_URL,
  SITE_TITLE,
  SITE_DESCRIPTION,
  OG_IMAGE,
} from '../config/site.js';
import TagChips from '../components/TagChips.jsx';
import MarkdownRenderer from '../components/MarkdownRenderer.jsx';
import TocSidebar from '../components/TocSidebar.jsx';
import ReadingProgress from '../components/ReadingProgress.jsx';
import PostNavigation from '../components/PostNavigation.jsx';
import GiscusComments from '../components/GiscusComments.jsx';

/**
 * Article detail page. Reads `:slug` from the URL and renders the Markdown
 * body with a title, date, reading time, tags, an optional TOC sidebar, a
 * reading-progress bar, prev/next + related navigation, Giscus comments, and
 * Open Graph / Twitter meta injected via react-helmet-async.
 */
export default function PostPage() {
  const { slug } = useParams();
  const { getPostBySlug, getPrevNext, getRelated } = usePosts();
  const post = slug ? getPostBySlug(slug) : undefined;

  const toc = useMemo(() => (post ? extractToc(post.content) : []), [post]);
  const { prev, next } = useMemo(
    () =>
      post
        ? getPrevNext(post.slug)
        : { prev: undefined, next: undefined },
    [post, getPrevNext]
  );
  const related = useMemo(
    () => (post ? getRelated(post.slug, 3) : []),
    [post, getRelated]
  );

  if (!post) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h5" gutterBottom>
          文章不存在
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          找不到 slug 为 “{slug}” 的文章。
        </Typography>
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          startIcon={<ArrowBackIcon />}
        >
          返回首页
        </Button>
      </Box>
    );
  }

  const postUrl = `${SITE_URL}/post/${post.slug}`;
  const ogImage = OG_IMAGE.startsWith('http')
    ? OG_IMAGE
    : `${SITE_URL}${OG_IMAGE}`;
  const description = post.excerpt || SITE_DESCRIPTION;

  return (
    <Box>
      <ReadingProgress />
      <Helmet>
        <title>{`${post.title} · ${SITE_TITLE}`}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={postUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content={SITE_TITLE} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={postUrl} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        {post.date && (
          <meta property="article:published_time" content={post.date} />
        )}
      </Helmet>

      <Box
        sx={{
          display: 'flex',
          gap: { xs: 0, md: 4 },
          alignItems: 'flex-start',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            minWidth: 0,
            p: { xs: 2, sm: 4 },
            boxShadow: (theme) =>
              theme.palette.mode === 'dark'
                ? '0 4px 24px rgba(0,0,0,0.4)'
                : '0 4px 24px rgba(0,0,0,0.06)',
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: 700, letterSpacing: '-0.02em', mb: 1 }}
            gutterBottom
          >
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
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                flexWrap: 'wrap',
              }}
            >
              {post.date && (
                <Typography variant="caption" color="text.secondary">
                  {post.date}
                </Typography>
              )}
              {typeof post.readingTime === 'number' && (
                <Typography variant="caption" color="text.secondary">
                  · 约 {post.readingTime} 分钟阅读
                </Typography>
              )}
            </Box>
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

          <PostNavigation prev={prev} next={next} related={related} />
          <GiscusComments />
        </Paper>

        <TocSidebar items={toc} />
      </Box>
    </Box>
  );
}
