import courseData from "@data/course_data.json";

var earnCreditField = document.getElementById("earn-credits");
var attemptCreditField = document.getElementById("attempt-credits");
var coreField = document.getElementById("cores");
var gpaField = document.getElementById("gpa");
var categoryFields = {};
["E1", "E2", "E3", "E4", "EL"].map(
    (category) =>
        (categoryFields[category] = document.getElementById(category))
);

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

export function updateFooter() {
    let selectedCourses = JSON.parse(localStorage["selectedCourses"])

    earnCreditField.textContent = selectedCourses
        .map((course) => {
            if ([...SPECIAL_GRADES, "F"].includes(course.grade)) {
                return 0;
            }
            return courseData[course.term][course.code]["credit"];
        })
        .reduce((total, credit) => total + credit, 0);

    attemptCreditField.textContent = selectedCourses
        .map((course) => courseData[course.term][course.code]["credit"])
        .reduce((total, credit) => total + credit, 0);

    coreField.textContent = selectedCourses.reduce(
        (total, course) =>
            total +
            (courseData[course.term][course.code]["category"].includes("CORE") &&
                ![...SPECIAL_GRADES, "F"].includes(course.grade)),
        0
    );

    let courseGPAMap = new Map(selectedCourses.map(course => [course.code, course]));

    for (let course of selectedCourses) {

        if (GRADES[course.grade] > GRADES[courseGPAMap.get(course.code)["grade"]])
            courseGPAMap.set(course["code"], course);
    }

    let removeRepeated = [...courseGPAMap.values()];
    gpaField.textContent = (
        removeRepeated.reduce(
            (total, course) => {
                if (SPECIAL_GRADES.includes(course.grade))
                    return total;
                return total + GRADES[course.grade] * courseData[course.term][course.code]["credit"];
            },
            0
        ) / parseInt(attemptCreditField.textContent)
    ).toFixed(2);

    for (let [category, field] of Object.entries(categoryFields)) {
        field.textContent = selectedCourses.reduce(
            (total, course) =>
                total + courseData[course.term][course.code]["category"].includes(category),
            0
        );
    }
}