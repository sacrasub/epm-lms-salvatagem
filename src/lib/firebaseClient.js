import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, push, serverTimestamp } from 'firebase/database';

// Configuração oficial do Firebase EPM Marinha
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCTMOQBKDhwpdcO52kLZHhuH9aYa7lt1Ys",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "epm-marinha.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://epm-marinha-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "epm-marinha",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "epm-marinha.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "585840162632",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:585840162632:web:522fdd16703b1b1a48e57d",
  measurementId: "G-7X5G762689"
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

export { app, db, ref, set, onValue, push, serverTimestamp, firebaseConfig };
