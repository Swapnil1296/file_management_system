// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getAnalytics } = require("firebase/analytics");

const firebaseConfig = {
  apiKey: "AIzaSyC94nh38c7NNFMVL10aKPBTT3wpn3TfUDM",
  authDomain: "file-management-5a68f.firebaseapp.com",
  projectId: "file-management-5a68f",
  storageBucket: "file-management-5a68f.appspot.com",
  messagingSenderId: "361383383799",
  appId: "1:361383383799:web:c5abf92c51fdcfb07cb9f2",
  measurementId: "G-42JN1VTG63",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
module.exports = app;
