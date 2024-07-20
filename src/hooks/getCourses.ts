import { useEffect, useState } from "react";
import db from "@firebase/client";
import { ref, get } from "firebase/database";

const useCourses = () => {
	const [courses, setCourses] = useState([]);
	const [isSuccess, setIsSuccess] = useState(false);

	const getCourses = async () => {
		setIsSuccess(true);
		const root = ref(db, "/");
		const snapshot = await get(root)
		setCourses(snapshot.val());
		setIsSuccess(false);
	}
	useEffect(() => {
		getCourses();
	}, []);

	return [courses, isSuccess];
};

export default useCourses;