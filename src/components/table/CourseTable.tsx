import { useState } from "react";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { SelectableCell } from "./SelectableCell";
import { EditCell } from "./EditCell";
import { FooterCell } from "./FooterCell";

type Course = {
    term: string,
    courseID: string,
    title: string,
    grade: string,
};

const defaultData: Course[] = [
    {
        term: "Fall 2021",
        courseID: "CS 3150",
        title: "Data Structures and Algorithms",
        grade: "B",
    },
    {
        term: "Fall 2021",
        courseID: "CS 3350",
        title: "Database Systems",
        grade: "C",
    },
    {
        term: "Fall 2021",
        courseID: "CS 3500",
        title: "Computer Architecture",
        grade: "A-",
    },
    {
        term: "Fall 2021",
        courseID: "CS 3610",
        title: "Operating Systems",
        grade: "D",
    },
    {
        term: "Fall 2021",
        courseID: "CS 3850",
        title: "Computer Networks",
        grade: "F",
    },
    {
        term: "Fall 2021",
        courseID: "CS 3860",
        title: "Computer Security",
        grade: "A",
    },
];
const columnHelper = createColumnHelper<Course>();
const columns = [
    columnHelper.accessor("term", {
        header: "Term",
        cell: SelectableCell,
        meta: {
            type: "text",
        }
    }),
    columnHelper.accessor("courseID", {
        header: "Course ID",
        cell: SelectableCell,
        meta: {
            type: "text",
        }
    }),
    columnHelper.accessor("title", {
        header: "Course Name"
    }),
    columnHelper.accessor("grade", {
        header: "Grade",
        cell: SelectableCell,
        meta: {
            type: "select",
            options: [
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
            ]
        }
    }),
    columnHelper.display({
        id: "edit",
        cell: EditCell
    })
];

export const CourseTable = () => {
    const [data, setData] = useState(() => [...defaultData]);
    const [originalData, setOriginalData] = useState(() => [...defaultData]);
    const [editedRows, setEditedRows] = useState({});
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        meta: {
            editedRows,
            setEditedRows,
            revertData: (rowIndex: number, revert: boolean) => {
                if (revert) {
                    setData((old) =>
                        old.map((row, index) =>
                            index === rowIndex ? originalData[rowIndex] : row
                        )
                    );
                } else {
                    setOriginalData((old) =>
                        old.map((row, index) => (index === rowIndex ? data[rowIndex] : row))
                    );
                }
            },
            updateData: (rowIndex: number, columnId: string, value: string) => {
                setData((old) =>
                    old.map((row, index) => {
                        if (index === rowIndex) {
                            return {
                                ...old[rowIndex],
                                [columnId]: value,
                            };
                        }
                        return row;
                    })
                );
            },
            addRow: () => {
                const newRow: Course = {
                    term: "",
                    courseID: "",
                    title: "",
                    grade: "",
                };
                const setFunc = (old: Course[]) => [...old, newRow];
                setData(setFunc);
                setOriginalData(setFunc);
            }
        },
    });
    return (
        <div className="flex flex-col h-full w-full">
            <div className="overflow-x-auto h-full w-full">
                <div className="inline-block align-middle h-full w-full">
                    <div className="rounded-xl overflow-hidden h-full w-full">
                        <table className="bg-highlight table-auto h-full w-full">
                            <thead className="bg-action">
                                {
                                    table.getHeaderGroups().map((headerGroup) => (
                                        <tr key={headerGroup.id}>
                                            {
                                                headerGroup.headers.map((header) => (
                                                    <th
                                                        key={header.id}
                                                        scope="col"
                                                        className="text-highlight p-4 font-montserrat text-2xl font-semibold text-center"
                                                    >
                                                        {
                                                            header.isPlaceholder
                                                                ? null
                                                                : flexRender(
                                                                    header.column.columnDef.header,
                                                                    header.getContext()
                                                                )
                                                        }
                                                    </th>
                                                ))
                                            }
                                        </tr>
                                    ))
                                }
                            </thead>
                            <tbody className="bg-highlight">
                                {
                                    table.getRowModel().rows.map((row) => (
                                        <tr key={row.id}>
                                            {
                                                row.getVisibleCells().map((cell) => (
                                                    <td key={cell.id} className="text-text p-4 font-montserrat text-xl font-medium text-center">
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </td>
                                                ))
                                            }
                                        </tr>
                                    ))
                                }
                            </tbody>
                            <tfoot className="bg-action">
                                <tr>
                                    <th colSpan={table.getCenterLeafColumns().length} align="right">
                                        <FooterCell table={table} />
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