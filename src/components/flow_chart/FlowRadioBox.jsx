function FlowRadioBox({updateFlow}) {
    return (
        <div id="radio-box" className="w-full flex items-center justify-center gap-1" onChange={updateFlow}>
            <div
                className="flex items-center px-4 bg-background border border-text rounded"
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
                    className="w-full py-4 ms-2 text-sm font-medium text-text">Major</label
                >
            </div>
            <div
                className="flex items-center px-4 bg-background border border-text rounded"
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
                    className="w-full py-4 ms-2 text-sm font-medium text-text">Minor</label
                >
            </div>
        </div>
    );
}

export default FlowRadioBox;
