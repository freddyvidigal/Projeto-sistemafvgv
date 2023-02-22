import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

let firebaseConfig = {
    apiKey: "AIzaSyA97OGr3mDuj-NuMyjZlQ1Qm0EN8wmE_oE",
    authDomain: "sistemafvgv.firebaseapp.com",
    projectId: "sistemafvgv",
    storageBucket: "sistemafvgv.appspot.com",
    messagingSenderId: "390255297666",
    appId: "1:390255297666:web:fc350ab3bc4a8961d0609b",
    measurementId: "G-6QDFPQ1DRY"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase;