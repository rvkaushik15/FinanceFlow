import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma';
import generateToken from '../utils/generateToken';

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const signupUser = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    try {
        const userExists = await prisma.user.findUnique({
            where: { email },
        });

        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                // Create default categories for new user
                categories: {
                    create: [
                        { name: 'Salary', type: 'INCOME', color: '#10b981' },
                        { name: 'Food', type: 'EXPENSE', color: '#ef4444' },
                        { name: 'Rent', type: 'EXPENSE', color: '#3b82f6' },
                        { name: 'Transport', type: 'EXPENSE', color: '#f59e0b' },
                        { name: 'Entertainment', type: 'EXPENSE', color: '#8b5cf6' },
                        { name: 'Shopping', type: 'EXPENSE', color: '#ec4899' },
                    ]
                }
            },
        });

        if (user) {
            generateToken(res, user.id);
            res.status(201).json({
                id: user.id,
                name: user.name,
                email: user.email,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (user && (await bcrypt.compare(password, user.passwordHash))) {
            generateToken(res, user.id);
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = (req: Request, res: Response) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};
