import { useEffect, useState } from "react";
import "@styles/table.css"
import { SelectableCell } from "./SelectableCell";
import { EditCell } from "./EditCell";
import { FooterCell } from "./FooterCell";
import useCourses from "@/hooks/getCourses";
import useTerms from "@/hooks/getAllTerms";
import { CourseRow } from "./CourseRow";

const columns = {
    "term": {
        header: "Term",
        cell: SelectableCell,
        meta: {
            type: "select",
            required: true,
        }
    },
    "courseID": {
        header: "Course ID",
        cell: SelectableCell,
        meta: {
            type: "select",
            required: true,
        }
    },
    "title": {
        header: "Course Name"
    },
    "grade": {
        header: "Grade",
        cell: SelectableCell,
        meta: {
            type: "select",
            options: [
                { value: '', label: 'Select' },
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
        cell: EditCell
    },
};

export const CourseTable = () => {
    const [data, setData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [editedRows, setEditedRows] = useState(Array.apply(null, Array(5)).map(() => false));
    const { courseData, isLoading } = useCourses();
    const terms = useTerms();

    const addRow = () => {
        const newRow = {
            term: "1",
            courseID: "2",
            title: "3",
            grade: "4",
        };
        setData([...data, newRow]);
        setOriginalData([...originalData, newRow]);
    }

    const revertData = (revert: boolean) => {
        if (revert) {
            setData(originalData);
        } else {
            setOriginalData(data);
        }
    }

    const updateData = (rowIdx: number, columnId: string, value: string, valid: boolean) => {
        const newData = [...data];
        newData[rowIdx][columnId] = value;
        setData(newData);
    }

    return (
        <div className="flex flex-col h-full w-full">
            <div className="overflow-x-auto h-full w-full">
                <div className="inline-block align-middle h-full w-full">
                    <div className="rounded-xl overflow-hidden h-full w-full">
                        <table className="bg-highlight table-auto h-full w-full">
                            <thead className="bg-action">
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