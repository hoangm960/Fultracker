import majorData from "@data/major.json";
import MajorDropdown from "@components/flow_chart/MajorDropdown";
import FlowRadioBox from "@components/flow_chart/FlowRadioBox";
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  ConnectionMode
} from "reactflow";
import MainBlock from "./MainBlock";
import CourseBlock from "./CourseBlock";
import "reactflow/dist/style.css";
import DeclairCheckBox from "./DeclairCheckBox";
import getNodesAndEdges from "@scripts/getFlowFromMajor";
import FloatingEdge from "@components/flow_chart/FloatingEdge";
import { useState } from "react";


const proOptions = { hideAttribution: true };
const nodeTypes = { mainBlock: MainBlock, courseBlock: CourseBlock };
const edgeTypes = { floating: FloatingEdge };

function Flow({ nodes, edges }) {
  return (
    <div id="flow-box" className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        proOptions={proOptions}
        connectionMode={ConnectionMode.Loose}
      >
        <Background gap={10} size={1} />
        <Controls position="bottom-right" />
      </ReactFlow>
    </div>
  );
}

export default () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [showFlowSelection, setShowFlowSelection] = useState(false);
  const [showChartSelection, setShowChartSelection] = useState(false);

  function updateFlow(flow, chart) {
    const majorSelect = document.getElementById("major");
    const flowRadios = document.getElementsByName("flow-radio");
    const declairCheckBox = document.getElementById("declair");

    const majorValue = majorSelect.value.toUpperCase();
    if ((chart !== undefined) & (flow !== undefined)) {
      const [newNodes, newEdges] = getNodesAndEdges(
        majorData[majorValue][chart][flow]
      );
      setNodes(newNodes);
      setEdges(newEdges);

      setShowChartSelection(Object.keys(majorData[majorValue]).includes("declair"));
      setShowFlowSelection(Object.keys(majorData[majorValue][chart]).includes("minor"));
      return;
    }

    const chartOption =
      declairCheckBox ?
        declairCheckBox.checked ?
          "flow-chart"
          : "declair"
        : "flow-chart";
    setShowFlowSelection(Object.keys(majorData[majorValue][chartOption]).includes("minor"));

    let selectedFlow = "major";
    if (!showFlowSelection) {
      flowRadios.forEach((radio) => {
        if (radio.checked) {
          selectedFlow = radio.value;
        }
      });
    }


    const [newNodes, newEdges] = getNodesAndEdges(
      majorData[majorValue][chartOption][selectedFlow]
    );
    setNodes(newNodes);
    setEdges(newEdges);
  };

  return (
    <ReactFlowProvider>
      <div className="flex flex-row w-full gap-1 justify-center">
        <MajorDropdown updateFlow={() => updateFlow("major", "flow-chart")} />
        {showChartSelection ?
          <DeclairCheckBox updateFlow={updateFlow} />
          : null}
        {showFlowSelection ?
          <div id="radio-box" className="flex flex-col items-center justify-center gap-1" onChange={updateFlow}>
            <FlowRadioBox id="major-radio" value="major" label="Major" checked />
            <FlowRadioBox id="minor-radio" value="minor" label="Minor" />
          </div>
          : null}
      </div>
      <Flow nodes={nodes} edges={edges} key={String((nodes, edges))} />
    </ReactFlowProvider>
  );
}