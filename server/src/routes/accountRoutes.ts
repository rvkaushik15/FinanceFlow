import express from 'express';
import { getAccounts, createAccount, updateAccount, deleteAccount } from '../controllers/accountController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect); // All routes are protected

router.route('/').get(getAccounts).post(createAccount);
router.route('/:id').put(updateAccount).delete(deleteAccount);

export default router;
