import { useEffect, useState, type ChangeEvent } from "react"

type Option = {
    label: string;
    value: string;
};

export const SelectableCell = ({ initialValue, rowIdx, editedRows, column, columnKey, updateData }) => {
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
        updateData(rowIdx, columnKey, value, e.target.validity.valid);
    }

    const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        displayValidationMessage(e);
        if (e.target.value === "")
            return;
        setValue(e.target.value);
        updateData(rowIdx, columnKey, e.target.value, e.target.validity.valid);
    }


    if (editedRows[rowIdx]) {
        return column.meta?.type === "select" ?
            <select
                className="text-text font-montserrat text-xl font-medium text-center"
                onChange={onSelectChange}
                value={initialValue}
                required={column.meta.required}
            >
                {
                    column.meta.options?.map((option: Option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))
                }
            </select>
            // : <input
            //     className="text-text font-montserrat text-xl font-medium text-center"
            //     value={value}
            //     onChange={e => setValue(e.target.value)}
            //     onBlur={onBlur}
            //     type={column.meta?.type || "text"}
            //     title={validationMessage}
            //     required={column.meta?.required}
            // />
            : <span className="text-text font-montserrat text-xl font-medium">{value}</span>
    }

    return <span className="text-text font-montserrat text-xl font-medium">{value}</span>
}