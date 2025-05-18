import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyCjZhbZDc43Tc0HRpsOTnu8Fqp8K1uwDZo',
  authDomain: 'dailyboost-b5b11.firebaseapp.com',
  projectId: 'dailyboost-b5b11',
  storageBucket: 'dailyboost-b5b11.appspot.com',
  messagingSenderId: '62962341557',
  appId: '1:62962341557:web:14c74168786588aee4d0fc',
  measurementId: 'G-E33DGXRTPW'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export { auth }
export default app
