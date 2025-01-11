export default function FlowTypeRadio(props) {
  return (
    <div className="flex items-center px-4 h-10 bg-action border-2 border-text rounded">
      <input
        defaultChecked={props.checked}
        id={props.id}
        type="radio"
        value={props.value}
        name="flow-radio"
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
      />
      <label
        htmlFor={props.id}
        className="w-full py-4 ms-2 text-sm font-semibold text-highlight"
      >
        {props.label}
      </label>
    </div>
  );
}

