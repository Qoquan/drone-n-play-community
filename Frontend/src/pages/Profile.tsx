import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigation } from '../components/Navigation';
import * as userService from '../services/user.service';

/**
 * Profile Page
 * Affiche le profil utilisateur avec stats et options
 * 
 * Features:
 * - Avatar + Infos utilisateur
 * - Statistiques (drones, vols, heures)
 * - Options: Éditer profil, Changer mot de passe
 */
export const Profile: React.FC = () => {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Charger les données du profil et stats
   */
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !token) return;

      try {
        setLoading(true);
        // Récupérer le profil utilisateur
        const profileData = await userService.getUserProfile(user.id, token);
        setProfile(profileData);

        // Récupérer les stats
        const statsData = await userService.getUserStats(user.id, token);
        setStats(statsData);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur lors du chargement du profil';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, token]);

  if (loading) {
    return (
      <div>
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement du profil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* En-tête Profil */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-6 mb-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>

            {/* Infos */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-500 mt-1">@{user?.username || 'utilisateur'}</p>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
              ✏️ Éditer le profil
            </button>
            <button className="px-6 py-2 rounded-lg border border-gray-300 text-gray-900 font-medium hover:bg-gray-50 transition-colors">
              🔒 Changer le mot de passe
            </button>
          </div>
        </div>

        {/* Statistiques */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Total Drones */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600 text-sm font-medium mb-2">Nombre de Drones</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalDrones}</p>
              <p className="text-xs text-gray-500 mt-2">
                {stats.activeDrones} actifs
              </p>
            </div>

            {/* Total Vols */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600 text-sm font-medium mb-2">Nombre de Vols</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalFlights}</p>
              <p className="text-xs text-gray-500 mt-2">
                Tous drones confondus
              </p>
            </div>

            {/* Heures de Vol */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600 text-sm font-medium mb-2">Heures de Vol</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalFlightHours.toFixed(1)}h</p>
              <p className="text-xs text-gray-500 mt-2">
                Durée totale
              </p>
            </div>

            {/* Maintenance */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600 text-sm font-medium mb-2">Maintenances</p>
              <p className="text-3xl font-bold text-red-600">{stats.maintenanceDrones}</p>
              <p className="text-xs text-gray-500 mt-2">
                Drones en maintenance
              </p>
            </div>
          </div>
        )}

        {/* Catégories de Drones */}
        {stats && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Drones par Catégorie</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {['C0', 'C1', 'C2', 'C3', 'C4'].map((category) => (
                <div key={category} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-sm font-medium mb-1">{category}</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.categories[category] || 0}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};