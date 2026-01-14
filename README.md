# FinanceFlow

FinanceFlow is a modern, comprehensive personal finance management application designed to empower users to take control of their financial health. It provides a seamless interface for tracking income and expenses, setting and monitoring monthly budgets, and defining long-term financial goals.

With a robust Dashboard, users can visualize their spending habits through interactive charts, ensuring they stay on top of their finances. The application features a secure authentication system, ensuring user data privacy and integrity.

## Project Structure

The project is organized as a monorepo with distinct client and server directories:

```
FinanceTracker/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React Contexts (Auth, Theme)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # key application pages (Dashboard, Transactions, etc.)
│   │   └── services/       # API integration services
│   └── ...
├── server/                 # Express.js backend application
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth and validation middleware
│   │   ├── routes/         # API route definitions
│   │   └── index.ts        # App entry point
│   └── ...
└── docker-compose.yml      # Database orchestration
```

## API Documentation

The backend API is served at `/api` and includes the following main endpoints:

### Authentication (`/api/auth`)
- `POST /register`: Register a new user.
- `POST /login`: Authenticate an existing user.
- `POST /logout`: Log out the current user.
- `GET /me`: Get current user profile.

### Accounts (`/api/accounts`)
- `GET /`: List all linked accounts.
- `POST /`: Link a new account.
- `PUT /:id`: Update account details.
- `DELETE /:id`: Remove an account.

### Transactions (`/api/transactions`)
- `GET /`: Retrieve transaction history.
- `POST /`: Log a new transaction.
- `PUT /:id`: Edit a transaction.
- `DELETE /:id`: Delete a transaction.

### Budgets (`/api/budgets`)
- `GET /`: View current budgets.
- `POST /`: Set a new budget category.
- `PUT /:id`: Adjust budget limits.
- `DELETE /:id`: Remove a budget.

### Goals (`/api/goals`)
- `GET /`: List financial goals.
- `POST /`: Create a new saving goal.
- `PUT /:id`: Update goal progress.
- `DELETE /:id`: Delete a goal.

### Analytics (`/api/analytics`)
- `GET /summary`: Get comprehensive financial summary.
- `GET /trends`: Retrieve spending trend data.

## Tech Stack

### Client
- **Framework**: React 19 with Vite
- **Language**: TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS, clsx, tailwind-merge
- **Routing**: React Router DOM
- **Data Visualization**: Recharts
- **HTTP Client**: Axios
- **UI Components**: Lucide React (Icons), Sonner (Toasts)

### Server
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens), Bcryptjs
- **Validation**: Zod
- **Security**: Helmet, Cors

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker & Docker Compose](https://www.docker.com/) (for PostgreSQL database)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd FinanceTracker
```

### 2. Database Configuration

Start the PostgreSQL database using Docker Compose:

```bash
docker-compose up -d
```

This commands starts a PostgreSQL container on port `5432` with the credentials defined in `docker-compose.yml`.

### 3. Server Setup

Navigate to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

**Environment Variables**:
Ensure you have a `.env` file in the `server` directory. It should typically contain:
```env
PORT=3000
DATABASE_URL="postgresql://admin:password123@localhost:5432/financetracker?schema=public"
JWT_SECRET="your_jwt_secret_key"
```
*(Note: Adjust credentials if you modified `docker-compose.yml`)*

Initialize the Database:

```bash
npm run prisma:push
```

Start the Development Server:

```bash
npm run dev
```

The server will start at `http://localhost:3000`.

### 4. Client Setup

Open a new terminal and navigate to the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the Development Server:

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`.

## Available Scripts

### Client (`/client`)
- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the app for production.
- `npm run lint`: Runs ESLint for code quality.
- `npm run preview`: Previews the production build.

### Server (`/server`)
- `npm run dev`: Starts the server in watch mode using Nodemon.
- `npm run build`: Compiles TypeScript to JavaScript.
- `npm run start`: Starts the compiled application.
- `npm run prisma:generate`: Generates the Prisma client.
- `npm run prisma:push`: Pushes the Prisma schema state to the database.

## License

This project is licensed under the ISC License.

