import AddIcon from "@assets/icons/Add_white.svg"
export const FooterCell = ({ table }) => {
    const meta = table.options.meta
    return (
        <div className="footer-buttons p-4">
            <button className="add-button w-full h-full flex items-center justify-center" onClick={meta?.addRow}>
                <img src={AddIcon.src} alt="Add" />
            </button>
        </div>
    )
}