import firebase from 'firebase';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,

  authDomain: process.env.REACT_APP_AUTH_DOMAIN,

  databaseURL: process.env.REACT_APP_DATABASEURL,

  projectId: process.env.REACT_APP_AUTH_PROJECT_ID,

  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,

  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,

  appId: process.env.REACT_APP_APP_ID,
};

firebase.initializeApp(config);
export const auth = firebase.auth();
export const db = firebase.database();
