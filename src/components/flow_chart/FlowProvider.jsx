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
import "reactflow/dist/style.css";
import DeclairCheckBox from "./DeclairCheckBox";
import getNodesAndEdges from "@scripts/getFlowFromMajor";
import { useEffect, useState } from "react";
import ELK from 'elkjs/lib/elk.bundled.js';


const proOptions = { hideAttribution: true };
const nodeTypes = { mainBlock: MainBlock, courseBlock: CourseBlock };

const elk = new ELK();
const elkRootOptions = {
  "elk.algorithm": "layered",
  "elk.spacing.nodeNode": "30",
  "elk.layered.spacing.nodeNodeBetweenLayers": "50",
  "elk.layered.spacing": "50",
  "elk.layered.mergeEdges": "true",
  "elk.spacing": "50",
  "elk.spacing.individual": "50",
  "elk.edgeRouting": "SPLINES",
  "elk.direction": "UP",
};

const DEFAULT_WIDTH = 240;
const DEFAULT_HEIGHT = 96;

const getLayoutedElements = async (nodes, edges) => {
  const getOriginalMainGraph = () => {
    return {
      id: "root",
      layoutOptions: elkRootOptions,
      children: nodes.filter((node) => (node.extent != "parent") & (!["courseBlock", "group"].includes(node.type))).map((mainNode, mainIdx) => {
        let layoutedMainNode = {
          ...mainNode,
          width: mainNode.width ?? DEFAULT_WIDTH,
          height: mainNode.height ?? DEFAULT_HEIGHT,
          layoutOptions: {
            ...elkRootOptions,
            "elk.spacing.nodeNode": "30",
            "elk.layered.spacing.nodeNodeBetweenLayers": "30",
            "elk.layered.spacing": "30",
            "elk.spacing": "30",
            "elk.hierarchyHandling": "INCLUDE_CHILDREN",
            "elk.padding": `[top=${mainNode.marginTop},left=25,bottom=25,right=25]`,
            "elk.direction": mainIdx % 2 == 0 ? "LEFT" : "RIGHT",
          }
        };

        return layoutedMainNode;
      }),
      edges: edges.filter((edge) => edge.connectionType != "course")
    }
  }

  const flattenGraph = (graph) => {
    let flattenGraphDict = {
      nodes: [],
      edges: graph.edges ? [...graph.edges] : []
    }
    for (const [idx, node] of Object.entries(graph.children)) {
      flattenGraphDict.nodes.push({
        ...node,
        position: { x: node.x, y: node.y },
        style: { ...node.style, width: node.width, height: node.height }
      });

      if (node.children) {
        const childrenResult = flattenGraph(node);
        flattenGraphDict.nodes.push(...childrenResult.nodes.map((child) => ({
          ...child,
          parentNode: node.id,
          extent: "parent"
        })));
        flattenGraphDict.edges.push(...childrenResult.edges.map((edge) => {
          return {
            ...edge,
            sourceHandle: idx % 2 == 0 ? "r" : "l",
            targetHandle: idx % 2 == 0 ? "l" : "r"
          }
        }));
      }

    }
    return flattenGraphDict;
  }


  try {
    let orgGraph = await elk.layout(getOriginalMainGraph());
    return ({
      nodes: flattenGraph(orgGraph).nodes,
      edges: flattenGraph(orgGraph).edges,
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
      setNodes(newNodes);
      setEdges(newEdges);

      const hasDeclair = Object.keys(majorData[majorValue]).includes("declair");
      const hasMinor = Object.keys(majorData[majorValue][chartOption]).includes("minor");
      setShowChartSelection(hasDeclair);
      setShowFlowSelection(hasMinor);
    }

    const majorValue = majorSelect.value.toUpperCase();
    if ((chart !== undefined) & (flow !== undefined)) {
      onUpdate(majorValue, chart, flow);

      const hasMinor = Object.keys(majorData[majorValue][chart]).includes("minor");
      const hasDeclair = Object.keys(majorData[majorValue]).includes("declair");
      if (hasMinor & showFlowSelection) {
        document.getElementById("major-radio").checked = true;
        document.getElementById("minor-radio").checked = false;
      }
      if (hasDeclair & showChartSelection) {
        document.getElementById("declair").checked = true;
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

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState();
  const [edges, setEdges, onEdgesChange] = useEdgesState();
  const [prevNodes, setPrevNodes] = useState();
  const [isInitialized, setIsInitialized] = useState(false);

  const { fitView } = useReactFlow();

  useEffect(() => {
    if (!isInitialized & nodes != undefined) {
      getLayoutedElements(nodes, edges).then(({ nodes: layoutedNodes, edges: layoutedEdges }) => {
        setIsInitialized(true);
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
        setPrevNodes(layoutedNodes);
      });
    }
    setIsInitialized(nodes != prevNodes);
    fitView({ duration: 800 });
  }, [nodes, edges]);

  return (
    <div id="flow-box" className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
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