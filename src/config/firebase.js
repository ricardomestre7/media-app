// src/config/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCArBRGfyMZZZMEiLPpV8komixun5fhEdM",
  authDomain: "mediahub-app-338dc.firebaseapp.com",
  projectId: "mediahub-app-338dc",
  storageBucket: "mediahub-app-338dc.firebasestorage.app",
  messagingSenderId: "703747835447",
  appId: "1:703747835447:web:6dcd602bd22610cd7b21b2",
  measurementId: "G-2CEREZHDY"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize services
export const auth = getAuth(app)
export const db = getFirestore(app)

console.log('🔥 Firebase initialized successfully!')

// Auth helpers
export const authService = {
  signIn: async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password)
  },
  
  signUp: async (email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password)
  },
  
  signOut: async () => {
    return await signOut(auth)
  }
}

// Database helpers
export const dbService = {
  // Add document to collection
  add: async (collectionName, data) => {
    return await addDoc(collection(db, collectionName), data)
  },
  
  // Get all documents from collection
  getAll: async (collectionName) => {
    const querySnapshot = await getDocs(collection(db, collectionName))
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  },
  
  // Get documents with query
  getWhere: async (collectionName, field, operator, value) => {
    const q = query(collection(db, collectionName), where(field, operator, value))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  }
}

export default app