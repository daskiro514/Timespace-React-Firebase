import firebase from 'firebase';

var firebaseConfig = {  
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
}

firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;