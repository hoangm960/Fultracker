import EditIcon from "@assets/icons/Edit.svg";
import DeleteIcon from "@assets/icons/delete.png";
import SaveIcon from "@assets/icons/save.png";
import CancelIcon from "@assets/icons/cancel.png";

import courseData from "@data/course_data.json";

var termValue = document.getElementsByClassName("term");
var codeValue = document.getElementsByClassName("code");
var titleValue = document.getElementsByClassName("title");
var gradeValue = document.getElementsByClassName("grade");

var editCourseBtns = document.getElementsByClassName("editCourse");
var deleteCourseBtns = document.getElementsByClassName("deleteCourse"); ("attempt-credits");
var categoryFields = {};
["E1", "E2", "E3", "E4"].map(
    (category) =>
        (categoryFields[category] = document.getElementById(category))
)

var selectedCourses = {};
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
        termValue[i].textContent = "Term"
        codeValue[i].textContent = "Course Code"
        titleValue[i].textContent = "Course Name"
        gradeValue[i].textContent = "Grade"

        if (selectedCourses[i]) {
            delete selectedCourses[i]
        }
    }

    function createSelect(optionList: Array<string>, defaultVal?: string, infoText?: string, optionDisplayFunc?: Function, onChange?: Function) {        
        let options = ""
        optionList.forEach((option) => {
            let optionName = optionDisplayFunc ? optionDisplayFunc(option) : option
            let optionHTML = `<option value=${option}>${optionName}</option>`
            options = options + optionHTML + "\n"
        });

        let selectElement = document.createElement("select")
        selectElement.innerHTML = ""
        if (infoText) {
            selectElement.innerHTML = `<option value=Default disabled hidden> ${infoText} </option>\n`
        }
        selectElement.innerHTML += options
        if (defaultVal) {
            selectElement.querySelector(`option[value="${defaultVal}"]`).setAttribute("selected", "selected")
        }

        if (onChange) {
            selectElement.addEventListener("change", () => onChange())
        }

        return selectElement
    }

    function saveCourse() {
        let termSelect = termValue[i].getElementsByTagName("select")[0] as HTMLSelectElement
        let codeSelect = codeValue[i].getElementsByTagName("select")[0] as HTMLSelectElement
        let gradeSelect = gradeValue[i].getElementsByTagName("select")[0] as HTMLSelectElement

        selectedCourses[i] = { "term": termSelect.value, "code": codeSelect.value, "grade": gradeSelect.value }
        localStorage["selectedCourses"] = JSON.stringify(selectedCourses)

        termValue[i].removeChild(termSelect)
        termValue[i].textContent = termSelect.value.split("_").slice(1, 3).join(" ")
        if (codeSelect) {
            codeValue[i].removeChild(codeSelect);
            codeValue[i].textContent = codeSelect.value;
        }
        if (gradeSelect) {
            gradeValue[i].removeChild(gradeSelect)
            gradeValue[i].textContent = gradeSelect.value
        }
    }

    function editCourse() {
        const editIcon = editCourseBtns[i].getElementsByTagName("img")[0]
        const delIcon = deleteCourseBtns[i].getElementsByTagName("img")[0]

        let currentValue = {
            term: termValue[i].textContent,
            code: codeValue[i].textContent,
            title: titleValue[i].textContent,
            grade: gradeValue[i].textContent,
        }
        let cancelEdit = () => {
            termValue[i].textContent = currentValue["term"];
            codeValue[i].textContent = currentValue["code"];
            titleValue[i].textContent = currentValue["title"];
            gradeValue[i].textContent = currentValue["grade"];
            
            editIcon.src = EditIcon.src
            delIcon.src = DeleteIcon.src
        }
        
        let isInEdit = editIcon.src.indexOf(SaveIcon.src) != -1
        if (isInEdit) {
            editIcon.src = EditIcon.src
            delIcon.src = DeleteIcon.src
            
            saveCourse()
            deleteCourseBtns[i].removeEventListener("click", cancelEdit);
            deleteCourseBtns[i].addEventListener("click", deleteCourse);
        } else {
            editIcon.src = SaveIcon.src
            delIcon.src = CancelIcon.src
            
            let codeOnChange = (courseTitle: string) => {
                titleValue[i].textContent = courseTitle
                
                let gradeSelect = createSelect(GRADES)
                gradeValue[i].textContent = ""
                gradeValue[i].appendChild(gradeSelect)
            }
            let termOnChange = (codes) => {
                titleValue[i].textContent = "Course Name"
                
                let codeSelect = createSelect(Object.keys(codes), "Default", "Choose a course...", undefined, () => codeOnChange(codes[codeSelect.value].name))
                codeValue[i].textContent = ""
                codeValue[i].appendChild(codeSelect)
            }
            
            let isNew = termValue[i].textContent.trim() == "Term"
            if (isNew) {
                let terms = Object.keys(courseData)
                let termSelect = createSelect(terms, "Default", "Choose a term...", (term: string) => term.split("_").slice(1, 3).join(" "), () => termOnChange(courseData[termSelect.value]))
                termValue[i].textContent = ""
                termValue[i].appendChild(termSelect)
            } else {
                let terms = Object.keys(courseData)
                let termSelect = createSelect(terms, selectedCourses[i].term, undefined, (term: string) => term.split("_").slice(1, 3).join(" "), termOnChange)
                termValue[i].textContent = ""
                termValue[i].appendChild(termSelect)

                let codes = Object.keys(courseData[selectedCourses[i].term])
                let codeSelect = createSelect(codes, selectedCourses[i].code, undefined, undefined, () => codeOnChange(codes[codeSelect.value].name))
                codeValue[i].textContent = ""
                codeValue[i].appendChild(codeSelect)

                let gradeSelect = createSelect(GRADES, selectedCourses[i].grade)
                gradeValue[i].textContent = ""
                gradeValue[i].appendChild(gradeSelect)
            }
            deleteCourseBtns[i].addEventListener("click", cancelEdit);
            deleteCourseBtns[i].removeEventListener("click", deleteCourse);
        }
    }

    deleteCourseBtns[i].addEventListener("click", deleteCourse);
    editCourseBtns[i].addEventListener("click", editCourse);
}