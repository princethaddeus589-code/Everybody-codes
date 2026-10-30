# Portfolio Generator — Black & White Connected

Your friend's portfolio app + clean black & white login (same style as the admin console).

## What was connected

- Black & white split-screen **Login** page
- Working **Signup** (saves users in the browser — no backend needed)
- Protected dashboard routes (must sign in)
- Sign out button in the sidebar
- Optional Vercel admin login via `/api/login`
- All original pages kept: Dashboard, My Portfolios, Templates, Create Portfolio, Settings

## Deploy on Vercel

1. Push this folder to a GitHub repository (files at the root).
2. Import the repo into Vercel.
3. (Optional but recommended) Add Environment Variables:
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
4. Deploy.

## How login works

- **Signup** → creates a local account in the browser and signs you in.
- **Login** → first tries the Vercel admin credentials (if you set them), then falls back to local accounts created with Signup.
- All portfolio data still lives in `localStorage` (same as before).

## Local development

```bash
npm install
npm run dev
```
