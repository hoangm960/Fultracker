import MajorSelect from "./MajorSelect";
import DeclairCheckBox from "./DeclairedCheckbox";
import FlowTypeRadio from "./FlowTypeRadio";

export default function TopPanel({ setMajor, setFlowType, setDeclaired }) {
    return (
        <div className="w-full flex flex-row gap-1">
            <MajorSelect setMajor={setMajor} />
            <DeclairCheckBox setDeclaired={setDeclaired} />
            <div
                className="flex flex-col items-center justify-center gap-1"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFlowType(e.target.value)}
            >
                <FlowTypeRadio id="major-radio" value="major" label="Major" checked />
                <FlowTypeRadio id="minor-radio" value="minor" label="Minor" />
            </div>
        </div>
    );
}