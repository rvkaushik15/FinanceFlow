import express from 'express'; // Restart trigger 2
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import accountRoutes from './routes/accountRoutes';
import transactionRoutes from './routes/transactionRoutes';
import categoryRoutes from './routes/categoryRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import budgetRoutes from './routes/budgetRoutes';
import goalRoutes from './routes/goalRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(helmet());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/goals', goalRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Finance Tracker API is running' });
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
