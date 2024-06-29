import { useEffect, useState } from "react";
import db from "@firebase/client";
import { ref, get } from "firebase/database";

const useCourses = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
      const root = ref(db, "/");
      get(root).then((snapshot) => {
        setCourses(snapshot.val());
      });
    }, []);

    return courses;
};

export default useCourses;