import Flow from "@components/flow_chart/Flow";
import { render } from 'react-dom';

const majorSelect = document.getElementById("major") as HTMLSelectElement;
majorSelect.addEventListener("change", () => {
    const flowBox = document.getElementById("flow-box");
    render(Flow({"major":majorSelect.value.toUpperCase()}), flowBox);
});