import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Navigation Component
 * Barre de navigation réutilisable pour toutes les pages
 * Style: Clean, moderne, épuré (Tailwind + Bleu/Violet)
 * 
 * Features:
 * - Logo + titre
 * - Onglets de navigation avec underline actif
 * - Badge profil utilisateur
 * - Bouton logout
 * - Responsive
 */
export const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  /**
   * Détermine si une route est active
   */
  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  /**
   * Classe pour les onglets actifs/inactifs
   */
  const getTabClasses = (path: string): string => {
    const baseClasses = 'px-1 py-2 text-sm font-medium transition-colors';
    if (isActive(path)) {
      return `${baseClasses} text-blue-600 border-b-2 border-blue-600`;
    }
    return `${baseClasses} text-gray-600 hover:text-gray-900 border-b-2 border-transparent`;
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo + Titre */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚁</span>
            <Link to="/" className="font-bold text-xl text-gray-900 hover:text-blue-600 transition-colors">
              Drone'n Play
            </Link>
          </div>

          {/* Onglets de Navigation - Centre */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={getTabClasses('/')}>
              Accueil
            </Link>
            <Link to="/drones" className={getTabClasses('/drones')}>
              Mes Drones
            </Link>
            <Link to="/flights" className={getTabClasses('/flights')}>
              Carnet de Vol
            </Link>
            <Link to="/maintenance" className={getTabClasses('/maintenance')}>
              Maintenance
            </Link>
            <Link to="/weather" className={getTabClasses('/weather')}>
              Météo
            </Link>
            <Link to="/map" className={getTabClasses('/map')}>
              Carte
            </Link>
            <Link to="/links" className={getTabClasses('/links')}>
              Liens Utiles
            </Link>
            <Link to="/social" className={getTabClasses('/social')}>
              Social
            </Link>
          </div>

          {/* Profil + Logout - Droite */}
          <div className="flex items-center gap-4">
            {/* Badge Profil */}
            {user && (
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:inline text-sm font-medium text-gray-900">
                  {user.name || 'Profil'}
                </span>
              </Link>
            )}

            {/* Bouton Logout */}
            <button
              onClick={() => {
                logout();
                // Redirection vers login peut se faire via navigate dans le composant
              }}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-900 hover:bg-gray-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
