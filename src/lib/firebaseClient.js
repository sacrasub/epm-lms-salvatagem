import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, push, serverTimestamp } from 'firebase/database';

// Configuração do Firebase
// Pode ser alimentada por variáveis de ambiente ou pelo objeto direto
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "epm-marinha.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://epm-marinha-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "epm-marinha",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "epm-marinha.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

export const isFirebaseConfigured = () => {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.apiKey.length > 5);
};

let app = null;
let db = null;

try {
  if (isFirebaseConfigured()) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getDatabase(app);
  }
} catch (e) {
  console.warn('[Firebase] Inicialização pendente de credenciais completas:', e);
}

export { app, db, ref, set, onValue, push, serverTimestamp, firebaseConfig };
