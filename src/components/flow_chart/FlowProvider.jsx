import majorData from "@data/major.json";
import MajorDropdown from "@components/flow_chart/MajorDropdown";
import FlowRadioBox from "@components/flow_chart/FlowRadioBox";
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "reactflow";
import MainBlock from "./MainBlock";
import CourseBlock from "./CourseBlock";
import "reactflow/dist/style.css";
import DeclairCheckBox from "./DeclairCheckBox";

const proOptions = { hideAttribution: true };
const nodeTypes = { mainBlock: MainBlock, courseBlock: CourseBlock };

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
          fitView
          proOptions={proOptions}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}

function getNodesAndEdges(flowData) {
  let nodes = [];
  for (const [index, [id, node]] of Object.entries(
    Object.entries(flowData["nodes"])
  )) {
    nodes.push({
      id: id,
      type: "mainBlock",
      targetPosition: "bottom",
      position: { x: 0, y: -(80 * index) },
      data: node,
    });
  }

  let edges = [];
  if (flowData["flows"]["main"]) {
    for (const [id, flow] of Object.entries(flowData["flows"]["main"])) {
      for (const [j, nextNodeID] of Object.entries(flow)) {
        edges.push({
          id: `${id}-${nextNodeID}`,
          source: id,
          target: nextNodeID,
          sourceHandle: "main",
        });

        nodes.find((node) => node.id === nextNodeID)["position"]["x"] =
          nodes.find((node) => node.id === id)["position"]["x"] +
          300 * (+j + 0.5 - flow.length / 2);
        nodes.find((node) => node.id === nextNodeID)["position"]["y"] =
          nodes.find((node) => node.id === id)["position"]["y"] - 100;
      }
    }
  }

  if (flowData["flows"]["sub-flows"]) {
    for (const [id, flow] of Object.entries(flowData["flows"]["sub-flows"])) {
      for (const [j, nextNodeID] of Object.entries(flow)) {
        edges.push({
          id: `${id}-${nextNodeID}`,
          source: id,
          target: nextNodeID,
          sourceHandle: "courseRight",
          targetHandle: "courseLeft",
        });

        nodes.find((node) => node.id === nextNodeID)["position"]["x"] =
          nodes.find((node) => node.id === id)["position"]["x"] + 300;
        nodes.find((node) => node.id === nextNodeID)["position"]["y"] =
          10 * (j + 0.5 - flow.length / 2) +
          nodes.find((node) => node.id === id)["position"]["y"];
      }
    }
  }

  if (flowData["flows"]["course"]) {
    for (const [nodeID, node] of Object.entries(flowData["flows"]["course"])) {
      const courses = node["courses"];
      const nodeIdx = nodes.findIndex((node) => node["id"] == nodeID);
      for (let courseIdx = 0; courseIdx < courses.length; courseIdx++) {
        const courseID = courses[courseIdx];
        const nodeData = {
          id: courseID,
          type: "courseBlock",
          position: {
            x: nodeIdx % 2 === 0 ? 300 : -150,
            y:
              60 * (courseIdx + 0.5 - courses.length / 2) +
              nodes[nodeIdx]["position"]["y"],
          },
          data: {
            course: courseID,
            position: nodeIdx % 2 === 0 ? "left" : "right",
          },
        };
        const edgeData = {
          id: `${nodeID}-${courseID}`,
          source: nodeID,
          target: courseID,
          sourceHandle: nodeIdx % 2 === 0 ? "courseRight" : "courseLeft",
        };

        nodes.push(nodeData);
        edges.push(edgeData);
      }
    }

  }

  return [nodes, edges];
}