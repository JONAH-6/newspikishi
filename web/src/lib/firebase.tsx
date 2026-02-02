// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAEkppJ0aIOzt9C26ISw-55RdvbE0p9J_o',
  authDomain: 'spikilishi.firebaseapp.com',
  projectId: 'spikilishi',
  storageBucket: 'spikilishi.firebasestorage.app',
  messagingSenderId: '604468936916',
  appId: '1:604468936916:web:4fda18ec62347d5995bb41',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
