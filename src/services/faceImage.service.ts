import admin from "firebase-admin";
import serviceAccountKey from "../../serviceAccountKey.json";

admin.initializeApp({
  credential: admin.credential.cert(<admin.ServiceAccount>serviceAccountKey),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const storage = admin.storage();

const uploadFile = async (file: Express.Multer.File) => {};
