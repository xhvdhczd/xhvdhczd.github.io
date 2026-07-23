import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import PostPage from './pages/PostPage.jsx';
import TagPage from './pages/TagPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

// Top-level route configuration.
// `Layout` renders the persistent AppBar + content container and uses
// `<Outlet />` for the matched child route.
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="post/:slug" element={<PostPage />} />
        <Route path="tag" element={<TagPage />} />
        <Route path="tag/:tag" element={<TagPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
