import firebase from "firebase/app";

// Initialize Firebase
const config = {
  apiKey: "AIzaSyDh8gFuf3p9KOnEgDJBXcpsNhquecRj23I",
  authDomain: "estats-efc5c.firebaseapp.com",
  databaseURL: "https://estats-efc5c.firebaseio.com",
  projectId: "estats-efc5c",
  storageBucket: "estats-efc5c.appspot.com",
  messagingSenderId: "472094743339"
};

const settings = { timestampsInSnapshots: true };
firebase.initializeApp(config);
firebase.firestore().settings(settings);

export default firebase