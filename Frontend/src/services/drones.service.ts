/**
 * PHASE-3.1: Drones CRUD Backend Service
 * 
 * Gère la logique métier pour les opérations CRUD sur les drones
 * - Création de drones avec validation complète
 * - Récupération avec filtering et pagination
 * - Modification avec ownership check
 * - Suppression sécurisée
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface DroneFilters {
  brand?: string;
  model?: string;
  category?: string;
  status?: string;
  hasInsurance?: boolean;
  maintenanceRequired?: boolean;
  search?: string;
}

interface PaginationOptions {
  limit: number;
  offset: number;
}

/**
 * Crée un nouveau drone pour un utilisateur
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
    insurance?: {
      provider: string;
      policyNumber: string;
      expiryDate: Date;
    };
  }
) => {
  try {
    if (!data.name || !data.brand || !data.model || !data.serialNumber) {
      throw new Error('Les champs nom, marque, modèle et numéro de série sont obligatoires');
    }

    if (data.weight <= 0) {
      throw new Error('Le poids doit être supérieur à 0');
    }

    const existingDrone = await prisma.drone.findFirst({
      where: {
        userId,
        serialNumber: data.serialNumber,
      },
    });

    if (existingDrone) {
      throw new Error('Un drone avec ce numéro de série existe déjà dans votre flotte');
    }

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
    throw new Error(message, { cause: error });
  }
};

/**
 * Récupère les drones d'un utilisateur avec filtering et pagination
 */
export const getDrones = async (
  userId: number,
  filters: DroneFilters = {},
  pagination: PaginationOptions = { limit: 10, offset: 0 }
) => {
  try {
    const whereConditions: Record<string, unknown> = {
      userId,
    };

    if (filters.brand) {
      whereConditions.brand = {
        contains: filters.brand,
        mode: 'insensitive',
      };
    }

    if (filters.model) {
      whereConditions.model = {
        contains: filters.model,
        mode: 'insensitive',
      };
    }

    if (filters.category) {
      whereConditions.category = filters.category;
    }

    if (filters.status) {
      whereConditions.status = filters.status;
    }

    if (filters.maintenanceRequired !== undefined) {
      whereConditions.maintenanceRequired = filters.maintenanceRequired;
    }

    if (filters.search) {
      whereConditions.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { brand: { contains: filters.search, mode: 'insensitive' } },
        { model: { contains: filters.search, mode: 'insensitive' } },
        { serialNumber: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const total = await prisma.drone.count({
      where: whereConditions,
    });

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
    throw new Error(message, { cause: error });
  }
};

/**
 * Récupère un drone spécifique par ID
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
    throw new Error(message, { cause: error });
  }
};

/**
 * Met à jour un drone
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
    const drone = await prisma.drone.findFirst({
      where: {
        id: droneId,
        userId,
      },
    });

    if (!drone) {
      throw new Error('Drone non trouvé ou vous n\'avez pas accès à ce drone');
    }

    if (data.weight !== undefined && data.weight <= 0) {
      throw new Error('Le poids doit être supérieur à 0');
    }

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

    const updatedDrone = await prisma.drone.update({
      where: { id: droneId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return updatedDrone;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur lors de la mise à jour du drone';
    throw new Error(message, { cause: error });
  }
};

/**
 * Supprime un drone
 */
export const deleteDrone = async (droneId: number, userId: number) => {
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

    await prisma.flight.updateMany({
      where: {
        droneId,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    await prisma.drone.delete({
      where: { id: droneId },
    });

    return {
      success: true,
      message: `Le drone "${drone.name}" a été supprimé. Les vols associés restent en archive.`,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur lors de la suppression du drone';
    throw new Error(message, { cause: error });
  }
};

/**
 * Récupère les statistiques des drones d'un utilisateur
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
    throw new Error(message, { cause: error });
  }
};