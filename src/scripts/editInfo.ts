import EditIcon from "@assets/icons/Edit.svg";
import SaveIcon from "@assets/icons/save.png";

var editInfoBtns = document.getElementsByClassName("editInfo");
var editableValues = document.getElementsByClassName("editableValue");

for (let i = 0; i < editInfoBtns.length; i++) {
	editInfoBtns[i].addEventListener("click", (e) => {
		let editableVal = editableValues[i] as HTMLElement;
		let icon = editInfoBtns[i].getElementsByTagName("img")[0];
		if (editableVal.contentEditable == "true") {
			icon.src = EditIcon;
			editableVal.contentEditable = "false";
		} else {
			icon.src = SaveIcon;
			editableVal.contentEditable = "true";
			editableVal.focus();
		}
	});
}