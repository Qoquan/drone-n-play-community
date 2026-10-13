import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Login Component
 * Allows users to log in with email and password
 * On success, stores JWT token and user data in localStorage
 * Redirects to home page after successful login
 */
export default function Login() {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Auth context hooks
  const { login } = useAuth();
  const navigate = useNavigate();

  /**
   * Handle form submission
   * Calls auth context login function with email and password
   * Redirects to home page on success
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call auth context login function
      // This makes API call to /api/auth/login
      // Returns user data and JWT token
      await login(email, password);
      
      // Redirect to home page on successful login
      navigate('/');
    } catch (err: any) {
      // Display error message if login fails
      // Common errors: invalid email/password, network error
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center p-4">
      {/* Login card container */}
      <div className="w-full max-w-md bg-light-surface dark:bg-dark-surface rounded-lg shadow-lg p-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-8 text-light-primary dark:text-dark-primary">
          Drone'n Play
        </h1>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email input field */}
          <div>
            <label className="block text-sm font-medium mb-2 text-light-text dark:text-dark-text">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
              required
            />
          </div>

          {/* Password input field */}
          <div>
            <label className="block text-sm font-medium