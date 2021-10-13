import firebase from "firebase/app";
import 'firebase/storage'


const firebaseConfig = {
    apiKey: "AIzaSyCTuOy7C5QJHa5gWxcp3wrXX13IK_51TrQ",
    authDomain: "sportmix-fa65a.firebaseapp.com",
    projectId: "sportmix-fa65a",
    storageBucket: "sportmix-fa65a.appspot.com",
    messagingSenderId: "612145061725",
    appId: "1:612145061725:web:0ee65fba8ace506f5f12b4",
    measurementId: "G-CEWSX7YPK6"
  };
  
  firebase.initializeApp(firebaseConfig);
  
  const storage = firebase.storage();
  
  export {storage, firebase as default};