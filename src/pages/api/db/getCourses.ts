import db from "@firebase/client";
import { ref, get } from "firebase/database";

const root = ref(db, "/");
get(root).then((snapshot) => {
    console.log(snapshot.val());
});