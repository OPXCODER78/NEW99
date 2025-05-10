import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import AuthLayout from './layouts/AuthLayout';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleProtectedRoute from './components/auth/RoleProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'));
const PostDetail = lazy(() => import('./pages/PostDetail'));
const Category = lazy(() => import('./pages/Category'));
const Search = lazy(() => import('./pages/Search'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const PostList = lazy(() => import('./pages/admin/posts/PostList'));
const PostEditor = lazy(() => import('./pages/admin/posts/PostEditor'));
const CategoryList = lazy(() => import('./pages/admin/categories/CategoryList'));
const CommentModeration = lazy(() => import('./pages/admin/comments/CommentModeration'));
const Profile = lazy(() => import('./pages/user/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<LoadingSpinner fullScreen />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="posts/:slug" element={<PostDetail />} />
              <Route path="category/:slug" element={<Category />} />
              <Route path="search" element={<Search />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Auth routes */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route index element={<Navigate to="/auth/login" replace />} />
            </Route>

            {/* User routes (protected) */}
            <Route path="/user" element={<ProtectedRoute><PublicLayout /></ProtectedRoute>}>
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Admin routes (protected + role) */}
            <Route 
              path="/admin" 
              element={
                <RoleProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout />
                </RoleProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="posts" element={<PostList />} />
              <Route path="posts/new" element={<PostEditor />} />
              <Route path="posts/edit/:id" element={<PostEditor />} />
              <Route path="categories" element={<CategoryList />} />
              <Route path="comments" element={<CommentModeration />} />
            </Route>
          </Routes>
        </Suspense>
        <Toaster position="top-right" richColors closeButton />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;