import { EditCell } from "./EditCell"
import { SelectableCell } from "./SelectableCell"

export const CourseRow = ({ row, rowIdx, editedRows, setEditedRows, revertData, columns, updateData, updateRow, validRows }) => {
    return (
        <tr key={rowIdx}>
            {
                Object.entries(row).map(([key, value]) => (
                    <td
                        key={key}
                        className="text-text p-4 font-montserrat text-xl font-medium text-center"
                    >
                        {editedRows[rowIdx] ?
                            <SelectableCell
                                key={rowIdx}
                                initialValue={value}
                                rowIdx={rowIdx}
                                editedRows={editedRows}
                                column={columns[key]}
                                columnKey={key}
                                updateData={updateData}
                            />
                            : String(value)}
                    </td>
                ))
            }
            <td className="p-4">
                <EditCell
                    rowIdx={rowIdx}
                    editedRows={editedRows}
                    revertData={revertData}
                    setEditedRows={setEditedRows}
                    updateRow={updateRow}
                    validRow={validRows[rowIdx]}
                />
            </td>
        </tr>
    )
}