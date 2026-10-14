import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigation } from '../components/Navigation';
import { Link } from 'react-router-dom';

/**
 * Home Page
 * Page d'accueil avec navigation et call-to-action
 */
export const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Bienvenue dans Drone'n Play! 🚁
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Gérez votre flotte de drones, suivez vos vols et maintenez vos composants en parfait état.
          </p>
        </div>

        {/* Call-to-Action */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Mes Drones */}
          <Link
            to="/drones"
            className="p-8 rounded-lg border border-gray-200 hover:border-blue-600 hover:shadow-lg transition-all bg-white"
          >
            <div className="text-4xl mb-4">🚁</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Mes Drones</h3>
            <p className="text-gray-600">Gère ta flotte, ajoute des drones et consulte leurs détails.</p>
          </Link>

          {/* Mon Profil */}
          <Link
            to="/profile"
            className="p-8 rounded-lg border border-gray-200 hover:border-blue-600 hover:shadow-lg transition-all bg-white"
          >
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Mon Profil</h3>
            <p className="text-gray-600">Consulte tes stats, édite ton profil et gère ta sécurité.</p>
          </Link>

          {/* À venir */}
          <div className="p-8 rounded-lg border border-gray-200 bg-gray-50">
            <div className="text-4xl mb-4">🔜</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Bientôt...</h3>
            <p className="text-gray-600">Carnet de vol, maintenance, météo, carte, etc.</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Bienvenue, {user?.name}! 👋</h2>
          <p className="text-gray-700 mb-4">
            Commence par créer tes premiers drones pour démarrer ton aventure avec Drone'n Play.
          </p>
          <Link
            to="/drones"
            className="inline-block px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            + Ajouter mon premier drone
          </Link>
        </div>
      </div>
    </div>
  );
};