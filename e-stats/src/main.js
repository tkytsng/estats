import Vue from "vue";
import App from "./App.vue";
import firebase from "firebase/app";

Vue.config.productionTip = false;

// Initialize Firebase
const config = {
  apiKey: "AIzaSyDh8gFuf3p9KOnEgDJBXcpsNhquecRj23I",
  authDomain: "estats-efc5c.firebaseapp.com",
  databaseURL: "https://estats-efc5c.firebaseio.com",
  projectId: "estats-efc5c",
  storageBucket: "estats-efc5c.appspot.com",
  messagingSenderId: "472094743339"
};
firebase.initializeApp(config);

new Vue({
  render: h => h(App)
}).$mount("#estat");
