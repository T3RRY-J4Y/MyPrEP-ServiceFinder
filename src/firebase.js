// ─────────────────────────────────────────────────────────────
//  Firebase initialisation
//  All values come from environment variables (VITE_ prefix).
//  Never hard-code keys here — put them in your .env file.
// ─────────────────────────────────────────────────────────────
import { initializeApp } from "firebase/app";
import { getAuth }       from "firebase/auth";
import { getFirestore,
         enableIndexedDbPersistence } from "firebase/firestore";
import { initializeAppCheck,
         ReCaptchaV3Provider }        from "firebase/app-check";

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);

// ── App Check (blocks requests from outside your domain) ──────
// Set VITE_RECAPTCHA_SITE_KEY in your .env file
// In dev, set self.FIREBASE_APPCHECK_DEBUG_TOKEN = true in console
if (import.meta.env.VITE_RECAPTCHA_SITE_KEY) {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_SITE_KEY),
    isTokenAutoRefreshEnabled: true,
  });
}

// ── Offline persistence (reads cached when no internet) ───────
enableIndexedDbPersistence(db).catch(() => {});
