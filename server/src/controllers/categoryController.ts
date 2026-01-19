import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// @desc    Get user categories
// @route   GET /api/categories
// @access  Private
export const getCategories = async (req: Request, res: Response) => {
    try {
        console.log('Fetching categories for user:', req.user);
        if (!req.user) {
            throw new Error('User not found in request');
        }
        const categories = await prisma.category.findMany({
            where: { userId: req.user.id },
            orderBy: { name: 'asc' },
        });
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private
export const createCategory = async (req: Request, res: Response) => {
    const { name, type, icon, color } = req.body;

    try {
        const category = await prisma.category.create({
            data: {
                userId: req.user.id,
                name,
                type, // 'INCOME' or 'EXPENSE'
                icon,
                color,
            },
        });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private
export const deleteCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(`[DELETE] Request for Category ID: ${id}`);

    try {
        const category = await prisma.category.findUnique({ where: { id: String(id) } });
        console.log(`[DELETE] Found category:`, category ? 'Yes' : 'No');

        if (!category || category.userId !== req.user.id) {
            console.log(`[DELETE] Category not found or user mismatch. CatUser: ${category?.userId}, ReqUser: ${req.user.id}`);
            res.status(404).json({ message: 'Category not found' });
            return;
        }

        // Manually handle relations to ensure deletion succeeds
        console.log('[DELETE] Nullifying transactions...');
        const transUpdate = await prisma.transaction.updateMany({
            where: { categoryId: String(id) },
            data: { categoryId: null }
        });
        console.log(`[DELETE] Transactions updated: ${transUpdate.count}`);

        console.log('[DELETE] Deleting budgets...');
        const budgetDelete = await prisma.budget.deleteMany({
            where: { categoryId: String(id) }
        });
        console.log(`[DELETE] Budgets deleted: ${budgetDelete.count}`);

        console.log('[DELETE] Deleting category...');
        await prisma.category.delete({ where: { id: String(id) } });
        console.log('[DELETE] Success');

        res.json({ message: 'Category removed' });
    } catch (error) {
        console.error('[DELETE] ERROR:', error);
        res.status(500).json({ message: 'Server Error', error: String(error) });
    }
};
