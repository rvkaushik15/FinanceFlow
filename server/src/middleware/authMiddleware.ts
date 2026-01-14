import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';

interface DecodedToken {
    userId: string;
}

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

            req.user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                select: { id: true, name: true, email: true },
            });

            if (!req.user) {
                res.status(401).json({ message: 'Not authorized, user not found' });
                return;
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export { protect };
