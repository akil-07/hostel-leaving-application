# How to Deploy Your Serverless Backend (Google Apps Script)

Since you want to host everything on GitHub without a paid backend server, we are moving the logic to **Google Apps Script**.

### 1. Set up the Google Sheet
1. Open your Google Sheet: `https://docs.google.com/spreadsheets/d/16rw-G7eWfFWQuOhW_TCbTOs2nT1eD5g-uP9Gqk1nFpE/edit`
2. Ensure you have two tabs at the bottom:
   - `leaves`
   - `users`
3. **In the `users` tab**, add these headers to Row 1:
   - `id`, `name`, `email`, `password`, `role`
4. **In the `leaves` tab**, add these headers to Row 1 (Order is important for my script):
   - `Timestamp`, `RegNo`, `Name`, `Year`, `Dept`, `StudentMobile`, `ParentMobile`, `Room`, `Reason`, `Floor`, `Dates`, `ID`, `StudentID`, `Status`, `Comments`, `From`, `To`, `Days`, `OutTime`

### 2. Add the Script
1. In your Google Sheet, click **Extensions** > **Apps Script**.
2. A code editor will open. Delete any code there.
3. **Copy and Paste** the code from `GOOGLE_APPS_SCRIPT_CODE.js` (which I just added to your project folder) into this editor.
4. Click the **Save** icon (Floppy disk). Name it "Hostel Backend".

### 3. Deploy as API
1. Click the blue **Deploy** button (top right) -> **New deployment**.
2. Click the Gear icon (Select type) -> **Web app**.
3. **Description:** "Hostel API v1".
4. **Execute as:** `Me` (your email).
5. **Who has access:** `Anyone` (Important! This allows your App to talk to it).
6. Click **Deploy**.
7. **Authorize Access:** It will ask for permission. Click "Review permissions" -> Choose your account -> Advanced -> **Go to Hostel Backend (unsafe)** -> Allow.
8. **Copy the Web App URL** (It starts with `https://script.google.com/macros/s/...`).

### 4. Connect Your Frontend
1. Go back to your VS Code project.
2. Open `.env` (or create it in `frontend/`).
3. Update the `VITE_API_URL` to be the **Web App URL** you just copied.
4. (I will help you update the Frontend API calls to match this new structure next).
