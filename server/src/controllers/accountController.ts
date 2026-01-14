import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// @desc    Get all user accounts
// @route   GET /api/accounts
// @access  Private
export const getAccounts = async (req: Request, res: Response) => {
    try {
        const accounts = await prisma.account.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
        });
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new account
// @route   POST /api/accounts
// @access  Private
export const createAccount = async (req: Request, res: Response) => {
    const { name, type, balance, currency } = req.body;

    try {
        const account = await prisma.account.create({
            data: {
                userId: req.user.id,
                name,
                type,
                balance: balance || 0,
                currency: currency || 'USD',
            },
        });
        res.status(201).json(account);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update an account
// @route   PUT /api/accounts/:id
// @access  Private
export const updateAccount = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, type, balance } = req.body;

    try {
        const account = await prisma.account.findUnique({ where: { id: String(id) } });

        if (!account || account.userId !== req.user.id) {
            res.status(404).json({ message: 'Account not found' });
            return;
        }

        const updatedAccount = await prisma.account.update({
            where: { id: String(id) },
            data: { name, type, balance },
        });

        res.json(updatedAccount);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete an account
// @route   DELETE /api/accounts/:id
// @access  Private
export const deleteAccount = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const account = await prisma.account.findUnique({ where: { id: String(id) } });

        if (!account || account.userId !== req.user.id) {
            res.status(404).json({ message: 'Account not found' });
            return;
        }

        await prisma.account.delete({ where: { id: String(id) } });
        res.json({ message: 'Account removed' });
    } catch (error) {
        console.error('Delete Account Error:', error);
        res.status(500).json({ message: 'Server Error', error: String(error) });
    }
};
