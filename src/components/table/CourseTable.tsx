import { useState } from "react";
import "@styles/table.css";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { TableCell } from "./TableCell";
import { EditCell } from "./EditCell";

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
        cell: TableCell,
        meta: {
            type: "text",
        }
    }),
    columnHelper.accessor("courseID", {
        header: "Course ID",
        cell: TableCell,
        meta: {
            type: "text",
        }
    }),
    columnHelper.accessor("title", {
        header: "Course Name",
        cell: TableCell,
        meta: {
            type: "text",
        }
    }),
    columnHelper.accessor("grade", {
        header: "Grade",
        cell: TableCell,
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
        },
    });
    return (
        <table className="table-auto w-full h-full text-left">
            <thead className="bg-action flex w-full rounded-xl">
                {
                    table.getHeaderGroups().map((headerGroup) => (
                        <tr className="flex mb-4 w-full" key={headerGroup.id}>
                            {
                                headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        scope="row"
                                        className="text-highlight p-4 w-1/12 font-montserrat text-2xl font-semibold"
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
            <tbody className="bg-highlight flex flex-col items-center justify-between overflow-y-scroll w-full rounded-xl h-[85%]">
                {
                    table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="flex w-full mb-4 items-center">
                            {
                                row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="num text-text p-4 w-1/12 font-montserrat text-xl font-medium">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))
                            }
                        </tr>
                    ))
                }
            </tbody>
        </table>
    );
};