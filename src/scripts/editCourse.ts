import EditIcon from "@assets/icons/Edit.svg";
import DeleteIcon from "@assets/icons/delete.png";
import SaveIcon from "@assets/icons/save.png";
import CancelIcon from "@assets/icons/cancel.png";

import courseData from "@data/course_data.json";
import flowchartData from "@data/flow_chart.json";

var termValue = document.getElementsByClassName("term");
var codeValue = document.getElementsByClassName("code");
var titleValue = document.getElementsByClassName("title");
var gradeValue = document.getElementsByClassName("grade");

var editCourseBtns = document.getElementsByClassName("editCourse");
var deleteCourseBtns = document.getElementsByClassName("deleteCourse");
var earnCreditField = document.getElementById("earn-credits");
var attemptCreditField = document.getElementById("attempt-credits");
var coreField = document.getElementById("cores");
var gpaField = document.getElementById("gpa");
var categoryFields = {};
["E1", "E2", "E3", "E4"].map(
	(category) =>
		(categoryFields[category] = document.getElementById(category))
);

var selectedCourses = [];
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
function updateFooter() {
	attemptCreditField.textContent = selectedCourses
		.map((course) => course["credit"])
		.reduce((total, credit) => total + credit, 0);

	earnCreditField.textContent = selectedCourses
		.map((course) => {
			if (!["F", "NP"].includes(course["grade"])) {
				return course["credit"];
			}
		})
		.reduce((total, credit) => total + credit, 0);

	coreField.textContent = selectedCourses.reduce(
		(total, course) =>
			total +
			(course["category"].includes("CORE") &&
				!["F", "NP"].includes(course["grade"])),
		0
	);

	gpaField.textContent = (
		selectedCourses.reduce(
			(total, course) =>
				total +
				(!["P", "NP"].includes(course["grade"])
					? course["credit"] * GRADES[course["grade"]]
					: 0),
			0
		) / parseInt(attemptCreditField.textContent)
	).toFixed(2);
	gpaField.textContent =
		gpaField.textContent == "NaN" ? "0" : gpaField.textContent;

	for (let [category, field] of Object.entries(categoryFields)) {
		(field as HTMLElement).textContent = selectedCourses.reduce(
			(total, course) =>
				total + course["category"].includes(category),
			0
		);
	}
}


for (let i = 0; i < editCourseBtns.length; i++) {
	function deleteCourse() {
		termValue[i].textContent = "Term";
		codeValue[i].textContent = "Course Code";
		titleValue[i].textContent = "Course Name";
		gradeValue[i].textContent = "Grade";
		selectedCourses.splice(i, 1);
		updateFooter();
	}
	
	function saveCourse() {
		let termSelect = termValue[i].getElementsByTagName("select")[0];
		termValue[i].removeChild(termSelect);
		termValue[i].textContent =
		termSelect.value == "Term"
		? termSelect.value
		: termSelect.value.split("_").slice(1, 3).join(" ");
		let codeSelect = codeValue[i].getElementsByTagName("select")[0];
		if (codeSelect) {
			codeValue[i].removeChild(codeSelect);
			codeValue[i].textContent = codeSelect.value;
		}
		let gradeSelect = gradeValue[i].getElementsByTagName("select")[0];
		if (gradeSelect) {
			gradeValue[i].removeChild(gradeSelect);
			gradeValue[i].textContent = gradeSelect.value;
		}
		return [termSelect, codeSelect, gradeSelect];
	}
	
	deleteCourseBtns[i].addEventListener("click", deleteCourse);

	editCourseBtns[i].addEventListener("click", (e) => {
		const editIcon = editCourseBtns[i].getElementsByTagName("img")[0];
		const delIcon = deleteCourseBtns[i].getElementsByTagName("img")[0];
		let haveSelected = false;

		if (editCourseBtns[i].classList.contains("edit")) {
			editCourseBtns[i].classList.remove("edit");
			editIcon.src = EditIcon;
			delIcon.src = DeleteIcon;
			deleteCourseBtns[i].addEventListener("click", deleteCourse);

			let [termSelect, codeSelect, gradeSelect] = saveCourse();

			let selectedCourseData =
				courseData[termSelect.value][codeSelect.value];
			selectedCourseData["grade"] = gradeSelect.value;
			if (haveSelected) {
				selectedCourses[i] = selectedCourseData;
			} else {
				selectedCourses.push(selectedCourseData);
			}
			console.log(selectedCourseData);
			updateFooter();
		} else {
			editCourseBtns[i].classList.add("edit");
			let currentValue = {
				term: termValue[i].textContent,
				code: codeValue[i].textContent,
				title: titleValue[i].textContent,
				grade: gradeValue[i].textContent,
			};

			function cancelEdit() {
				termValue[i].textContent = currentValue["term"];
				codeValue[i].textContent = currentValue["code"];
				titleValue[i].textContent = currentValue["title"];
				gradeValue[i].textContent = currentValue["grade"];

				editCourseBtns[i].classList.remove("edit");
				editIcon.src = EditIcon;
				delIcon.src = DeleteIcon;
				deleteCourseBtns[i].addEventListener("click", deleteCourse);
			}

			function getCodeSelect(courses) {
				let codeOptions = "";
				Object.keys(courses).forEach((code) => {
					let optionHTML = `<option ${codeValue[i].textContent == code && "selected"
						} value=${code}>${code}</option>`;
					codeOptions = codeOptions + optionHTML + "\n";
				});
				let codeSelect = document.createElement("select");
				codeSelect.innerHTML =
					'<option value="Course Code" disabled selected hidden> Choose a course code ...</option>\n' +
					codeOptions;
				codeValue[i].textContent = "";
				codeValue[i].appendChild(codeSelect);

				codeSelect.addEventListener("change", () => {
					titleValue[i].textContent =
						courses[codeSelect.value].name;
					getGradeSelect();
				});
			}

			function getGradeSelect() {
				let gradeOptions = "";
				Object.keys(GRADES).forEach((grade) => {
					let optionHTML = `<option ${gradeValue[i].textContent == grade && "selected"
						} value=${grade}>${grade}</option>`;
					gradeOptions = gradeOptions + optionHTML + "\n";
				});
				let gradeSelect = document.createElement("select");
				gradeSelect.innerHTML = gradeOptions;
				gradeValue[i].textContent = "";
				gradeValue[i].appendChild(gradeSelect);
			}

			editIcon.src = SaveIcon;
			delIcon.src = CancelIcon;
			(termValue[i] as HTMLElement).focus();

			let termOptions = "";
			Object.keys(courseData).forEach((term) => {
				let termName = term.split("_").slice(1, 3).join(" ");
				let isTermSelected = termValue[i].textContent == termName;
				let optionHTML = `<option ${isTermSelected && "selected"
					} value=${term}>${termName}</option>`;
				termOptions = termOptions + optionHTML + "\n";
				if (isTermSelected) {
					haveSelected = true;
				}
			});
			
			let termSelect = document.createElement("select");
			termSelect.innerHTML =
				'<option value="Term" disabled selected hidden> Choose a major ...</option>\n' +
				termOptions;
			termValue[i].textContent = "";
			termValue[i].appendChild(termSelect);

			if (haveSelected) {
				getCodeSelect(courseData[termSelect.value]);
				getGradeSelect();
			}

			termSelect.addEventListener("change", () =>
				getCodeSelect(courseData[termSelect.value])
			);

			deleteCourseBtns[i].removeEventListener("click", deleteCourse);
			deleteCourseBtns[i].addEventListener("click", cancelEdit);
		}
	});
}