function FlowRadioBox({updateFlow}) {
    return (
        <div id="radio-box" className="flex flex-col items-center justify-center gap-1" onChange={updateFlow}>
            <div
                className="flex items-center px-4 h-10 bg-action border-2 border-text rounded"
            >
                <input
                    defaultChecked
                    id="major"
                    type="radio"
                    value="major"
                    name="flow-radio"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                />
                <label
                    htmlFor="major"
                    className="w-full py-4 ms-2 text-sm font-semibold text-highlight">Major</label
                >
            </div>
            <div
                className="flex items-center px-4 h-10 bg-action border-2 border-text rounded"
            >
                <input
                    id="minor"
                    type="radio"
                    value="minor"
                    name="flow-radio"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                />
                <label
                    htmlFor="minor"
                    className="w-full py-4 ms-2 text-sm font-semibold text-highlight">Minor</label
                >
            </div>
        </div>
    );
}

export default FlowRadioBox;
