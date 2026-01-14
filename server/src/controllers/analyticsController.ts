import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// Mock Exchange Rates (Base: USD)
const EXCHANGE_RATES: Record<string, number> = {
    'USD': 1,
    'EUR': 0.92,
    'GBP': 0.79,
    'INR': 83.12,
    'JPY': 148.0
};

const convertToUSD = (amount: number, currency: string = 'USD') => {
    const rate = EXCHANGE_RATES[currency] || 1;
    return amount / rate;
};

// @desc    Get dashboard metrics (Balance, Income, Expense)
// @route   GET /api/analytics/dashboard
// @access  Private
export const getDashboardMetrics = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;

        // 1. Total Balance
        const accounts = await prisma.account.findMany({
            where: { userId },
        });
        const totalBalance = accounts.reduce((acc, account) => {
            return acc + convertToUSD(Number(account.balance), account.currency);
        }, 0);

        // 2. Monthly Income & Expense
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // We can aggregate using groupBy if SQLite supports it fully for what we need, 
        // or just findMany and reduce for simplicity in this MVP with SQLite.
        const monthTransactions = await prisma.transaction.findMany({
            where: {
                userId,
                date: {
                    gte: firstDayOfMonth
                }
            },
            include: { category: true, account: true }
        });

        let income = 0;
        let expense = 0;

        monthTransactions.forEach(t => {
            const amt = convertToUSD(Number(t.amount), t.account?.currency);

            // Check category type or inferred type
            const type = t.type || t.category?.type; // 'INCOME' | 'EXPENSE'

            if (type === 'INCOME') {
                income += amt;
            } else if (type === 'EXPENSE') {
                expense += amt;
            }
        });

        // 3. Last 6 Months History
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1); // Start of that month

        const historyTransactions = await prisma.transaction.findMany({
            where: {
                userId,
                date: { gte: sixMonthsAgo }
            },
            include: { category: true, account: true }
        });

        // Initialize last 6 months map
        const monthlyStats = new Map<string, { income: number; expense: number }>();
        for (let i = 0; i < 6; i++) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthKey = d.toLocaleString('default', { month: 'short' });
            monthlyStats.set(monthKey, { income: 0, expense: 0 });
        }

        historyTransactions.forEach(t => {
            const date = new Date(t.date);
            const monthKey = date.toLocaleString('default', { month: 'short' });

            if (monthlyStats.has(monthKey)) {
                const amt = convertToUSD(Number(t.amount), t.account?.currency);
                const type = t.type || t.category?.type;

                if (type === 'INCOME') {
                    monthlyStats.get(monthKey)!.income += amt;
                } else if (type === 'EXPENSE') {
                    monthlyStats.get(monthKey)!.expense += amt;
                }
            }
        });

        // Convert Map to Array and Reverse to be Chronological (Jan -> Jun)
        const chartData = Array.from(monthlyStats, ([name, { income, expense }]) => ({ name, income, expense })).reverse();

        res.json({
            totalBalance,
            monthlyIncome: income,
            monthlyExpense: expense,
            accountsCount: accounts.length,
            chartData
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
