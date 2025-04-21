// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
// import { getAnalytics } from "firebase/analytics"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDbsCqSGbydg4UbT2rQfKoTMVqdCXE_XQU',
  authDomain: 'household-1dc1b.firebaseapp.com',
  projectId: 'household-1dc1b',
  storageBucket: 'household-1dc1b.firebasestorage.app',
  messagingSenderId: '240696638645',
  appId: '1:240696638645:web:1912da87edebca9700d2fc',
  measurementId: 'G-V31KYG8FXL',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)
// export const analytics = getAnalytics(app)
