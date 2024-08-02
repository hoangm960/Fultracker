import { useEffect, useState } from "react";
import { InfoField } from "./InfoField"
import { useStore } from "@nanostores/react";
import { tableData } from "@/store/table_store";
import useCourses from "@/hooks/getCourses";

export const InfoFooter = () => {
    const [infoData, setInfoData] = useState({
        earned: 0,
        attempted: 0,
        core: 0,
        gpa: 0,
        e1: 0,
        e2: 0,
        e3: 0,
        e4: 0,
        el: 0,
    });
    const $tableData = useStore(tableData);
    const GRADES = {
        A: 4.0,
        "A-": 3.7,
        "B+": 3.3,
        B: 3.0,
        "B-": 2.7,
        "C+": 2.3,
        C: 2.0,
        "C-": 1.7,
        "D+": 1.3,
        D: 1.0,
        F: 0.0
    };
    const SPECIAL_GRADES = ["P", "NP", "I", "W"];
    const [courseData, isCourseLoaded] = useCourses();

    useEffect(() => {
        if (!isCourseLoaded) {
            return;
        }

        const selectedCourses = $tableData.filter((old) => old.term !== "");
        if (selectedCourses.length === 0) {
            return;
        }

        let newInfoData = { ...infoData };

        newInfoData.earned = selectedCourses
            .map((course) => {
                if ([...SPECIAL_GRADES, "F"].includes(course.grade)) {
                    return 0;
                }
                return courseData[course.term][course.courseID]["credit"];
            })
            .reduce((total, credit) => total + credit, 0);

        newInfoData.attempted = selectedCourses
            .map((course) => courseData[course.term][course.courseID]["credit"])
            .reduce((total, credit) => total + credit, 0);

        newInfoData.core = selectedCourses.reduce(
            (total, course) =>
                total +
                (courseData[course.term][course.courseID]["level"].toLowerCase() === "core" &&
                    ![...SPECIAL_GRADES, "F"].includes(course.grade)),
            0
        );

        let courseGPAMap = new Map(selectedCourses.map(course => [course.courseID, course]));
        for (let course of selectedCourses) {
            if (GRADES[course.grade] > GRADES[courseGPAMap.get(course.courseID)["grade"]])
                courseGPAMap.set(course["code"], course);
        }

        let removeRepeated = [...courseGPAMap.values()];
        newInfoData.gpa = parseFloat((
            removeRepeated.reduce(
                (total, course) => {
                    if (SPECIAL_GRADES.includes(course.grade))
                        return total;
                    return total + GRADES[course.grade] * courseData[course.term][course.courseID]["credit"];
                },
                0
            ) / newInfoData.attempted
        ).toFixed(2));

        let categories = ["e1", "e2", "e3", "e4", "el"];
        for (let categoryKey of Object.keys(infoData)) {
            if (categories.includes(categoryKey)) {
                newInfoData[categoryKey] = selectedCourses.reduce(
                    (total, course) =>
                        total +
                        (courseData[course.term][course.courseID]["level"].toLowerCase() === "experiential learning" ?
                            (categoryKey === "el") :
                            "categories" in courseData[course.term][course.courseID] ?
                                courseData[course.term][course.courseID]["categories"]
                                    .filter(category =>
                                        category.toLowerCase() === categoryKey).length :
                                0
                        ),
                    0
                );
            }
        }

        setInfoData(newInfoData);
    }, [$tableData]);

    return (
        <div
            className="bg-highlight rounded-xl pt-8 pr-2.5 pb-8 pl-2.5 flex flex-row gap-0 items-start justify-start flex-wrap shrink-0 self-stretch"
        >
            <div
                className="flex flex-col gap-2.5 items-start justify-start flex-1 relative"
            >
                <InfoField
                    title="Earned Credits:"
                    value={infoData.earned}
                    total={128}
                />
                <InfoField
                    title="Attempted Credits:"
                    value={infoData.attempted}
                    total={128}
                />
                {/* TODO: calculate major credits
                <InfoField title="Major Credits:" value="16" total={128} /> */}
                <InfoField
                    title="Core Courses:"
                    value={infoData.core}
                    total={5}
                />
                <InfoField
                    title="GPA:"
                    value={infoData.gpa}
                    total={4}
                />
            </div>
            <div
                className="border-solid border-text border-l flex flex-col gap-2.5 items-start justify-start flex-1 relative"
            >
                <InfoField
                    title="E1 (Arts and Humanities):"
                    value={infoData.e1}
                    total={2}
                />
                <InfoField
                    title="E2 (Social Sciences):"
                    value={infoData.e2}
                    total={2}
                />
                <InfoField
                    title="E3 (Sciences and Engineering):"
                    value={infoData.e3}
                    total={2}
                />
                <InfoField
                    title="E4 (Mathematics and Computing):"
                    value={infoData.e4}
                    total={2}
                />
                <InfoField
                    title="EL (Experiential Learning):"
                    value={infoData.el}
                    total={1}
                />
            </div>
        </div>
    )
}