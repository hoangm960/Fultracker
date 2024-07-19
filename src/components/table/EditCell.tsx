import { type MouseEvent } from "react"
import EditIcon from "@assets/icons/Edit.svg"
import SaveIcon from "@assets/icons/save.png"
import CancelIcon from "@assets/icons/cancel.png"

export const EditCell = ({ rowIdx, editedRows, setEditedRows, revertData }) => {
    const setEditedRow = (e: MouseEvent<HTMLButtonElement>) => {
        const elementName = e.currentTarget.name
        if (elementName !== "edit") {
            revertData(e.currentTarget.name === "cancel")
            const copiedEditedRows = [...editedRows]
            copiedEditedRows[rowIdx] = false
            setEditedRows(copiedEditedRows)
        } else {
            const copiedEditedRows = [...editedRows]
            copiedEditedRows[rowIdx] = true
            setEditedRows(copiedEditedRows)
        }
    }

    return <div className="flex gap-5 items-center justify-center">
        {
            editedRows[rowIdx] ? (
                <div className="flex gap-5 items-center justify-center">
                    <button
                        className="bg-action h-fit rounded-2xl flex flex-row gap-5 items-center justify-center hover:shadow-2xl hover:opacity-80 min-w-fit p-2 disabled:cursor-not-allowed"
                        onClick={setEditedRow}
                        name="done"
                    >
                        <img className="h-8" src={SaveIcon.src} alt="Save" />
                    </button>
                    <button
                        className="bg-destructive h-fit rounded-2xl flex flex-row gap-5 items-center justify-center hover:shadow-2xl hover:opacity-80 min-w-fit p-2"
                        onClick={setEditedRow}
                        name="cancel"
                    >
                        <img className="h-8" src={CancelIcon.src} alt="Cancel" />
                    </button>
                </div>
            ) : (
                <button
                    className="bg-action h-fit rounded-2xl flex flex-row gap-5 items-center justify-center hover:shadow-2xl hover:opacity-80 min-w-fit p-2"
                    onClick={setEditedRow}
                    name="edit"
                >
                    <img className="h-8" src={EditIcon.src} alt="Edit" />
                </button>
            )}
    </div>
}