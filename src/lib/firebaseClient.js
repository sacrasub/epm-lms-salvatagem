import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, push, serverTimestamp, query, orderByChild } from 'firebase/database';

// Configuração oficial do Firebase EPM Marinha
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ""
};

export const isFirebaseConfigured = () => {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.apiKey.startsWith("AIza"));
};

let app = null;
let db = null;

try {
  if (isFirebaseConfigured()) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getDatabase(app);
    console.log('[Firebase] Conectado com sucesso ao projeto epm-marinha!');
  }
} catch (e) {
  console.error('[Firebase Init Error]', e);
}

export { app, db, ref, set, onValue, push, serverTimestamp, query, orderByChild, firebaseConfig };
