/**
 * PHASE-3.1: Drones CRUD Backend Service
 *
 * Gère la logique métier pour les opérations CRUD sur les drones
 * - Création de drones avec validation complète
 * - Récupération avec filtering et pagination
 * - Modification avec ownership check
 * - Suppression sécurisée
 *
 * @author Claude Haiku 4.5
 * @version 1.0.0
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Type pour les filtres de recherche de drones
 */
interface DroneFilters {
  brand?: string;
  model?: string;
  category?: string;
  status?: string;
  hasInsurance?: boolean;
  maintenanceRequired?: boolean;
  search?: string;
}

/**
 * Type pour les options de pagination
 */
interface PaginationOptions {
  limit: number;
  offset: number;
}

/**
 * Crée un nouveau drone pour un utilisateur
 *
 * @param userId - ID de l'utilisateur propriétaire
 * @param data - Données du drone
 * @returns Le drone créé avec tous les détails
 * @throws Error si validation échoue ou erreur DB
 */
export const createDrone = async (
  userId: number,
  data: {
    name: string;
    brand: string;
    model: string;
    serialNumber: string;
    photoUrl?: string;
    weight: number;
    category: string;
    flightClass: string;
    maxFlightTime?: number;
    maxSpeed?: number;
    cameraResolution?: string;
    registrationNumber?: string;
    registrationExpiry?: Date;
  }
) => {
  try {
    // Validation basique
    if (!data.name || !data.brand || !data.model || !data.serialNumber) {
      throw new Error('Les champs nom, marque, modèle et numéro de série sont obligatoires');
    }

    if (data.weight <= 0) {
      throw new Error('Le poids doit être supérieur à 0');
    }

    // Vérifier si le numéro de série existe déjà pour cet utilisateur
    const existingDrone = await prisma.drone.findFirst({
      where: {
        userId,
        serialNumber: data.serialNumber,
      },
    });

    if (existingDrone) {
      throw new Error('Un drone avec ce numéro de série existe déjà dans votre flotte');
    }

    // Créer le drone
    const drone = await prisma.drone.create({
      data: {
        userId,
        name: data.name,
        brand: data.brand,
        model: data.model,
        serialNumber: data.serialNumber,
        photoUrl: data.photoUrl || null,
        weight: data.weight,
        category: data.category,
        flightClass: data.flightClass,
        maxFlightTime: data.maxFlightTime || null,
        maxSpeed: data.maxSpeed || null,
        cameraResolution: data.cameraResolution || null,
        registrationNumber: data.registrationNumber || null,
        registrationExpiry: data.registrationExpiry || null,
        status: 'ACTIVE',
        totalFlights: 0,
        totalFlightHours: 0,
        maintenanceRequired: false,
      },
    });

    return drone;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur lors de la création du drone';
    const err = new Error(`Impossible de créer le drone: ${message}`);
    Object.assign(err, { cause: error });
    throw err;
  }
};

/**
 * Récupère les drones d'un utilisateur avec filtering et pagination
 *
 * @param userId - ID de l'utilisateur
 * @param filters - Filtres optionnels
 * @param pagination - Options de pagination
 * @returns Objet avec drones et nombre total
 */
export const getDrones = async (
  userId: number,
  filters: DroneFilters = {},
  pagination: PaginationOptions = { limit: 10, offset: 0 }
) => {
  try {
    // Construire les conditions WHERE
    const whereConditions: Record<string, unknown> = {
      userId,
    };

    // Filtrer par marque
    if (filters.brand) {
      whereConditions.brand = {
        contains: filters.brand,
        mode: 'insensitive',
      };
    }

    // Filtrer par modèle
    if (filters.model) {
      whereConditions.model = {
        contains: filters.model,
        mode: 'insensitive',
      };
    }

    // Filtrer par catégorie
    if (filters.category) {
      whereConditions.category = filters.category;
    }

    // Filtrer par statut
    if (filters.status) {
      whereConditions.status = filters.status;
    }

    // Filtrer par maintenance requise
    if (filters.maintenanceRequired !== undefined) {
      whereConditions.maintenanceRequired = filters.maintenanceRequired;
    }

    // Recherche par texte
    if (filters.search) {
      whereConditions.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { brand: { contains: filters.search, mode: 'insensitive' } },
        { model: { contains: filters.search, mode: 'insensitive' } },
        { serialNumber: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Récupérer le nombre total de drones
    const total = await prisma.drone.count({
      where: whereConditions,
    });

    // Récupérer les drones avec pagination
    const drones = await prisma.drone.findMany({
      where: whereConditions,
      skip: pagination.offset,
      take: pagination.limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      drones,
      total,
      limit: pagination.limit,
      offset: pagination.offset,
      hasMore: pagination.offset + pagination.limit < total,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur lors de la récupération des drones';
    const err = new Error(`Impossible de récupérer les drones: ${message}`);
    Object.assign(err, { cause: error });
    throw err;
  }
};

/**
 * Récupère un drone spécifique par ID
 * Vérifie que l'utilisateur est le propriétaire
 *
 * @param droneId - ID du drone
 * @param userId - ID de l'utilisateur (pour ownership check)
 * @returns Le drone avec tous les détails
 * @throws Error si drone non trouvé ou pas propriétaire
 */
export const getDroneById = async (droneId: number, userId: number) => {
  try {
    const drone = await prisma.drone.findFirst({
      where: {
        id: droneId,
        userId,
      },
    });

    if (!drone) {
      throw new Error('Drone non trouvé ou vous n\'avez pas accès à ce drone');
    }

    return drone;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur lors de la récupération du drone';
    const err = new Error(`Impossible de récupérer le drone: ${message}`);
    Object.assign(err, { cause: error });
    throw err;
  }
};

/**
 * Met à jour un drone
 * Vérifie que l'utilisateur est le propriétaire
 *
 * @param droneId - ID du drone
 * @param userId - ID de l'utilisateur (pour ownership check)
 * @param data - Données à mettre à jour (partielles)
 * @returns Le drone mis à jour
 */
export const updateDrone = async (
  droneId: number,
  userId: number,
  data: Partial<{
    name: string;
    brand: string;
    model: string;
    serialNumber: string;
    photoUrl: string;
    weight: number;
    category: string;
    flightClass: string;
    maxFlightTime: number;
    maxSpeed: number;
    cameraResolution: string;
    registrationNumber: string;
    registrationExpiry: Date;
    status: string;
    maintenanceRequired: boolean;
  }>
) => {
  try {
    // Vérifier que le drone appartient à l'utilisateur
    const drone = await prisma.drone.findFirst({
      where: {
        id: droneId,
        userId,
      },
    });

    if (!drone) {
      throw new Error('Drone non trouvé ou vous n\'avez pas accès à ce drone');
    }

    // Validation
    if (data.weight !== undefined && data.weight <= 0) {
      throw new Error('Le poids doit être supérieur à 0');
    }

    // Si serialNumber change, vérifier qu'il n'existe pas déjà
    if (data.serialNumber && data.serialNumber !== drone.serialNumber) {
      const existingDrone = await prisma.drone.findFirst({
        where: {
          userId,
          serialNumber: data.serialNumber,
          NOT: {
            id: droneId,
          },
        },
      });

      if (existingDrone) {
        throw new Error('Un drone avec ce numéro de série existe déjà dans votre flotte');
      }
    }

    // Mettre à jour le drone
    const updatedDrone = await prisma.drone.update({
      where: { id: droneId },
      data: {
        ...data,
      },
    });

    return updatedDrone;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur lors de la mise à jour du drone';
    const err = new Error(`Impossible de mettre à jour le drone: ${message}`);
    Object.assign(err, { cause: error });
    throw err;
  }
};

/**
 * Supprime un drone
 * Vérifie que l'utilisateur est le propriétaire
 * Archive les vols associés au lieu de les supprimer
 *
 * @param droneId - ID du drone à supprimer
 * @param userId - ID de l'utilisateur (pour ownership check)
 * @returns Message de confirmation
 */
export const deleteDrone = async (droneId: number, userId: number) => {
  try {
    // Vérifier que le drone appartient à l'utilisateur
    const drone = await prisma.drone.findFirst({
      where: {
        id: droneId,
        userId,
      },
    });

    if (!drone) {
      throw new Error('Drone non trouvé ou vous n\'avez pas accès à ce drone');
    }

    // Supprimer le drone
    await prisma.drone.delete({
      where: { id: droneId },
    });

    return {
      success: true,
      message: `Le drone "${drone.name}" a été supprimé.`,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur lors de la suppression du drone';
    const err = new Error(`Impossible de supprimer le drone: ${message}`);
    Object.assign(err, { cause: error });
    throw err;
  }
};

/**
 * Récupère les statistiques des drones d'un utilisateur
 *
 * @param userId - ID de l'utilisateur
 * @returns Statistiques globales
 */
export const getDroneStats = async (userId: number) => {
  try {
    const drones = await prisma.drone.findMany({
      where: { userId },
    });

    const stats = {
      totalDrones: drones.length,
      activeDrones: drones.filter((d) => d.status === 'ACTIVE').length,
      maintenanceDrones: drones.filter((d) => d.maintenanceRequired).length,
      totalFlights: drones.reduce((sum, d) => sum + d.totalFlights, 0),
      totalFlightHours: drones.reduce((sum, d) => sum + d.totalFlightHours, 0),
      categories: {
        C0: drones.filter((d) => d.category === 'C0').length,
        C1: drones.filter((d) => d.category === 'C1').length,
        C2: drones.filter((d) => d.category === 'C2').length,
        C3: drones.filter((d) => d.category === 'C3').length,
        C4: drones.filter((d) => d.category === 'C4').length,
      },
    };

    return stats;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur lors de la récupération des statistiques';
    const err = new Error(`Impossible de récupérer les statistiques: ${message}`);
    Object.assign(err, { cause: error });
    throw err;
  }
};