function MajorSelect({setMajor}) {
    return (
        <select
            className="w-full bg-action rounded-lg border-solid border-text border-2 pt-[15px] pr-2.5 pb-5 pl-5 flex flex-row items-center justify-between self-stretch shrink-0 relative overflow-hidden text-highlight text-2xl text-center font-bold flex-1"
            name="major"
            id="major"
            onChange={(e) => setMajor(e.target.value)}
        >
            <option value="" defaultChecked hidden>
                {" "}
                Choose a major ...
            </option>
            <option className="bg-background text-text font-semibold" value="MATH">
                Mathematics
            </option>
            <option className="bg-background text-text font-semibold" value="ARTS">
                Arts
            </option>
            <option className="bg-background text-text font-semibold" value="CS">
                Computer Science
            </option>
            <option className="bg-background text-text font-semibold" value="ECON">
                Economics
            </option>
            <option className="bg-background text-text font-semibold" value="ENG">
                Engineering
            </option>
            <option className="bg-background text-text font-semibold" value="HIS">
                History
            </option>
            <option className="bg-background text-text font-semibold" value="IS">
                Integrated Science
            </option>
            <option className="bg-background text-text font-semibold" value="LIT">
                Literature
            </option>
            <option className="bg-background text-text font-semibold" value="PSY">
                Psychology
            </option>
            <option className="bg-background text-text font-semibold" value="SOCI">
                Social Science
            </option>
            <option className="bg-background text-text font-semibold" value="VS">
                Vietnam Studies
            </option>
        </select>
    );
}
export default MajorSelect;