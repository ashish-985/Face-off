# 🚀 FACE-OFF — V1.0 Production Deployment Guide

This guide details the complete deployment process for hosting **FACE-OFF** on **Vercel** with a **Supabase PostgreSQL** backend, **Google OAuth**, and **Storage**.

---

## 🛠️ Step 1: Database Setup (Supabase)

1. Create a project on [Supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Copy the contents of [`supabase_schema.sql`](./supabase_schema.sql) and execute the SQL script.
4. Go to **Project Settings $\to$ API** and copy:
   - `URL` $\to$ `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` $\to$ `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🔑 Step 2: Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com).
2. Create a project named `FACE-OFF-Auth`.
3. Go to **APIs & Services $\to$ Credentials** and create an **OAuth 2.0 Client ID**.
4. Set Authorized Redirect URIs:
   - `https://your-supabase-project.supabase.co/auth/v1/callback`
   - `https://your-vercel-domain.vercel.app/api/auth/callback/google`
5. Copy your **Client ID** and **Client Secret** into your Supabase Dashboard under **Authentication $\to$ Providers $\to$ Google**.

---

## ☁️ Step 3: Hosting on Vercel

1. Push your codebase to a **GitHub** repository.
2. Go to [Vercel.com](https://vercel.com) and click **Add New Project**.
3. Import your `FACE-OFF` repository.
4. In **Environment Variables**, add the variables from `.env.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
5. Click **Deploy**. Vercel will automatically build and publish your Next.js application live!

---

## 🔒 Step 4: Safety & Privacy Verification

- **18+ Age Gate**: Active on landing route.
- **Privacy Policy**: Accessible at `/privacy`.
- **Terms & Content Guidelines**: Accessible at `/terms`.
- **Reporting & Blocking**: Built-in to profiles and voting queue.
