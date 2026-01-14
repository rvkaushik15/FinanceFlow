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

    try {
        const category = await prisma.category.findUnique({ where: { id: String(id) } });

        if (!category || category.userId !== req.user.id) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }

        await prisma.category.delete({ where: { id: String(id) } });
        res.json({ message: 'Category removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
