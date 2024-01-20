import EditIcon from "@assets/icons/Edit.svg";
import DeleteIcon from "@assets/icons/delete.png";
import SaveIcon from "@assets/icons/save.png";
import CancelIcon from "@assets/icons/cancel.png";

import courseData from "@data/course_data.json";
import { updateFooter } from "./updateFooter";

var termBox = document.getElementsByClassName("term");
var codeBox = document.getElementsByClassName("code");
var titleBox = document.getElementsByClassName("title");
var gradeBox = document.getElementsByClassName("grade");

var editCourseBtns = document.getElementsByClassName("editCourse");
var deleteCourseBtns = document.getElementsByClassName("deleteCourse"); ("attempt-credits");
var categoryFields = {};
["E1", "E2", "E3", "E4"].map(
    (category) =>
        (categoryFields[category] = document.getElementById(category))
)

var selectedCourses = { ...(JSON.parse(localStorage.getItem('selectedCourses')) || []) };
const GRADES = [
    "A",
    "A-",
    "B+",
    "B",
    "B-",
    "C+",
    "C",
    "C-",
    "D+",
    "D",
    "F",
    "P",
    "NP",
]


for (let i = 0; i < editCourseBtns.length; i++) {
    function deleteCourse() {
        if ((termBox[i].textContent != " Term ") && confirm("Are you sure you want to delete this course?")) {
            termBox[i].textContent = "Term";
            codeBox[i].textContent = "Course Code";
            titleBox[i].textContent = "Course Name";
            gradeBox[i].textContent = "Grade";

            if (selectedCourses[i]) {
                delete selectedCourses[i];
                localStorage["selectedCourses"] = JSON.stringify(Object.values(selectedCourses));
            }

            updateFooter();
        }
    }

    function createSelect(optionList: Array<string>, defaultVal?: string, infoText?: string, optionDisplayFunc?: Function, onChange?: Function) {
        let options = ""
        optionList.forEach((option) => {
            let optionName = optionDisplayFunc ? optionDisplayFunc(option) : option;
            let optionHTML = `<option value=${option}>${optionName}</option>`;
            options = options + optionHTML + "\n";
        });

        let selectElement = document.createElement("select");
        selectElement.innerHTML = ""
        if (infoText) {
            selectElement.innerHTML = `<option value=Default disabled hidden> ${infoText} </option>\n`;
        }
        selectElement.innerHTML += options;
        if (defaultVal) {
            selectElement.querySelector(`option[value="${defaultVal}"]`).setAttribute("selected", "selected");
        }

        if (onChange) {
            selectElement.addEventListener("change", () => onChange());
        }

        return selectElement
    }

    function saveCourse() {
        const termSelect = termBox[i].getElementsByTagName("select")[0] as HTMLSelectElement;
        const codeSelect = codeBox[i].getElementsByTagName("select")[0] as HTMLSelectElement;
        const gradeSelect = gradeBox[i].getElementsByTagName("select")[0] as HTMLSelectElement;

        if (termSelect.value == "Default") {
            termBox[i].textContent = "Term";
            return;
        }

        if (codeSelect && codeSelect.value == "Default") {
            termBox[i].textContent = "Term";
            codeBox[i].textContent = "Course Code";
            return;
        }

        selectedCourses[i] = { "term": termSelect.value, "code": codeSelect.value, "grade": gradeSelect.value };
        localStorage["selectedCourses"] = JSON.stringify(Object.values(selectedCourses));

        termBox[i].removeChild(termSelect);
        termBox[i].textContent = termSelect.value != "Default" ? termSelect.value.split("_").slice(1, 3).join(" ") : "Term";
        codeBox[i].removeChild(codeSelect);
        codeBox[i].textContent = codeSelect.value;
        gradeBox[i].removeChild(gradeSelect);
        gradeBox[i].textContent = gradeSelect.value;
    }

    function editCourse() {
        const editIcon = editCourseBtns[i].getElementsByTagName("img")[0];
        const delIcon = deleteCourseBtns[i].getElementsByTagName("img")[0];

        let currentValue = {
            term: termBox[i].textContent,
            code: codeBox[i].textContent,
            title: titleBox[i].textContent,
            grade: gradeBox[i].textContent,
        }

        function cancelEdit() {
            console.log("test");
            termBox[i].textContent = currentValue["term"];
            codeBox[i].textContent = currentValue["code"];
            titleBox[i].textContent = currentValue["title"];
            gradeBox[i].textContent = currentValue["grade"];

            editIcon.src = EditIcon.src;
            delIcon.src = DeleteIcon.src;

            deleteCourseBtns[i].addEventListener("click", deleteCourse);
            deleteCourseBtns[i].removeEventListener("click", cancelEdit);
        }

        let isInEdit = editIcon.src.indexOf(SaveIcon.src) != -1
        if (isInEdit) {
            editIcon.src = EditIcon.src;
            delIcon.src = DeleteIcon.src;

            saveCourse();
            updateFooter();
            
            deleteCourseBtns[i].addEventListener("click", deleteCourse);
            deleteCourseBtns[i].removeEventListener("click", cancelEdit);
        } else {
            editIcon.src = SaveIcon.src;
            delIcon.src = CancelIcon.src;

            let codeOnChange = (courseTitle: string) => {
                titleBox[i].textContent = courseTitle;

                let gradeSelect = createSelect(GRADES);
                gradeBox[i].textContent = "";
                gradeBox[i].appendChild(gradeSelect);
            }
            let termOnChange = (codes) => {
                titleBox[i].textContent = "Course Name";

                let codeSelect = createSelect(Object.keys(codes), "Default", "Choose a course...", undefined, () => codeOnChange(codes[codeSelect.value].name));
                codeBox[i].textContent = "";
                codeBox[i].appendChild(codeSelect);
            }

            let isNew = termBox[i].textContent.trim() == "Term";
            if (isNew) {
                let terms = Object.keys(courseData);
                let termSelect = createSelect(terms, "Default", "Choose a term...", (term: string) => term.split("_").slice(1, 3).join(" "), () => termOnChange(courseData[termSelect.value]));
                termBox[i].textContent = "";
                termBox[i].appendChild(termSelect);
            } else {
                let terms = Object.keys(courseData);
                let termSelect = createSelect(terms, selectedCourses[i].term, undefined, (term: string) => term.split("_").slice(1, 3).join(" "), termOnChange);
                termBox[i].textContent = "";
                termBox[i].appendChild(termSelect);

                let codes = Object.keys(courseData[selectedCourses[i].term]);
                let codeSelect = createSelect(codes, selectedCourses[i].code, undefined, undefined, () => codeOnChange(codes[codeSelect.value].name));
                codeBox[i].textContent = "";
                codeBox[i].appendChild(codeSelect);

                let gradeSelect = createSelect(GRADES, selectedCourses[i].grade);
                gradeBox[i].textContent = "";
                gradeBox[i].appendChild(gradeSelect);
            }

            deleteCourseBtns[i].addEventListener("click", cancelEdit);
            deleteCourseBtns[i].removeEventListener("click", deleteCourse);
        }
    }

    deleteCourseBtns[i].addEventListener("click", deleteCourse);
    editCourseBtns[i].addEventListener("click", editCourse);
}