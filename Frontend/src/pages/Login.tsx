import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Login Page
 * Formulaire de connexion avec style moderne
 * 
 * Features:
 * - Email/Password login
 * - Validation
 * - Messages d'erreur
 * - Lien vers register
 */
export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur de connexion';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2 w-fit">
            <span className="text-2xl">🚁</span>
            <span className="font-bold text-xl text-gray-900">Drone'n Play</span>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Titre */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Se connecter</h1>
            <p className="text-gray-600">Accédez à votre compte Drone'n Play</p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Adresse email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
              />
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Bouton submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          {/* Lien Register */}
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-4">
              Pas encore de compte?{' '}
              <Link to="/register" className="text-blue-600 font-medium hover:text-blue-700">
                S'inscrire
              </Link>
            </p>
          </div>

          {/* Compte de test */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-gray-600 mb-2">
              <span className="font-medium">Pour tester:</span>
            </p>
            <p className="text-xs text-gray-700">
              Email: <code className="bg-white px-2 py-1 rounded border border-gray-200">lolo@example.com</code>
            </p>
            <p className="text-xs text-gray-700">
              Mot de passe: <code className="bg-white px-2 py-1 rounded border border-gray-200">password123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};