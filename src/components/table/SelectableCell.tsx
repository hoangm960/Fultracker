import { useEffect, useState, type ChangeEvent } from "react"

type Option = {
    label: string;
    value: string;
};

export const SelectableCell = ({ getValue, row, column, table }) => {
    const initialValue = getValue()
    const columnMeta = column.columnDef.meta
    const tableMeta = table.options.meta
    const [value, setValue] = useState(initialValue)
    const [validationMessage, setValidationMessage] = useState("");

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue])

    const displayValidationMessage = <T extends HTMLInputElement | HTMLSelectElement>(e: ChangeEvent<T>) => {
        if (e.target.validity.valid) {
            setValidationMessage("");
        } else {
            setValidationMessage(e.target.validationMessage);
        }
    };

    const onBlur = (e: ChangeEvent<HTMLInputElement>) => {
        displayValidationMessage(e);
        tableMeta?.updateData(row.index, column.id, value, e.target.validity.valid);
    }

    const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        displayValidationMessage(e);
        setValue(e.target.value);
        tableMeta?.updateData(row.index, column.id, e.target.value, e.target.validity.valid);
        console.log(tableMeta?.getCourses(row.index));
    }

    const termIdToTermName = (termID: string) => {
        const words = termID.split("_")
        return words[1] + " " + words[2]
    }


    if (tableMeta?.editedRows[row.id]) {
        return columnMeta?.type === "select" ?
            <select
                className="text-text font-montserrat text-xl font-medium text-center"
                onChange={onSelectChange}
                value={initialValue}
                required={columnMeta?.required}
            >
                {
                    column.columnDef.header === "Term" ?
                        Object.keys(tableMeta?.courseData).map((termID: string) => (
                            <option key={termID} value={termID}>
                                {termIdToTermName(termID)}
                            </option>
                        ))
                        : columnMeta?.options?.map((option: Option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))
                }
            </select>
            : <input
                className="text-text font-montserrat text-xl font-medium text-center"
                value={value}
                onChange={e => setValue(e.target.value)}
                onBlur={onBlur}
                type={columnMeta?.type || "text"}
                required={columnMeta?.required}
            />

    }

    return <span className="text-text font-montserrat text-xl font-medium">{value}</span>
}