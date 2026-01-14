import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// @desc    Get all budgets
// @route   GET /api/budgets
// @access  Private
export const getBudgets = async (req: Request, res: Response) => {
    try {
        // We want to return budget details AND current spending progress for that category
        const budgets = await prisma.budget.findMany({
            where: { userId: req.user.id },
            include: { category: true }
        });

        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Calculate current spending for each budget's category
        const budgetsWithProgress = await Promise.all(budgets.map(async (budget) => {
            // Aggregate transactions for this category this month
            // Note: In SQLite we might need to be careful with aggregations, but 'count' and 'findMany' are safe.
            // 'aggregate' with _sum might work if number type is standard. 

            const aggregation = await prisma.transaction.aggregate({
                where: {
                    userId: req.user.id,
                    categoryId: budget.categoryId,
                    date: {
                        gte: firstDayOfMonth
                    },
                    // Assuming spending means Expense type, usually budget is for expenses.
                    // We could double check category type if we want.
                },
                _sum: {
                    amount: true
                }
            });

            // If category is INCOME, spending doesn't make sense, but budgets usually target expenses.
            // If it's income budget? (Target Income). For now assume expense budget.

            // Note: transaction amount is stored as Decimal/Float. 
            // Expenses are stored as positive numbers in 'amount' column usually, but we handled sign in 'balance' update.
            // The 'amount' field in Transaction model is likely absolute value.
            // Our createTransaction stores 'amount' directly from input.

            const spent = Number(aggregation._sum.amount || 0);

            return {
                ...budget,
                spent,
                remaining: Number(budget.amount) - spent
            };
        }));

        res.json(budgetsWithProgress);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a budget
// @route   POST /api/budgets
// @access  Private
export const createBudget = async (req: Request, res: Response): Promise<void> => {
    const { categoryId, amount, period } = req.body;

    try {
        // Check if budget already exists for this category
        const existingBudget = await prisma.budget.findFirst({
            where: { userId: req.user.id, categoryId }
        });

        if (existingBudget) {
            res.status(400).json({ message: 'Budget already exists for this category' });
            return;
        }

        const budget = await prisma.budget.create({
            data: {
                userId: req.user.id,
                categoryId,
                amount,
                period: period || 'MONTHLY'
            },
            include: { category: true }
        });

        res.status(201).json(budget);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private
export const deleteBudget = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const budget = await prisma.budget.findUnique({ where: { id: String(id) } });

        if (!budget || budget.userId !== req.user.id) {
            res.status(404).json({ message: 'Budget not found' });
            return;
        }

        await prisma.budget.delete({ where: { id: String(id) } });
        res.json({ message: 'Budget removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
