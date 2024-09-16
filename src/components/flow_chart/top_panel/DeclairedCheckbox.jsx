export default function DeclairCheckBox() {
    return (
        <div className="flex items-center px-4 bg-action border-2 border-text rounded">
            <input
                id="declair"
                type="checkbox"
                value=""
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded"
                defaultChecked
            />
            <label htmlFor="default-checkbox" className="w-full py-4 ms-2 text-lg font-semibold text-highlight">Declaired</label>
        </div>
    );
}