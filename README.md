# MyPrEP React

HIV prevention information site built with React + Vite + Firebase.

---

## Running on GitHub Codespaces

### Step 1 — Push to GitHub

If you haven't already:
```bash
git init
git add .
git commit -m "Initial commit"
# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2 — Open in Codespaces

On your GitHub repo page:
- Click the green **Code** button
- Select the **Codespaces** tab
- Click **Create codespace on main**

The container will build automatically and run `npm install`.

### Step 3 — Add your Firebase secrets

**Recommended: Codespaces Secrets (most secure)**

1. Go to **github.com → Settings → Codespaces → Secrets**
2. Add each of these secrets:

| Secret name | Where to find it |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase Console → Project Settings → Your apps |
| `VITE_FIREBASE_AUTH_DOMAIN` | Same |
| `VITE_FIREBASE_PROJECT_ID` | Same |
| `VITE_FIREBASE_STORAGE_BUCKET` | Same |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Same |
| `VITE_FIREBASE_APP_ID` | Same |
| `VITE_RECAPTCHA_SITE_KEY` | Firebase Console → App Check |

3. Restart your Codespace after adding secrets (they load at container start)

**Alternative: .env file**

In the Codespaces terminal:
```bash
cp .env.example .env
# Then edit .env with your values — it is gitignored
```

### Step 4 — Start the dev server

In the Codespaces terminal:
```bash
npm run dev
```

A popup will appear offering to **Open in Browser** — click it.
Or go to the **Ports** tab and click the 🌐 icon next to port 5173.

Your site will be live at a URL like:
`https://your-codespace-name-5173.app.github.dev`

---

## Firebase Setup (one-time)

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a project
3. **Authentication** → Enable Email/Password → Add your admin user
4. **Firestore Database** → Create in production mode
5. **Firestore Rules** → Paste contents of `firestore.rules` → Publish
6. **Project Settings** → Your apps → Register web app → copy config values
7. **App Check** → Register app with reCAPTCHA v3 → copy site key

---

## Pages & Routes

| Route | Page |
|---|---|
| `/` | Home |
| `/methods` | HIV Prevention Methods |
| `/pvpva` | PrEP vs PEP vs ART |
| `/resources` | Resources (loads from Firestore) |
| `/training` | Training |
| `/faqs` | FAQs |
| `/admin/login` | Admin login |
| `/admin` | Admin CMS (protected — login required) |

---

## Build for production

```bash
npm run build
# Output is in dist/ — upload this folder to your host
```
