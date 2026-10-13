import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';

/**
 * Protected Route Component
 * Redirects to login if user not authenticated
 * Otherwise renders the requested component
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

/**
 * Home Component
 * Main application page (protected)
 * Shows authenticated user content
 */
function Home() {
  const { user, logout } = useAuth();
  
  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text">
      {/* Header with user info and logout */}
      <header className="bg-light-surface dark:bg-dark-surface shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-light-primary dark:text-dark-primary">
            Drone'n Play
          </h1>
          
          <div className="flex items-center gap-4">
            <span className="text-sm">Welcome, {user?.name}!</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto p-4">
        <h2 className="text-3xl font-bold mb-6">Welcome to Drone'n Play! 🚁</h2>
        <p className="text-lg">You are successfully logged in!</p>
      </main>
    </div>
  );
}

/**
 * App Component
 * Routes management and AuthProvider wrapper
 * Handles navigation between Login, Register, and Home pages
 */
function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      
      {/* Catch-all redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

/**
 * Main App Component
 * Wraps app with AuthProvider for global auth state
 * Sets up routing with React Router
 */
export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}