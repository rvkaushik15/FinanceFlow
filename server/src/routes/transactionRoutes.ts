import { Router } from 'express';
import { getTransactions, createTransaction, deleteTransaction } from '../controllers/transactionController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.route('/')
    .get(getTransactions)
    .post(createTransaction);

router.delete('/:id', deleteTransaction);

export default router;
