// utils/firebaseAdmin.js
import admin from 'firebase-admin';

// Parse the Firebase service account JSON from the environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_REALTIMEDB_URL,
  });
} else {
  admin.app();
}

export default admin;
