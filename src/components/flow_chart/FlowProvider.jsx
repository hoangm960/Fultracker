import majorData from "@data/major.json";
import MajorDropdown from "@components/flow_chart/MajorDropdown";
import FlowRadioBox from "@components/flow_chart/FlowRadioBox";
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  ConnectionMode,
  useNodesState,
  useEdgesState,
  useReactFlow
} from "reactflow";
import MainBlock from "./MainBlock";
import CourseBlock from "./CourseBlock";
import SubBlock from "./SubBlock";
import "reactflow/dist/style.css";
import DeclairCheckBox from "./DeclairCheckBox";
import getNodesAndEdges from "@scripts/getFlowFromMajor";
import FloatingEdge from "@components/flow_chart/FloatingEdge";
import { useEffect, useState } from "react";
import ELK from 'elkjs/lib/elk.bundled.js';


const proOptions = { hideAttribution: true };
const nodeTypes = { mainBlock: MainBlock, courseBlock: CourseBlock, subBlock: SubBlock };
const edgeTypes = { floating: FloatingEdge };

const elk = new ELK();
const elkOptions = {
  "elk.algorithm": "layered",
  "elk.direction": "UP",
  "elk.spacing.nodeNode": "25",
  "elk.layered.spacing.nodeNodeBetweenLayers": "50",
  "elk.layered.spacing": "50",
  "elk.layered.mergeEdges": "true",
  "elk.spacing": "50",
  "elk.spacing.individual": "50",
  "elk.edgeRouting": "SPLINES"
};

const DEFAULT_WIDTH = 240;
const DEFAULT_HEIGHT = 96;

const getLayoutedElements = async (nodes, edges) => {
  const graph = {
    id: 'root',
    layoutOptions: elkOptions,
    children: nodes.filter((node) => node.extent != "parent").map((node) => {
      return {
        ...node,
        width: node.style != undefined ? node.style.width : DEFAULT_WIDTH,
        height: node.style != undefined ? node.style.height : DEFAULT_HEIGHT,
        layoutOptions: {
          "elk.algorithm": "layered",
          "elk.direction": "UP",
          "elk.spacing.nodeNode": "30",
          "elk.layered.spacing.nodeNodeBetweenLayers": "30",
          "elk.layered.spacing": "30",
          "elk.spacing": "30",
          "elk.spacing.individual": "50",
          "elk.hierarchyHandling": "INCLUDE_CHILDREN",
          "elk.padding": "[top=60,left=25,bottom=25,right=25]",
        },

        children: node.style != undefined ? nodes.filter((child) => child.parentNode == node.id).map((child) => ({
          ...child,
          width: DEFAULT_WIDTH,
          height: DEFAULT_HEIGHT,
        })) : undefined
      }
    }),
    edges: edges,
  };

  try {
    const layoutedGraph = await elk.layout(graph);
    return ({
      nodes: layoutedGraph.children.reduce((result, current) => {
        result.push({
          ...current,
          position: { x: current.x, y: current.y },
          style: { ...current.style, width: current.width, height: current.height }
        });

        if (current.children != undefined) {
          current.children.forEach((child) =>
            result.push({
              ...child,
              position: { x: child.x, y: child.y },
            })
          );
        }

        return result;
      }, []),

      edges: layoutedGraph.edges,
    });
  } catch (message) {
    return console.error(message);
  }
};


export default function FlowProvider() {
  return (
    <ReactFlowProvider>
      <TopBar />
      <Flow />
    </ReactFlowProvider>
  );
}

function TopBar() {
  const { setNodes, setEdges } = useReactFlow();
  const [showFlowSelection, setShowFlowSelection] = useState(false);
  const [showChartSelection, setShowChartSelection] = useState(false);

  function updateFlow(flow, chart) {
    const majorSelect = document.getElementById("major");
    const flowRadios = document.getElementsByName("flow-radio");
    const declairCheckBox = document.getElementById("declair");

    const onUpdate = (majorValue, chartOption, selectedFlow) => {
      const [newNodes, newEdges] = getNodesAndEdges(
        majorData[majorValue][chartOption][selectedFlow]
      );
      getLayoutedElements(newNodes, newEdges).then(({ nodes: layoutedNodes, edges: layoutedEdges }) => {
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
      });
  
      const hasDeclair = Object.keys(majorData[majorValue]).includes("declair");
      const hasMinor = Object.keys(majorData[majorValue][chartOption]).includes("minor");
      setShowChartSelection(hasDeclair);
      setShowFlowSelection(hasMinor);
    }
    
    const majorValue = majorSelect.value.toUpperCase();
    if ((chart !== undefined) & (flow !== undefined)) {
      onUpdate(majorValue, chart, flow);
      
      const hasMinor = Object.keys(majorData[majorValue][chart]).includes("minor");
      if ((hasMinor) & showFlowSelection) {
        document.getElementById("major-radio").checked = true;
        document.getElementById("minor-radio").checked = false;
      }
      return;
    }

    const chartOption =
      declairCheckBox ?
        declairCheckBox.checked ?
          "flow-chart"
          : "declair"
        : "flow-chart";

    let selectedFlow = "major";
    if (showFlowSelection) {
      flowRadios.forEach((radio) => {
        if (radio.checked) {
          selectedFlow = radio.value;
        }
      });
    }

    onUpdate(majorValue, chartOption, selectedFlow);
  };

  return (
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
  );
}

function Flow({ initialNodes, initialEdges }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const { fitView } = useReactFlow();

  useEffect(() => { fitView({ duration: 800 }) }, [nodes, edges]);

  return (
    <div id="flow-box" className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={{ duration: 800 }}
        proOptions={proOptions}
        connectionMode={ConnectionMode.Loose}
      >
        <Background gap={10} size={1} />
        <Controls position="bottom-right" />
      </ReactFlow>
    </div>
  );
}