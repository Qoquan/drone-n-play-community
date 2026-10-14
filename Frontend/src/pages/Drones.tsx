import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigation } from '../components/Navigation';

/**
 * Drones Page
 * Gestion complète de la flotte de drones
 * 
 * Features:
 * - Liste des drones avec filtering
 * - Bouton "+ Ajouter Drone"
 * - Clic sur drone pour détails
 * - Éditer/Supprimer drones
 * - Pagination
 */
export const Drones: React.FC = () => {
  const { token } = useAuth();
  const [drones, setDrones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDrone, setSelectedDrone] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
  });

  const API_URL = import.meta.env.VITE_API_URL || 'https://drone-n-play-backend.onrender.com/api';

  /**
   * Charger la liste des drones
   */
  const fetchDrones = async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      // Construire les query params
      const params = new URLSearchParams();
      params.append('limit', '20');
      params.append('offset', '0');
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);

      const response = await fetch(`${API_URL}/drones?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des drones');
      }

      const data = await response.json();
      setDrones(data.drones || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Charger les drones au montage et quand les filtres changent
   */
  useEffect(() => {
    fetchDrones();
  }, [filters, token]);

  /**
   * Ajouter un nouveau drone (formulaire simplifié pour test)
   */
  const handleAddDrone = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      brand: formData.get('brand'),
      model: formData.get('model'),
      serialNumber: formData.get('serialNumber'),
      weight: parseInt(formData.get('weight') as string),
      category: formData.get('category'),
      flightClass: formData.get('flightClass'),
    };

    try {
      const response = await fetch(`${API_URL}/drones`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création');
      }

      // Recharger la liste
      fetchDrones();
      setShowForm(false);
      // Reset form
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur';
      setError(message);
    }
  };

  /**
   * Supprimer un drone
   */
  const handleDeleteDrone = async (droneId: number) => {
    if (!token || !confirm('Êtes-vous sûr de vouloir supprimer ce drone?')) return;

    try {
      const response = await fetch(`${API_URL}/drones/${droneId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      fetchDrones();
      setSelectedDrone(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur';
      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* En-tête + Bouton ajouter */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes Drones</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            + Ajouter un Drone
          </button>
        </div>

        {/* Formulaire Ajouter Drone */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Ajouter un nouveau drone</h2>
            <form onSubmit={handleAddDrone} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nom */}
              <input
                type="text"
                name="name"
                placeholder="Nom du drone"
                required
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
              />

              {/* Marque */}
              <input
                type="text"
                name="brand"
                placeholder="Marque (ex: DJI)"
                required
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
              />

              {/* Modèle */}
              <input
                type="text"
                name="model"
                placeholder="Modèle (ex: Mini 3 Pro)"
                required
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
              />

              {/* Numéro de série */}
              <input
                type="text"
                name="serialNumber"
                placeholder="Numéro de série"
                required
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
              />

              {/* Poids (en grammes) */}
              <input
                type="number"
                name="weight"
                placeholder="Poids (grammes)"
                required
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
              />

              {/* Catégorie */}
              <select
                name="category"
                required
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
              >
                <option value="">Sélectionner catégorie</option>
                <option value="C0">C0 (&lt;250g)</option>
                <option value="C1">C1 (250g-900g)</option>
                <option value="C2">C2 (900g-4kg)</option>
                <option value="C3">C3 (4kg-25kg)</option>
                <option value="C4">C4 (&gt;25kg)</option>
              </select>

              {/* Classe de vol */}
              <select
                name="flightClass"
                required
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
              >
                <option value="">Sélectionner classe de vol</option>
                <option value="A1">A1 - Au-dessus de personnes</option>
                <option value="A2">A2 - À proximité de personnes</option>
                <option value="A3">A3 - Loin de personnes</option>
              </select>

              {/* Boutons */}
              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                >
                  ✓ Créer le drone
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 rounded-lg border border-gray-300 text-gray-900 font-medium hover:bg-gray-50 transition-colors"
                >
                  ✕ Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Messages d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Recherche */}
            <input
              type="text"
              placeholder="Rechercher (nom, marque, modèle...)"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
            />

            {/* Catégorie */}
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
            >
              <option value="">Toutes catégories</option>
              <option value="C0">C0</option>
              <option value="C1">C1</option>
              <option value="C2">C2</option>
              <option value="C3">C3</option>
              <option value="C4">C4</option>
            </select>

            {/* Statut */}
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
            >
              <option value="">Tous statuts</option>
              <option value="ACTIVE">Actif</option>
              <option value="MAINTENANCE">En maintenance</option>
              <option value="RETIRED">Retiré</option>
            </select>
          </div>
        </div>

        {/* Liste des drones */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des drones...</p>
          </div>
        ) : drones.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">Aucun drone dans votre flotte</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
            >
              + Ajouter votre premier drone
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drones.map((drone) => (
              <div
                key={drone.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all"
                onClick={() => setSelectedDrone(drone)}
              >
                {/* Avatar drone */}
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl mb-4">
                  🚁
                </div>

                {/* Infos */}
                <h3 className="font-bold text-lg text-gray-900 mb-2">{drone.name}</h3>
                <p className="text-sm text-gray-600 mb-3">
                  {drone.brand} {drone.model}
                </p>

                {/* Badge statut */}
                <div className="flex gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    drone.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : drone.status === 'MAINTENANCE'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {drone.status}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {drone.category}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 text-sm mb-4 pb-4 border-t border-gray-200 pt-4">
                  <div>
                    <p className="text-gray-500 text-xs">Vols</p>
                    <p className="font-bold text-gray-900">{drone.totalFlights}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Heures</p>
                    <p className="font-bold text-gray-900">{drone.totalFlightHours}h</p>
                  </div>
                </div>

                {/* Boutons action */}
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
                    Voir détails
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteDrone(drone.id);
                    }}
                    className="px-3 py-2 rounded-lg border border-red-300 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal détails drone */}
        {selectedDrone && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedDrone.name}</h2>
                <button
                  onClick={() => setSelectedDrone(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Marque & Modèle</p>
                  <p className="font-medium text-gray-900">{selectedDrone.brand} {selectedDrone.model}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Numéro de série</p>
                  <p className="font-medium text-gray-900">{selectedDrone.serialNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Poids</p>
                  <p className="font-medium text-gray-900">{selectedDrone.weight}g</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Catégorie</p>
                    <p className="font-medium text-gray-900">{selectedDrone.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Classe de vol</p>
                    <p className="font-medium text-gray-900">{selectedDrone.flightClass}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
                  ✏️ Éditer
                </button>
                <button
                  onClick={() => {
                    handleDeleteDrone(selectedDrone.id);
                  }}
                  className="flex-1 px-4 py-2 rounded-lg border border-red-300 text-red-600 font-medium hover:bg-red-50 transition-colors"
                >
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};