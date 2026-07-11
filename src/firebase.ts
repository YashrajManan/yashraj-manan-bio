import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBqmT6cG-Ic1jqUiO5SqRb8WJ8Y4bL7PAI',
  authDomain: 'yashrajmananbio.firebaseapp.com',
  projectId: 'yashrajmananbio',
  storageBucket: 'yashrajmananbio.firebasestorage.app',
  messagingSenderId: '925288925690',
  appId: '1:925288925690:web:2bb40cc546798c88f7fc43',
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
