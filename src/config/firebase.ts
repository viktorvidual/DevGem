import { Auth, getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { Database, getDatabase } from "firebase/database";
import { FirebaseStorage, getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIuJOdAUEKhvZx3oLHD0OrvTj4Qi5gNh4",
  authDomain: "unknown-adonis.firebaseapp.com",
  databaseURL: "https://unknown-adonis-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "unknown-adonis",
  storageBucket: "unknown-adonis.appspot.com",
  messagingSenderId: "80084686046",
  appId: "1:80084686046:web:9502263e2b70af4a1a1e4f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth: Auth  = getAuth(app);
export const database: Database = getDatabase(app);
export const storage: FirebaseStorage = getStorage();
export default app;

