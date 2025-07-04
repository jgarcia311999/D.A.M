// Importa las funciones que necesitas de los SDK de Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Tu configuración de Firebase (usa tus datos)
const firebaseConfig = {
  apiKey: "AIzaSyA62Ad-q47xEo8Qhw1zj98MbfDRZCjqlm0",
  authDomain: "dam-multiplayer.firebaseapp.com",
  projectId: "dam-multiplayer",
  storageBucket: "dam-multiplayer.appspot.com", 
  messagingSenderId: "980594721900",
  appId: "1:980594721900:web:d8995100eb79a65a564449"
};

// Inicializa Firebase solo si no está inicializado aún (buena práctica en RN)
const app = initializeApp(firebaseConfig);

// Exporta la instancia de Firestore
const db = getFirestore(app);

export { app, db };