function MajorDropdown({ updateFlow }) {
  return (
    <select
      className="bg-action rounded-lg border-solid border-text border-2 pt-[15px] pr-2.5 pb-5 pl-5 flex flex-row items-center justify-between self-stretch shrink-0 relative overflow-hidden text-highlight text-3xl text-center font-bold"
      name="major"
      id="major"
      onChange={() => updateFlow()}
    >
      <option value="" defaultChecked hidden>
        {" "}
        Choose a major ...
      </option>
      <option className="bg-background text-text font-semibold" value="cs">
        Computer Science
      </option>
      <option className="bg-background text-text font-semibold" value="math">
        Mathematics
      </option>
      <option className="bg-background text-text font-semibold" value="psy">
        Psychology
      </option>
      <option className="bg-background text-text font-semibold" value="vs">
        Vietnam Studies
      </option>
      <option className="bg-background text-text font-semibold" value="eng">
        Engineering
      </option>
      <option className="bg-background text-text font-semibold" value="is">
        Itegrated Science
      </option>
      <option className="bg-background text-text font-semibold" value="arts">
        Arts
      </option>
      <option className="bg-background text-text font-semibold" value="econ">
        Economics
      </option>
      <option className="bg-background text-text font-semibold" value="his">
        History
      </option>
      <option className="bg-background text-text font-semibold" value="lit">
        Literature
      </option>
      <option className="bg-background text-text font-semibold" value="ss">
        Social Science
      </option>
    </select>
  );
}
export default MajorDropdown;
