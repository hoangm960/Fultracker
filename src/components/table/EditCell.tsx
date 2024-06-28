import { type MouseEvent } from "react"
import EditIcon from "@assets/icons/Edit.svg"
import SaveIcon from "@assets/icons/save.png"
import CancelIcon from "@assets/icons/cancel.png"

export const EditCell = ({ row, table }) => {
    const meta = table.options.meta
    const setEditedRows = (e: MouseEvent<HTMLButtonElement>) => {
        const elementName = e.currentTarget.name
        meta?.setEditedRows((old: []) => ({
            ...old,
            [row.id]: !old[row.id],
        }))
        if (elementName !== "edit") {
            meta?.revertData(row.index, e.currentTarget.name === "cancel")
        }
    }
    return meta?.editedRows[row.id] ? (
        <div className="flex gap-5 items-center justify-center">
            <button className="bg-action h-fit rounded-2xl flex flex-row gap-5 items-center justify-center hover:shadow-2xl hover:opacity-80 min-w-fit p-2" onClick={setEditedRows} name="done">
                <img className="h-8" src={SaveIcon.src} alt="Save" />
            </button>
            <button className="bg-destructive h-fit rounded-2xl flex flex-row gap-5 items-center justify-center hover:shadow-2xl hover:opacity-80 min-w-fit p-2" onClick={setEditedRows} name="cancel">
                <img className="h-8" src={CancelIcon.src} alt="Cancel" />
            </button>
        </div>
    ) : (
        <button className="bg-action h-fit rounded-2xl flex flex-row gap-5 items-center justify-center hover:shadow-2xl hover:opacity-80 min-w-fit p-2" onClick={setEditedRows} name="edit">
            <img className="h-8" src={EditIcon.src} alt="Edit" />
        </button>
    )
}