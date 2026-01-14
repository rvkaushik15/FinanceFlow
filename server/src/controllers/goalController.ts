import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// @desc    Get all goals
// @route   GET /api/goals
// @access  Private
export const getGoals = async (req: Request, res: Response) => {
    try {
        const goals = await prisma.goal.findMany({
            where: { userId: req.user.id },
            orderBy: { deadline: 'asc' }
        });
        res.json(goals);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a goal
// @route   POST /api/goals
// @access  Private
export const createGoal = async (req: Request, res: Response) => {
    const { name, targetAmount, currentAmount, deadline } = req.body;

    try {
        const goal = await prisma.goal.create({
            data: {
                userId: req.user.id,
                name,
                targetAmount,
                currentAmount: currentAmount || 0,
                deadline: deadline ? new Date(deadline) : undefined,
            },
        });
        res.status(201).json(goal);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a goal (e.g. add savings)
// @route   PUT /api/goals/:id
// @access  Private
export const updateGoal = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { currentAmount, name, targetAmount } = req.body;

    try {
        const goal = await prisma.goal.findUnique({ where: { id: String(id) } });

        if (!goal || goal.userId !== req.user.id) {
            res.status(404).json({ message: 'Goal not found' });
            return;
        }

        const updatedGoal = await prisma.goal.update({
            where: { id: String(id) },
            data: {
                name: name || undefined,
                targetAmount: targetAmount || undefined,
                currentAmount: currentAmount !== undefined ? currentAmount : undefined
            }
        });

        res.json(updatedGoal);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a goal
// @route   DELETE /api/goals/:id
// @access  Private
export const deleteGoal = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const goal = await prisma.goal.findUnique({ where: { id: String(id) } });

        if (!goal || goal.userId !== req.user.id) {
            res.status(404).json({ message: 'Goal not found' });
            return;
        }

        await prisma.goal.delete({ where: { id: String(id) } });
        res.json({ message: 'Goal removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
