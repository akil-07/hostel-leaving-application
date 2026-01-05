# 🚀 Deployment Guide (Option 2: Full Stack)

To deploy your full-stack app (React + Node.js), you cannot use GitHub Pages alone because it doesn't support the backend logic.

We will use:
1.  **Render** (Free) to host the **Backend**.
2.  **Vercel** (Free) to host the **Frontend**.

---

## Part 1: Deploy Backend (Render)

1.  **Push your latest code to GitHub** (We already did this!).
2.  Go to [Render.com](https://render.com/) and Sign Up/Login.
3.  Click **"New +"** -> **"Web Service"**.
4.  Connect your GitHub repository: `hostel-leaving-application`.
5.  Configure the service:
    *   **Name**: `hostel-backend` (or similar)
    *   **Root Directory**: `backend` (Important!)
    *   **Runtime**: Node
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`
    *   **Instance Type**: Free
6.  **Environment Variables** (Scroll down):
    *   Add Key: `JWT_SECRET` | Value: `somerandomsecretkey`
    *   Add Key: `NODE_ENV` | Value: `production`
    *   *Note: Since we are using the JSON file mock DB, we don't need MONGO_URI for now. Just know that data will reset if the server restarts on the free tier.*
7.  Click **"Create Web Service"**.
8.  **Wait** for it to deploy. Once done, copy the URL (e.g., `https://hostel-backend.onrender.com`). **Save this URL.**

---

## Part 2: Deploy Frontend (Vercel)

1.  Go to [Vercel.com](https://vercel.com/) and Sign Up/Login.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your GitHub repository: `hostel-leaving-application`.
4.  Configure the project:
    *   **Framework Preset**: Vite (should auto-detect).
    *   **Root Directory**: Click "Edit" and select `frontend`.
5.  **Environment Variables**:
    *   Expand the "Environment Variables" section.
    *   Key: `VITE_API_URL`
    *   Value: Paste your **Render Backend URL** (e.g., `https://hostel-backend.onrender.com`) **without** the trailing slash.
6.  Click **"Deploy"**.

---

## 🎉 Success!
Vercel will give you a live URL (e.g., `https://hostel-app.vercel.app`).
You can now share this link with anyone!

### ⚠️ Important Note on Data
Since we switched to a **Local JSON Database** (file-based) to fix your local issues:
*   On **Render Free Tier**, the server "spins down" (sleeps) when inactive.
*   When it wakes up, **all files created (users, leaves) will be lost/reset**.
*   **For permanent data**, you must eventually set up **MongoDB Atlas** (Cloud Database) and add the `MONGO_URI` in Render's environment variables.
