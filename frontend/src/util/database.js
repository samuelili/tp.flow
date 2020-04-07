import config from '../config';
import firebase from 'firebase';
require('firebase/firestore');

class Database {
  static db;

  static getDatabase() {
    if (!Database.db) {
      firebase.initializeApp({
        apiKey: config.firebaseKey,
        authDomain: "hackathon-3272020.firebaseapp.com",
        databaseURL: "https://hackathon-3272020.firebaseio.com",
        projectId: "hackathon-3272020",
        storageBucket: "hackathon-3272020.appspot.com",
        messagingSenderId: "1054107141678",
        appId: "1:1054107141678:web:c2371d0ab615f1049b81bf",
        measurementId: "G-HTSFD5XXKL"
      });
      Database.db = firebase.firestore();
    }

    return Database.db;
  }
}

export default Database.getDatabase();
