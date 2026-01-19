# FinanceTracker Deployment Guide

This guide details how to deploy your FinanceTracker application to **Vercel** with the **Supabase** backend.

## 1. Prerequisites

- **Supabase Database**: (Already Configured)
  - Your database is connected and specific tables have been created via `prisma db push`.
- **Vercel Account**: You need an account on [vercel.com](https://vercel.com).

## 2. Environment Variables

Your local `.env` file is ready, but **you must add these variables to Vercel** for the production deployment to work.

Go to your Vercel Project Settings > Environment Variables and add:

| Key | Value |
| --- | --- |
| `DATABASE_URL` | `postgresql://postgres:Luckypostgre%401@db.cbiqzimcxhhgcswkaxgr.supabase.co:5432/postgres` |
| `JWT_SECRET` | `finance-tracker-secret-key-change-this-in-prod` |
| `NODE_ENV` | `production` |

> **Note**: The `DATABASE_URL` includes your password. Keep this secret.

## 3. Deploying via Vercel CLI

Since `vercel` is not currently installed in your path, we recommend installing it globally or using `npx`.

### Option A: Using npx (Recommended)

Run the following command in your terminal:

```bash
npx vercel deploy --prod
```

1.  It will ask you to log in (if not already).
2.  It will ask to set up and link the project.
    -   Select "Yes".
    -   Scope: Select your username/team.
    -   Link to existing project? "No" (creates a new one).
    -   Project Name: `finance-tracker` (or your preference).
    -   Directory: `./` (default).
3.  **Build Settings**: It typically auto-detects `vite` or `General`.
    -   If asked, verify that you want to override settings if necessary, but our `vercel.json` should handle most things.
    -   **Important**: If the deployment fails on build, ensure `Install Command` runs `npm install` and `Build Command` runs `npm run build --workspace=client` (or rely on the `vercel.json` settings).

### Option B: Deploying via Dashboard (Git Integration)

1.  Push your code to GitHub/GitLab/Bitbucket.
2.  Import the project in Vercel Dashboard.
3.  Configure the **Environment Variables** (Step 2) *before* the first deployment completes if possible, or trigger a redeploy after adding them.
4.  Vercel should automatically detect the settings.

## 4. Verification

After deployment, visit your Vercel URL.
-   Check if the **frontend** loads.
-   Try **Login/Signup** to verify the backend connection to Supabase.
