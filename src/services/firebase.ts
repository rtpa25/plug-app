/** @format */

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_APP_ID,
//   measurementId: process.env.REACT_APP_MEASUREMENT_ID,
//   databaseURL: process.env.REACT_APP_DATABASE_URL,
// };

const firebaseConfig = {
  apiKey: 'AIzaSyCSIdYPRQLUTyGh8XU6lz8FgiaySk9FjS0',
  authDomain: 'plug-app-task.firebaseapp.com',
  databaseURL:
    'https://plug-app-task-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'plug-app-task',
  storageBucket: 'plug-app-task.appspot.com',
  messagingSenderId: '334529153973',
  appId: '1:334529153973:web:0fc5be9536a9ecbad6e7fc',
  measurementId: 'G-NNXK7JS5ET',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const provider = new GoogleAuthProvider();
export const auth = getAuth();
export const db = getDatabase(app);
