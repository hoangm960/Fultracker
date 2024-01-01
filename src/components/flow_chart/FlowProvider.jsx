import majorData from "@data/major.json";
import MajorDropdown from "@components/flow_chart/MajorDropdown";
import FlowRadioBox from "@components/flow_chart/FlowRadioBox";
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  ConnectionMode
} from "reactflow";
import MainBlock from "./MainBlock";
import CourseBlock from "./CourseBlock";
import "reactflow/dist/style.css";
import DeclairCheckBox from "./DeclairCheckBox";
import getNodesAndEdges from "@scripts/getFlowFromMajor";
import FloatingEdge from "@components/flow_chart/FloatingEdge";


const proOptions = { hideAttribution: true };
const nodeTypes = { mainBlock: MainBlock, courseBlock: CourseBlock };
const edgeTypes = { floating: FloatingEdge };

export default function ProviderFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const updateFlow = () => {
    const majorSelect = document.getElementById("major");
    const flowRadios = document.getElementsByName("flow-radio");
    const declairCheckBox = document.getElementById("declair");

    let selectedFlow;
    flowRadios.forEach((radio) => {
      if (radio.checked) {
        selectedFlow = radio.value;
      }
    });
    const majorValue = majorSelect.value.toUpperCase();
    const chartOption = declairCheckBox.checked ? "flow-chart" : "declair";

    if (majorValue && selectedFlow) {
      const [newNodes, newEdges] = getNodesAndEdges(
        majorData[majorValue][chartOption][selectedFlow]
      );
      setNodes(newNodes);
      setEdges(newEdges);
    }
  };

  return (
    <ReactFlowProvider>
      <div className="flex flex-row w-full gap-1 justify-center">
        <MajorDropdown updateFlow={updateFlow} />
        <div id="radio-box" className="flex flex-col items-center justify-center gap-1" onChange={updateFlow}>
          <FlowRadioBox value="major" label="Major" checked />
          <FlowRadioBox value="minor" label="Minor" />
        </div>
        <DeclairCheckBox updateFlow={updateFlow} />
      </div>
      <div id="flow-box" className="h-full w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
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
    </ReactFlowProvider>
  );
}