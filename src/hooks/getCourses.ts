import { useEffect, useState } from "react";
import db from "@firebase/client";
import { ref, get } from "firebase/database";

const useCourses = () => {
	const [courses, setCourses] = useState({});
	const [isSuccess, setIsSuccess] = useState(false);

	const getCourses = async () => {
		const root = ref(db, "/");
		const snapshot = await get(root);
		const tmpCourses = snapshot.val();
		const processedCourses = Object.keys(tmpCourses).reduce((termAcc, termKey) => {
			const newKey = termKey.replace("_", " ")
			termAcc[newKey] = Object.keys(tmpCourses[termKey]).reduce((courseAcc, courseKey) => {
				const newKey = courseKey.replace("_", " ")
				courseAcc[newKey] = tmpCourses[termKey][courseKey];
				return courseAcc
			}, {})

			return termAcc
		}, {})
		setCourses(processedCourses)
		setIsSuccess(true);
	}
	useEffect(() => {
		getCourses();
	}, []);

	return [courses, isSuccess];
};

export default useCourses;