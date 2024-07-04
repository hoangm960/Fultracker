import { useEffect, useState } from "react";
import db from "@firebase/client";
import { ref, get } from "firebase/database";

const useCourses = () => {
	const [courses, setCourses] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const getCourses = async () => {
		setIsLoading(true);
		const root = ref(db, "/");
		const snapshot = await get(root)
		setCourses(snapshot.val());
		setIsLoading(false);
	}
	useEffect(() => {
		getCourses();
	}, []);

	return {courseData: courses, isLoading: isLoading};
};

export default useCourses;