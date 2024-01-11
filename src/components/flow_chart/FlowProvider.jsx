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
  const getMainNodes = () => {
    let children = [];
    for (const node of nodes.filter((node) => (node.extent != "parent") & (!["courseBlock", "group"].includes(node.type)))) {
      let layoutedNode = {
        ...node,
        width: node.width ?? DEFAULT_WIDTH,
        height: node.height ?? DEFAULT_HEIGHT,
        layoutOptions: {
          ...elkRootOptions,
          "elk.spacing.nodeNode": "30",
          "elk.layered.spacing.nodeNodeBetweenLayers": "30",
          "elk.layered.spacing": "30",
          "elk.spacing": "30",
          "elk.portConstraints": "FIXED_SIDE",
          "elk.hierarchyHandling": "INCLUDE_CHILDREN",
          "elk.padding": "[top=60,left=25,bottom=25,right=25]"
        },
        ports: [
          {
            "id": `${node.id}:s`,
            "layoutOptions": { "elk.port.side": "SOUTH" }
          },
          {
            "id": `${node.id}:n`,
            "layoutOptions": { "elk.port.side": "NORTH" }
          },
          {
            "id": `${node.id}:e`,
            "layoutOptions": { "elk.port.side": "EAST" }
          },
          {
            "id": `${node.id}:w`,
            "layoutOptions": { "elk.port.side": "WEST" }
          }
        ]
      };

      if (node.type == "subBlock") {
        layoutedNode.children = nodes.filter((child) => child.parentNode == node.id).map((child) => ({
          ...child,
          width: child.width ?? DEFAULT_WIDTH,
          height: child.height ?? DEFAULT_HEIGHT,
        }));
      }

      children.push(layoutedNode);
    }
    return children;
  };

  const getLayoutedCourseGraph = async (mainNode, direction) => {
    const getCourseNodes = () => {
      let children = [];
      for (const node of nodes.filter((node) => (node.id == mainNode.id) | ((node.type == "courseBlock") & (node.parentID == mainNode.id)))) {
        const layoutedNode = {
          ...node,
          width: node.width ?? DEFAULT_WIDTH,
          height: node.height ?? DEFAULT_HEIGHT,
          layoutOptions: {
            ...elkRootOptions,
            "elk.direction": direction,
            "elk.portConstraints": "FIXED_SIDE"
          },
          ports: [
            {
              "id": `${node.id}:e`,
              "layoutOptions": { "elk.port.side": "EAST" }
            },
            {
              "id": `${node.id}:w`,
              "layoutOptions": { "elk.port.side": "WEST" }
            }
          ]
        };

        children.push(layoutedNode);
      }
      console.log(children);
      return children;
    }

    const adjustNodePos = (graph) => {
      const deltaPos = {
        x: mainNode.x - graph.children.filter((node) => (node.id == mainNode.id))[0].x,
        y: mainNode.y - graph.children.filter((node) => (node.id == mainNode.id))[0].y
      };

      return {
        ...graph,
        children: [
          ...graph.children.map((node) => {
            return {
              ...node,
              x: node.x + deltaPos.x,
              y: node.y + deltaPos.y
            };
          })
        ]
      }
    }

    const courseGraph = {
      id: 'root',
      layoutOptions: {
        ...elkRootOptions,
        "elk.direction": direction,
      },
      children: [...getCourseNodes()],
      edges: edges.filter((edge) => (edge.connectionType == "course") & (edge.source == mainNode.id)).map((edge) => (
        direction == "RIGHT" ? {
          ...edge,
          sourceHandle: "r",
          targetHandle: "l",
          sources: [`${edge.source}:e`],
          targets: [`${edge.target}:w`]
        } : {
          ...edge,
          sourceHandle: "l",
          targetHandle: "r",
          sources: [`${edge.source}:w`],
          targets: [`${edge.target}:e`]
        })),
    };
    console.log(courseGraph);
    const layoutedCourseGraph = await elk.layout(courseGraph);
    const adjustedCourseGraph = adjustNodePos(layoutedCourseGraph);
    return adjustedCourseGraph;
  }

  try {
    const mainGraph = {
      id: 'root',
      layoutOptions: elkRootOptions,
      children: getMainNodes(),
      edges: edges.filter((edge) => edge.connectionType != "course").map((edge) => ({
        ...edge,
        sources: [`${edge.source}:n`],
        targets: [`${edge.target}:s`]
      })),
    };

    let layoutedGraph = await elk.layout(mainGraph);
    for (const [idx, mainNode] of Object.entries(layoutedGraph.children.filter((node) => node.hasCourses))) {
      const layoutedCourseGraph =
        await getLayoutedCourseGraph(mainNode, idx % 2 == 0 ? "RIGHT" : "LEFT");
      console.log(mainNode.x, layoutedCourseGraph.children.filter((node) => (node.id == mainNode.id))[0].x);

      layoutedGraph.children.push(
        ...layoutedCourseGraph.children.filter((node) => node.type == "courseBlock")
      );
      layoutedGraph.edges.push(...layoutedCourseGraph.edges)
    }
    console.log(layoutedGraph.children);

    return ({
      nodes: layoutedGraph.children.reduce((result, current) => {
        if (current.type != "group") {
          result.push({
            ...current,
            position: { x: current.x, y: current.y },
            style: { ...current.style, width: current.width, height: current.height }
          });
        }

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
      if ((hasMinor) & showFlowSelection) {
        document.getElementById("major-radio").checked = true;
        document.getElementById("minor-radio").checked = false;
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
    setIsInitialized(nodes != prevNodes);
    if (!isInitialized & nodes != undefined) {
      getLayoutedElements(nodes, edges).then(({ nodes: layoutedNodes, edges: layoutedEdges }) => {
        setIsInitialized(true);
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
        setPrevNodes(layoutedNodes);
      });
    }
    fitView({ duration: 800 });
  }, [nodes, edges]);

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