import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { useTheme } from './hooks/useTheme';
import MessagesPage from './pages/MessagesPage';
import TweetDetailPage from './pages/TweetDetailPage';

function App() {
  useTheme();

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="messages/:userId" element={<MessagesPage />} />
        <Route path="status/:tweetId" element={<TweetDetailPage />} />
      </Route>
      <Route path="/admin" element={<AdminDashboardPage />} />
    </Routes>
  );
}

export default App;
