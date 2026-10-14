import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authService } from './services/auth.service.js';
import { authMiddleware, AuthRequest } from './middleware/auth.middleware.js';
import { PrismaClient } from '@prisma/client';
import * as dronesService from './services/drones.service.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      res.status(400).json({ error: 'Email, password, and name are required' });
      return;
    }

    const result = await authService.register(email, password, name);
    res.status(201).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(400).json({ error: message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(401).json({ error: message });
  }
});

// Protected route - Get user profile
app.get('/api/users/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
const userId = parseInt(req.params.id);
const user = await prisma.user.findUnique({
  where: { id: userId },      select: { id: true, email: true, name: true, createdAt: true },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  res.status(400).json({ error: message });
}
});
/**
 * DRONES ROUTES (PHASE-3.1)
 * Gestion complète des drones: CRUD + filtering + pagination
 */

/**
 * POST /api/drones
 * Create a new drone
 * Requires: Authorization header with token
 * Body: { name, brand, model, serialNumber, weight, category, flightClass, ... }
 */
app.post('/api/drones', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { name, brand, model, serialNumber, weight, category, flightClass, photoUrl, maxFlightTime, maxSpeed, cameraResolution, registrationNumber, registrationExpiry, insurance } = req.body;

    // Basic validation
    if (!name || !brand || !model || !serialNumber || !weight || !category || !flightClass) {
      res.status(400).json({ error: 'name, brand, model, serialNumber, weight, category, and flightClass are required' });
      return;
    }

    const drone = await dronesService.createDrone(req.userId!, {
      name,
      brand,
      model,
      serialNumber,
      photoUrl,
      weight,
      category,
      flightClass,
      maxFlightTime,
      maxSpeed,
      cameraResolution,
      registrationNumber,
      registrationExpiry,
      insurance,
    });

    res.status(201).json(drone);
  } catch (error) {
    res.status(400).json({ error: (error instanceof Error ? error.message : String(error)) });
  }
});

/**
 * GET /api/drones
 * Get user's drones with filtering and pagination
 * Query params: 
 *   - limit (default 10, max 50)
 *   - offset (default 0)
 *   - brand, model, category, status (filters)
 *   - search (text search on name, brand, model, serialNumber)
 * Requires: Authorization header with token
 */
app.get('/api/drones', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
    const offset = parseInt(req.query.offset as string) || 0;

    // Build filters
    const filters: Record<string, unknown> = {};    if (req.query.brand) filters.brand = req.query.brand as string;
    if (req.query.model) filters.model = req.query.model as string;
    if (req.query.category) filters.category = req.query.category as string;
    if (req.query.status) filters.status = req.query.status as string;
    if (req.query.search) filters.search = req.query.search as string;
    if (req.query.maintenanceRequired) filters.maintenanceRequired = req.query.maintenanceRequired === 'true';

    const result = await dronesService.getDrones(req.userId!, filters, { limit, offset });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error instanceof Error ? error.message : String(error)) });
  }
});

/**
 * GET /api/drones/:id
 * Get single drone by ID
 * Requires: Authorization header with token
 */
app.get('/api/drones/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const droneId = parseInt(req.params.id);

    if (isNaN(droneId)) {
      res.status(400).json({ error: 'Invalid drone ID' });
      return;
    }

    const drone = await dronesService.getDroneById(droneId, req.userId!);
    res.json(drone);
  } catch (error) {
    res.status(404).json({ error: (error instanceof Error ? error.message : String(error)) });
  }
});

/**
 * PUT /api/drones/:id
 * Update drone (only owner can update)
 * Requires: Authorization header with token
 * Body: { name?, brand?, model?, ... } (all fields optional)
 */
app.put('/api/drones/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const droneId = parseInt(req.params.id);

    if (isNaN(droneId)) {
      res.status(400).json({ error: 'Invalid drone ID' });
      return;
    }

    const drone = await dronesService.updateDrone(droneId, req.userId!, req.body);
    res.json(drone);
  } catch (error) {
    if ((error instanceof Error ? error.message : String(error)).includes('not found')) {
      res.status(404).json({ error: (error instanceof Error ? error.message : String(error)) });
    } else {
      res.status(400).json({ error: (error instanceof Error ? error.message : String(error)) });
    }
  }
});

/**
 * DELETE /api/drones/:id
 * Delete drone (only owner can delete)
 * Archives associated flights instead of deleting them
 * Requires: Authorization header with token
 */
app.delete('/api/drones/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const droneId = parseInt(req.params.id);

    if (isNaN(droneId)) {
      res.status(400).json({ error: 'Invalid drone ID' });
      return;
    }

    const result = await dronesService.deleteDrone(droneId, req.userId!);
    res.json(result);
  } catch (error) {
    if ((error instanceof Error ? error.message : String(error)).includes('not found')) {
      res.status(404).json({ error: (error instanceof Error ? error.message : String(error)) });
    } else {
      res.status(400).json({ error: (error instanceof Error ? error.message : String(error)) });
    }
  }
});

/**
 * GET /api/drones/stats
 * Get drone statistics (total drones, categories breakdown, etc.)
 * Requires: Authorization header with token
 */
app.get('/api/drones/stats', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const stats = await dronesService.getDroneStats(req.userId!);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: (error instanceof Error ? error.message : String(error)) });
  }
});
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});