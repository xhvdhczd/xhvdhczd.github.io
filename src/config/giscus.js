/**
 * Giscus (https://giscus.app) comment-system configuration.
 *
 * All fields are intentionally left blank and `enabled` is `false` so the
 * comment section stays hidden and the app compiles/runs without errors until
 * the site owner enables GitHub Discussions + installs the Giscus App and
 * fills in the real values.
 *
 * To enable later:
 *   1. Enable Discussions on the GitHub repo.
 *   2. Install the Giscus App on the repo.
 *   3. Copy the `data-repo` / `data-repo-id` / `data-category` /
 *      `data-category-id` values from the Giscus setup page into the object
 *      below and set `enabled: true`.
 *
 * @type {{
 *   enabled: boolean,
 *   repo: string,
 *   repoId: string,
 *   category: string,
 *   categoryId: string,
 *   lang: string
 * }}
 */
export const giscus = {
  enabled: false,
  repo: '',
  repoId: '',
  category: '',
  categoryId: '',
  lang: 'zh-CN',
};
