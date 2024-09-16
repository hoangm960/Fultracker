import MajorSelect from "./MajorSelect";
import DeclairCheckBox from "./DeclairedCheckbox";
import FlowTypeRadio from "./FlowTypeRadio";

export default function TopPanel() {
    return (
        <div className="w-full flex flex-row gap-1">
            <MajorSelect updateFlow={() => { }} />
            <DeclairCheckBox />
            <div id="radio-box" className="flex flex-col items-center justify-center gap-1">
                <FlowTypeRadio id="major-radio" value="major" label="Major" checked />
                <FlowTypeRadio id="minor-radio" value="minor" label="Minor" />
            </div>
        </div>
    );
}