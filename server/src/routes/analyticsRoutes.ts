import express from 'express';
import { getDashboardMetrics } from '../controllers/analyticsController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.get('/dashboard', getDashboardMetrics);

export default router;
