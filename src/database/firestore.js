import firebase from "firebase";
import firebaseConfig from "../configs/firebase.config";
const firebaseApp = firebase.initializeApp(firebaseConfig);
export default firebaseApp.firestore();
export const f = firebase.firestore;
export const storageRef = firebase.storage().ref();

const settings = { /* your settings... */ timestampsInSnapshots: true };
f().settings(settings);
