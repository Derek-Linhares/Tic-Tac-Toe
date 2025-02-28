//asdasfasf

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB64BNqgaBaLgb8QYxpF3sy4FfP6IdTmJI",
  authDomain: "jogo-da-velha-80s.firebaseapp.com",
  databaseURL: "https://jogo-da-velha-80s-default-rtdb.firebaseio.com",
  projectId: "jogo-da-velha-80s",
  storageBucket: "jogo-da-velha-80s.firebasestorage.app",
  messagingSenderId: "743364593682",
  appId: "1:743364593682:web:f0eeeb596d9abfa9e670cb",
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const gamesRef = database.ref("games");
