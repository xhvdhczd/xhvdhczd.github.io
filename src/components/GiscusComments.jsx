import { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import { giscus } from '../config/giscus.js';

/**
 * Giscus comment section.
 *
 * Behavior:
 *  - When `giscus.enabled` is false (the default), render nothing — no script,
 *    no error.
 *  - When enabled AND fully configured (repo / repoId / categoryId present),
 *    dynamically inject the Giscus `<script>` into the container. The script
 *    self-mounts the comment UI.
 *  - When enabled but misconfigured, the container is rendered empty (a safe
 *    placeholder) instead of throwing.
 */
export default function GiscusComments() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!giscus || !giscus.enabled) return undefined;
    if (!giscus.repo || !giscus.repoId || !giscus.categoryId) return undefined;

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-repo', giscus.repo);
    script.setAttribute('data-repo-id', giscus.repoId);
    script.setAttribute('data-category', giscus.category);
    script.setAttribute('data-category-id', giscus.categoryId);
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', 'preferred_color_scheme');
    script.setAttribute('data-lang', giscus.lang || 'zh-CN');
    script.setAttribute('data-loading', 'lazy');

    const node = containerRef.current;
    if (node) node.appendChild(script);

    return () => {
      if (node) node.innerHTML = '';
    };
  }, []);

  if (!giscus || !giscus.enabled) return null;

  return (
    <Box sx={{ mt: 4 }} ref={containerRef} id="giscus-comments">
      {/* Giscus mounts its UI here when enabled and configured. */}
    </Box>
  );
}
