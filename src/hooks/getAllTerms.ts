import { useEffect, useState } from "react";
import useCourses from "./getCourses";

const useTerms = () => {
    const { courseData, isLoading } = useCourses();
    const [terms, setTerms] = useState([]);

    const termIdToTermName = (termID: string) => {
        const words = termID.split("_")
        return words[1] + " " + words[2]
    }

    useEffect(() => {
        if (isLoading === false) {
            const allTerms = Object.keys(courseData).map((termID) => ({
                value: termIdToTermName(termID),
                label: termIdToTermName(termID),
            }))

            if (allTerms.length > 0) {
                setTerms(allTerms);
            }
        }
    }, [isLoading]);

    return terms;
}

export default useTerms;