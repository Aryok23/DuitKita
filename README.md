# DuitKita – Family Expense Tracker

DuitKita is a fast, simple, and mobile-first Progressive Web App (PWA) designed to help families track their shared expenses easily. It features an intuitive interface, offline support, and automatic synchronization, making it perfect for managing household finances on the go.

## Features

- **Mobile-First PWA:** Installable on iOS and Android devices directly from the browser (no app store required).
- **Offline First:** Works seamlessly without an internet connection. Data is saved locally using IndexedDB and synced automatically when back online.
- **Family Shared:** Uses a simple shared PIN authentication for quick access by family members.
- **Expense Tracking:** Easily log expenses with details like amount, date, item, category, payment method, and who paid.
- **Monthly Summaries:** View total spending and a breakdown of who paid what per month.
- **Fast & Responsive:** Built with React, Vite, and Tailwind CSS for a snappy user experience.

## Tech Stack

- **Frontend Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (with Poppins font family)
- **Icons:** Lucide React
- **Local Storage:** Dexie.js (IndexedDB wrapper)
- **PWA Capabilities:** vite-plugin-pwa (Service Workers, Manifest)
- **Backend/Database:** Google Apps Script + Google Sheets (for simple, free data storage and syncing)
- **Deployment:** Vercel (Frontend)

## Prerequisites

To set up and run DuitKita yourself, you'll need:

1. **Node.js** (v18 or higher recommended)
2. **A Google Account** (to host the backend on Google Sheets/Apps Script)
3. **A Vercel Account** (optional, for deploying the frontend online)

## Setup Instructions

### 1. Backend Setup (Google Apps Script)

DuitKita uses a simple Google Sheet to store data. We use Google Apps Script to create an API that the frontend can communicate with.

1. Go to [Google Sheets](https://sheets.google.com) and create a new blank spreadsheet. Name it "DuitKita Database" (or whatever you prefer).
2. Note the **Spreadsheet ID** from the URL: `https://docs.google.com/spreadsheets/d/[THIS_IS_THE_ID]/edit`
3. In the Google Sheet menu, go to **Extensions > Apps Script**.
4. Delete any existing code in the editor and copy the contents of the `apps-script/Code.gs` file from this repository into the editor.
5. In the Apps Script code, update the `SPREADSHEET_ID` variable with the ID you copied in step 2.
6. **Important:** Also update the `VALID_PIN` variable in the script to your desired family PIN.
7. Click the **Save** icon (or press `Ctrl+S` / `Cmd+S`).
8. Click **Deploy > New deployment**.
9. Select **Web app** as the deployment type (click the gear icon next to "Select type").
10. Fill in the details:
    - **Description:** DuitKita API Prod
    - **Execute as:** Me (your email)
    - **Who has access:** Anyone
11. Click **Deploy**. (You may need to authorize the script to access your Google Sheet).
12. Copy the **Web App URL** provided. You will need this for the frontend setup.

### 2. Frontend Setup (Local Development)

1. Clone the repository:
   ```bash
   git clone https://github.com/Aryok23/DuitKita.git
   cd DuitKita
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root of your project directory and add the Web App URL you got from the Google Apps Script deployment:
   ```env
   VITE_API_URL=YOUR_APPS_SCRIPT_WEB_APP_URL_HERE
   ```
   *(Note: The PIN is configured in the Apps Script backend. You just type that PIN into the frontend to log in).*

4. Run the development server:
   ```bash
   npm run dev
   ```
   The app should now be running locally at `http://localhost:5173`.

## Deployment

### Deploying the Frontend to Vercel

Vercel is highly recommended for deploying Vite+React apps, and it's free.

1. Create a [Vercel](https://vercel.com/) account and connect it to your GitHub/GitLab repository.
2. Click **Add New > Project**.
3. Import your DuitKita repository.
4. **Important Configuration:**
   - **Framework Preset:** Vercel should automatically detect **Vite**.
   - **Environment Variables:** Add your `VITE_API_URL` and paste the Google Apps Script Web App URL as the value.
5. Click **Deploy**.

Vercel will build and deploy your app. Once finished, you will get a live URL (e.g., `https://duitkita.vercel.app`).

### Installing the PWA

Once deployed, you can access the URL on your mobile browser (Safari on iOS, Chrome on Android).

* **iOS (Safari):** Tap the Share button, then scroll down and tap "Add to Home Screen".
* **Android (Chrome):** An "Install App" banner should appear at the bottom. Alternatively, tap the three dots menu and select "Install app" or "Add to Home screen".

## License

This project is open-source and available under the MIT License. Feel free to fork, modify, and use it for your own family!
