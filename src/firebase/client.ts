import { initializeApp } from "firebase/app";
import firebaseConfig from "./credentials.json";
import { getDatabase } from "firebase/database";

const app = initializeApp(firebaseConfig);

export default getDatabase(app);