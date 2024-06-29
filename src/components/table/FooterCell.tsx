import AddIcon from "@assets/icons/Add_white.svg"
export const FooterCell = ({ table }) => {
    const meta = table.options.meta
    return (
        <div className="footer-buttons p-4 flex flex-row gap-5 items-center justify-center">
            <button className="add-button" onClick={meta?.addRow}>
                <img src={AddIcon.src} alt="Add" />
            </button>
        </div>
    )
}