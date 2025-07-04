import { useEffect, useState } from "react";
import "@styles/table.css"
import { FooterCell } from "./FooterCell";
import useCourses from "@/hooks/getCourses";
import { CourseRow } from "./CourseRow";
import { tableData, setTableData } from "@/store/table_store";
import { useStore } from "@nanostores/react";

const originalColumns = {
    "term": {
        header: "Term",
        meta: {
            type: "select",
            options: [
                { value: '', label: 'Select A Term...' }
            ],
            required: true,
        }
    },
    "courseID": {
        header: "Course ID",
        meta: {
            type: "select",
            options: [
                { value: '', label: 'Select A Course ID...' },
            ],
            required: true,
        }
    },
    "title": {
        header: "Course Name"
    },
    "grade": {
        header: "Grade",
        meta: {
            type: "select",
            options: [
                { value: '', label: 'Select A Grade...' },
                { value: "A", label: "A" },
                { value: "A-", label: "A-" },
                { value: "B+", label: "B+" },
                { value: "B", label: "B" },
                { value: "B-", label: "B-" },
                { value: "C+", label: "C+" },
                { value: "C", label: "C" },
                { value: "C-", label: "C-" },
                { value: "D+", label: "D+" },
                { value: "D", label: "D" },
                { value: "F", label: "F" },
                { value: "W", label: "W" },
                { value: "I", label: "I" },
                { value: "P", label: "P" },
                { value: "NP", label: "NP" },
            ],
            required: true,
        }
    },
    "action": {
        header: "Actions",
    },
};

export const CourseTable = () => {
    const [data, setData] = useState([]);
    const originalData = useStore(tableData);
    const [columns, setColumns] = useState(originalColumns);
    const [editedRows, setEditedRows] = useState(Array.apply(null, data).map(() => false));
    const [validRows, setValidRows] = useState(Array.apply(null, data).map(() => false));
    const [courseData, isCourseLoaded] = useCourses();

    useEffect(() => {
        if (isCourseLoaded) {
            const allTerms = Object.keys(courseData).map((termID) => ({
                value: termID,
                label: termID.replace("_", " "),
            }));
            const tmpColumns = { ...originalColumns };
            tmpColumns.term.meta.options = [...tmpColumns.term.meta.options, ...allTerms];

            setColumns(tmpColumns);
        }
    }, [isCourseLoaded]);


    const addRow = () => {
        const newRow = {
            term: "",
            courseID: "",
            title: "",
            grade: "",
        };

        setData([...data, { ...newRow }]);
        setTableData([...originalData, { ...newRow }]);
        setEditedRows([...editedRows, true]);
    }

    const revertData = (rowIdx: number) => {
        if (originalData[rowIdx].term === "") {
            setData(old => old.filter((row, idx) => idx !== rowIdx));
            setTableData(old => old.filter((row, idx) => idx !== rowIdx));
            setEditedRows(old => old.filter((row, idx) => idx !== rowIdx));
            return;
        }

        setData([...originalData]);
    }

    const updateRow = (rowIdx: number) => {
        const tmpData = [...originalData];
        tmpData[rowIdx] = data[rowIdx];
        setTableData(tmpData);
    }

    const updateData = (rowIdx: number, columnID: string, value: string, isValid: boolean) => {
        const newData = [...data];
        newData[rowIdx][columnID] = value;

        if (columnID === "term") {
            const tmpColumns = { ...columns };
            tmpColumns["courseID"].meta.options = [
                { value: '', label: 'Select A Course ID...' },
                ...Object.keys(courseData[value]).map((courseID) => ({
                    value: courseID,
                    label: courseID.replace("_", ""),
                }))
            ];
            setColumns(tmpColumns);
        } else if (columnID === "courseID") {
            newData[rowIdx]["title"] = courseData[newData[rowIdx].term][value].name;
        }

        setData(newData);
        setValidRows(validRows.map(
            (old, idx) => idx !== rowIdx ?
                old :
                { ...old, [columnID]: isValid },
        ));
    }

    return (
        <div className="flex flex-col h-full w-full">
            <div className="overflow-x-auto h-full w-full">
                <div className="inline-block align-middle h-full w-full">
                    <div className="rounded-xl overflow-hidden h-full w-full">
                        <table className="bg-highlight table-auto h-full w-full">
                            <thead className="bg-action">
                                <tr>
                                    {
                                        Object.keys(columns).map((key) => (
                                            <th
                                                key={key}
                                                scope="col"
                                                className="text-highlight p-4 font-montserrat text-2xl font-semibold text-center"
                                            >
                                                {columns[key].header}
                                            </th>
                                        ))
                                    }
                                </tr>
                            </thead>
                            <tbody className="bg-highlight">
                                {
                                    data.map((row, index) => (
                                        <CourseRow
                                            key={index}
                                            columns={columns}
                                            row={row}
                                            rowIdx={index}
                                            editedRows={editedRows}
                                            setEditedRows={setEditedRows}
                                            revertData={revertData}
                                            updateData={updateData}
                                            updateRow={updateRow}
                                            validRows={validRows}
                                        />
                                    ))
                                }
                            </tbody>
                            <tfoot className="bg-action">
                                <tr>
                                    <th colSpan={Object.keys(columns).length} align="center">
                                        <FooterCell addRow={addRow} />
                                    </th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};