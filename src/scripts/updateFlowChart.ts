import Flow from "@components/flow_chart/Flow";
import { createRoot } from 'react-dom/client';

const flowBox = document.getElementById("flow-box");
const root = createRoot(flowBox);

function updateFlowChart() {
    const majorSelect = document.getElementById("major") as HTMLSelectElement;
    const flowRadios = document.querySelectorAll<HTMLInputElement>('input[name="flow-radio"]');
    let selectedFlow: string;
    flowRadios.forEach((radio) => {
        if (radio.checked) {
            selectedFlow = radio.value;
        }
    });
    root.render(Flow({ "major": majorSelect.value.toUpperCase(), "flow": selectedFlow }));
}

export default updateFlowChart;