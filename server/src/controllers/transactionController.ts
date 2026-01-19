import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// @desc    Get all transactions (with filters)
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 20;
    const { type, accountId } = req.query;

    if (limit === -1) {
        limit = 100000; // Allow distinct large number or bypass check
    }

    const skip = (page - 1) * limit;

    // Build filter object
    const where: any = { userId: req.user.id };
    if (type) {
        where.category = { type: String(type) };
    }
    if (accountId) {
        where.accountId = String(accountId);
    }

    try {
        const transactions = await prisma.transaction.findMany({
            where,
            orderBy: { date: 'desc' },
            take: limit === 100000 ? undefined : limit, // Undefined takes all matching
            skip: limit === 100000 ? 0 : Number(skip),
            include: {
                category: true,
                account: true,
            },
        });

        const total = await prisma.transaction.count({ where });

        res.json({
            data: transactions,
            pagination: {
                total,
                page: Number(page),
                pages: limit === 100000 ? 1 : Math.ceil(total / Number(limit)),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add a new transaction
// @route   POST /api/transactions
// @access  Private
export const createTransaction = async (req: Request, res: Response): Promise<void> => {
    const { accountId, categoryId, amount, date, description, type } = req.body;

    try {
        // 1. Verify Account Ownership
        const account = await prisma.account.findUnique({
            where: { id: accountId }
        });

        if (!account || account.userId !== req.user.id) {
            res.status(404).json({ message: 'Account not found' });
            return;
        }

        // 2. Create Transaction
        const transaction = await prisma.transaction.create({
            data: {
                userId: req.user.id,
                accountId,
                categoryId: categoryId ? categoryId : undefined,
                amount,
                date: date ? new Date(date) : undefined,
                description,
                type,
            },
        });

        // 3. Update Account Balance
        let adjustment = Number(amount);

        if (categoryId) {
            const category = await prisma.category.findUnique({ where: { id: categoryId } });
            if (category && category.type === 'EXPENSE') {
                adjustment = -Number(amount);
            }
        } else if (type === 'EXPENSE') {
            adjustment = -Number(amount);
        }

        await prisma.account.update({
            where: { id: accountId },
            data: {
                balance: { increment: adjustment }
            }
        });

        res.status(201).json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const transaction = await prisma.transaction.findUnique({
            where: { id: String(id) },
            include: { category: true }
        });

        if (!transaction || transaction.userId !== req.user.id) {
            res.status(404).json({ message: 'Transaction not found' });
            return;
        }

        // Revert balance
        let originalAdjustment = Number(transaction.amount);
        if (transaction.type === 'EXPENSE') {
            originalAdjustment = -Number(transaction.amount);
        }

        await prisma.account.update({
            where: { id: transaction.accountId },
            data: {
                balance: { decrement: originalAdjustment }
            }
        });

        await prisma.transaction.delete({ where: { id: String(id) } });
        res.json({ message: 'Transaction removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: String(error) });
    }
};
