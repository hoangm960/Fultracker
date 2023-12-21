import courseData from "@data/course_data.json";

var earnCreditField = document.getElementById("earn-credits");
var attemptCreditField = document.getElementById("attempt-credits");
var coreField = document.getElementById("cores");
var gpaField = document.getElementById("gpa");
var categoryFields = {};
["E1", "E2", "E3", "E4"].map(
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
    F: 0.0,
    P: 0.0,
    NP: 0.0,
};

export function updateFooter() {
    let selectedCourses = JSON.parse(localStorage["selectedCourses"])
    attemptCreditField.textContent = selectedCourses
        .map((course) => courseData[course.term][course.code]["credit"])
        .reduce((total, credit) => total + credit, 0);

    earnCreditField.textContent = selectedCourses
        .map((course) => {
            if (!["F", "NP"].includes(course.grade)) {
                return courseData[course.term][course.code]["credit"];
            }
        })
        .reduce((total, credit) => total + credit, 0);

    coreField.textContent = selectedCourses.reduce(
        (total, course) =>
            total +
            (courseData[course.term][course.code]["category"].includes("CORE") &&
                !["F", "NP"].includes(course.grade)),
        0
    );

    gpaField.textContent = (
        selectedCourses.reduce(
            (total, course) =>
                total +
                (!["P", "NP"].includes(course.grade)
                    ? courseData[course.term][course.code]["credit"] * GRADES[course.grade]
                    : 0),
            0
        ) / parseInt(attemptCreditField.textContent)
    ).toFixed(2);
    gpaField.textContent =
        gpaField.textContent == "NaN" ? "0" : gpaField.textContent;

    for (let [category, field] of Object.entries(categoryFields)) {
        (field as HTMLElement).textContent = selectedCourses.reduce(
            (total, course) =>
                total + courseData[course.term][course.code]["category"].includes(category),
            0
        );
    }
}