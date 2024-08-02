import {atom} from "nanostores";

export const tableData = atom([]);
export function setTableData(data) {
    tableData.set(data);
}