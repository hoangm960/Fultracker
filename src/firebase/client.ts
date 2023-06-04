import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyD1P4DKoH4WRqUKLvyTjJYu2kMk3MXuWsE",
    authDomain: "fuv-webscrapper.firebaseapp.com",
    projectId: "fuv-webscrapper",
    storageBucket: "fuv-webscrapper.appspot.com",
    messagingSenderId: "637178014631",
    appId: "1:637178014631:web:b64c2fa80b06c688a62482",
    measurementId: "G-LR0W41PD19"
};

export const app = initializeApp(firebaseConfig);