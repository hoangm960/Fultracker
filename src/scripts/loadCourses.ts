import courseData from "@data/course_data.json";
import { updateFooter } from "./updateFooter";
const selectedCourses = JSON.parse(localStorage.getItem('selectedCourses')) || [];

function loadCourses(courses: Array<any>) {
    const courseRows = document.querySelectorAll('.course-row');
    console.log(selectedCourses);
    
    courses.forEach((course, i) => {
        const courseRow = courseRows[i];
        const termBox = courseRow.querySelector('.term');
        const codeBox = courseRow.querySelector('.code');
        const titleBox = courseRow.querySelector('.title');
        const gradeBox = courseRow.querySelector('.grade');

        termBox.textContent = course.term.split("_").slice(1, 3).join(" ");
        codeBox.textContent = course.code;
        titleBox.textContent = courseData[course.term][course.code].name;
        gradeBox.textContent = course.grade;
        updateFooter();
    });
}


if (selectedCourses.length > 0) {
    window.addEventListener('load', () => {
        // load selected courses on start
        loadCourses(selectedCourses);
    });
}
