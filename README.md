# MediConnect – Healthcare Platform

A full-featured healthcare appointment platform built with Next.js, Tailwind, Prisma, and NextAuth.

## Features

- **Authentication**: Register as Patient or Doctor, login with JWT (NextAuth), role-based redirect to dashboards.
- **Patient**: Browse doctors (filter by specialization, fee, search), view doctor profile, book appointments, view/cancel appointments, leave reviews after completed visits.
- **Doctor**: Manage profile (bio, specialization, experience, fee), set availability slots, accept/reject appointments, mark completed, view dashboard analytics (appointments, earnings, patients).
- **Admin**: View system stats, manage users (block/delete), approve/revoke doctors.
- **AI Symptom Checker**: Rule-based suggestion of which specialist to see from symptom text (public at `/symptoms`).
- **Notifications**: Email hooks for appointment booked and doctor confirmed (set `RESEND_API_KEY` for real emails).

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment**
   - Copy `.env.example` to `.env` (or use the created `.env`).
   - Ensure `DATABASE_URL`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL` are set.

3. **Database**
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   ```
   Seed creates: `admin@mediconnect.com`, `doctor@mediconnect.com`, `patient@mediconnect.com` (password: `password123`).

4. **Run**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000). Sign in and you’ll be redirected by role (Patient → `/dashboard/patient`, Doctor → `/dashboard/doctor`, Admin → `/dashboard/admin`).

## Troubleshooting

- **`JWT_SESSION_ERROR` / decryption operation failed**  
  The browser has an old session cookie that was signed with a different `NEXTAUTH_SECRET`. Clear site data for `localhost:3000`: DevTools → Application → Storage → Clear site data (or delete cookies for localhost). Then sign in again.

- **`EPERM` on `.next/trace`**  
  The `.next` folder is locked (e.g. by a previous dev server). Stop all `npm run dev` processes, delete the folder once (`rm -r .next` or Remove-Item -Recurse .next), then run `npm run dev` again.
