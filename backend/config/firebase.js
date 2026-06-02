const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

let bucket = null;
let db = null;

try {
  const keyPath = path.join(__dirname, '..', 'firebase-key.json');
  if (fs.existsSync(keyPath)) {
    const serviceAccount = require(keyPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: `${serviceAccount.project_id}.appspot.com`
    });
    bucket = admin.storage().bucket();
    db = admin.firestore();
    console.log("Firebase Admin initialized successfully via firebase-key.json.");
  } else if (process.env.FIREBASE_CONFIG && process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    const config = JSON.parse(process.env.FIREBASE_CONFIG);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: config.storageBucket
    });
    bucket = admin.storage().bucket();
    db = admin.firestore();
    console.log("Firebase Admin initialized successfully via ENV.");
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: `${serviceAccount.project_id}.firebasestorage.app` // new default format
    });
    bucket = admin.storage().bucket();
    db = admin.firestore();
    console.log("Firebase Admin initialized successfully via service account ENV.");
  } else {
    console.log("Firebase credentials not found. Local storage fallback will be active.");
  }
} catch (error) {
  console.error("Error initializing Firebase Admin SDK:", error);
}

module.exports = { admin, bucket, db };
