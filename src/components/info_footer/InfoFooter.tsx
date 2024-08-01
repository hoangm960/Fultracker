import { useEffect, useState } from "react";
import { InfoField } from "./InfoField"
import { useStore } from "@nanostores/react";
import { tableData } from "@/store/table_store";

export const InfoFooter = () => {
    const [infoData, setInfoData] = useState({
        earned: 0,
        attempted: 0,
        core: 0,
        gpa: 0,
        e1: 0,
        e2: 0,
        e3: 0,
        e4: 0,
        el: 0,
    });
    const $tableData = useStore(tableData);

    useEffect(() => console.log($tableData.filter((old) => old.term !== "")), [$tableData]);

    return (
        <div
            className="bg-highlight rounded-xl pt-8 pr-2.5 pb-8 pl-2.5 flex flex-row gap-0 items-start justify-start flex-wrap shrink-0 self-stretch"
        >
            <div
                className="flex flex-col gap-2.5 items-start justify-start flex-1 relative"
            >
                <InfoField
                    title="Earned Credits:"
                    value={infoData.earned}
                    total={128}
                />
                <InfoField
                    title="Attempted Credits:"
                    value={infoData.attempted}
                    total={128}
                />
                {/* TODO: calculate major credits
                <InfoField title="Major Credits:" value="16" total={128} /> */}
                <InfoField
                    title="Core Courses:"
                    value={infoData.core}
                    total={5}
                />
                <InfoField
                    title="GPA:"
                    value={infoData.gpa}
                    total={4}
                />
            </div>
            <div
                className="border-solid border-text border-l flex flex-col gap-2.5 items-start justify-start flex-1 relative"
            >
                <InfoField
                    title="E1 (Arts and Humanities):"
                    value={infoData.e1}
                    total={2}
                />
                <InfoField
                    title="E2 (Social Sciences):"
                    value={infoData.e2}
                    total={2}
                />
                <InfoField
                    title="E3 (Sciences and Engineering):"
                    value={infoData.e3}
                    total={2}
                />
                <InfoField
                    title="E4 (Mathematics and Computing):"
                    value={infoData.e4}
                    total={2}
                />
                <InfoField
                    title="EL (Experiential Learning):"
                    value={infoData.el}
                    total={1}
                />
            </div>
        </div>
    )
}