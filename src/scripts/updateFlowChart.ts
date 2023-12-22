import Flow from "@components/flow_chart/Flow";
import { createRoot } from 'react-dom/client';

const majorSelect = document.getElementById("major") as HTMLSelectElement;
majorSelect.addEventListener("change", () => {
    const flowBox = document.getElementById("flow-box");
    const root = createRoot(flowBox);
    root.render(Flow({"major":majorSelect.value.toUpperCase()}));
});