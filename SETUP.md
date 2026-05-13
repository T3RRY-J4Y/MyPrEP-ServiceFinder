# MyPrEP React — Setup & Security Guide

## Project Structure
```
myprep-react/
├── public/
│   ├── img/           ← all site images
│   ├── css/style.css  ← original stylesheet (unchanged)
│   └── pdfs/          ← all PDF files
├── src/
│   ├── firebase.js    ← Firebase init (reads from .env)
│   ├── context/
│   │   └── AuthContext.jsx  ← auth state across the app
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── FaqCta.jsx
│   │   └── CloudLayer.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Methods.jsx
│   │   ├── PvPvA.jsx
│   │   ├── Resources.jsx   ← loads from Firestore
│   │   ├── Training.jsx
│   │   ├── Faqs.jsx
│   │   └── admin/
│   │       ├── AdminLogin.jsx
│   │       └── AdminDash.jsx
│   ├── data/
│   │   └── faqs.js     ← FAQ content
│   └── main.jsx
├── .env.example        ← copy to .env, fill in values
├── firestore.rules     ← paste into Firebase Console
├── vite.config.js
└── index.html          ← includes Content-Security-Policy
```

---

## Step 1 — Install & Run Locally

```bash
cd myprep-react
npm install
cp .env.example .env   # fill in your Firebase values
npm run dev            # runs on http://localhost:5173
```

---

## Step 2 — Firebase Setup (same as before)

1. **Create project** at console.firebase.google.com
2. **Enable Email/Password Auth** → add your admin user
3. **Create Firestore** in production mode
4. **Paste Firestore Rules** from `firestore.rules` into the Firebase Console → Firestore → Rules → Publish
5. **Register web app** → copy config → paste into `.env`

---

## Step 3 — App Check (blocks requests from outside your domain)

In Firebase Console → **App Check** → Register your web app:
- Choose **reCAPTCHA v3**
- Copy the site key → add to `.env` as `VITE_RECAPTCHA_SITE_KEY`
- Also copy the reCAPTCHA **secret key** into Firebase App Check

Once enabled, **enforce App Check** on Firestore in the Firebase Console.

During local dev: open browser console and run:
```js
self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
```
Firebase will log a debug token — add it to App Check Console for local testing.

---

## Step 4 — Build for Production

```bash
npm run build   # outputs to dist/
```

Upload the `dist/` folder to your host (same as you upload HTML files now).

---

## Step 5 — Seed Existing Resources

After deploying, go to `/admin/login`, sign in, and re-enter all resources from the original page.

Or use Firebase Console → Firestore → Create documents in the `resources` collection with fields:
- `title` (string)
- `url` (string) — e.g. `/pdfs/MyDoc.pdf`
- `tab` (string) — `policy` | `job-aids` | `iec` | `community`
- `tags` (array) — e.g. `["oral"]`
- `createdAt` (timestamp)

---

## Security Layers in This Setup

| Layer | What it does |
|---|---|
| **`.env` file** | Config never in source code. Values not exposed in git. |
| **Vite build** | `VITE_` vars are inlined at build time — only what's needed ships |
| **Content-Security-Policy** | Browser blocks connections to any domain not in your allowlist |
| **`sourcemap: false`** | No source maps in production — attacker can't read your React code |
| **Firebase App Check** | Only your registered domain/app can make Firebase requests |
| **Firebase Auth** | Write operations require a valid logged-in admin session |
| **Firestore Rules** | Server-enforced: reads open, writes require auth + App Check |
| **React Router guard** | `/admin` route redirects to login if not authenticated |
| **No hardcoded secrets** | Zero credentials in code |

---

## Admin Panel

- **URL**: `yoursite.com/admin`  (redirects to `/admin/login` if not signed in)
- The route is protected server-side by Firestore rules AND client-side by React Router
- Even if someone navigates directly to `/admin`, Firebase rejects any write operations

---

## Deploying to Firebase Hosting (optional, free)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # set public dir to "dist", SPA: yes
npm run build
firebase deploy
```

This gives you `yourproject.web.app` with automatic HTTPS.
