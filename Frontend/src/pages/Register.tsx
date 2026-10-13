import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Register Component
 * Allows new users to create an account
 * Validates passwords match before submission
 * Stores JWT token and user data after successful registration
 */
export default function Register() {
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Auth context hooks
  const { register } = useAuth();
  const navigate = useNavigate();

  /**
   * Handle form submission
   * Validates passwords match, calls register function
   * Redirects to home page on success
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Password validation - ensure passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Call auth context register function
      // This makes API call and stores token/user in localStorage
      await register(email, password, name);

      // Redirect to home page on success
      navigate('/');
    } catch (err: any) {
      // Display error message if registration fails
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center p-4">
      {/* Register card container */}
      <div className="w-full max-w-md bg-light-surface dark:bg-dark-surface rounded-lg shadow-lg p-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-8 text-light-primary dark:text-dark-primary">
          Drone'n Play
        </h1>

        {/* Registration form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name input */}
          <div>
            <label className="block text-sm font-medium mb-2 text-light-text dark:text-dark-text">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
              required
            />
          </div>

          {/* Email input */}
          <div>
            <label className="block text-sm font-medium mb-2 text-light-text dark:text-dark-text">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
              required
            />
          </div>

          {/* Password input */}
          <div>
            <label className="block text-sm font-medium mb-2 text-light-text dark:text-dark-text">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
              required
            />
          </div>

          {/* Confirm password input */}
          <div>
            <label className="block text-sm font-medium mb-2 text-light-text dark:text-dark-text">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
              required
            />
          </div>

          {/* Error message display */}
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-light-primary dark:bg-dark-primary text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {/* Link to login page */}
        <p className="mt-6 text-center text-light-text dark:text-dark-text">
          Already have an account?{' '}
          <a href="/login" className="text-light-primary dark:text-dark-primary hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
