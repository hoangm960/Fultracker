import {
  Background,
  Controls,
  MarkerType,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import MajorNode from "./MajorNode";
import { useEffect, useState } from "react";
import majorData from "@data/major.json";
import dagre from "dagre";
import TopPanel from "./top_panel/TopPanel";
import Popup from "../Popup";

const nodeTypes = { majorNode: MajorNode };

function MajorFlow({ major, flowType, declaired }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();

  useEffect(() => {
    if (!major || !flowType) return;

    const majorNodes = majorData[major][declaired ? "flow-chart" : "declair"][
      flowType
    ]["nodes"].map((major, index) => {
      return {
        id: `${index + 1}`,
        position: { x: 0, y: 0 },
        type: "majorNode",
        data: {
          label: major.title,
          major: major,
        },
      };
    });

    const majorEdges = majorData[major][declaired ? "flow-chart" : "declair"][
      flowType
    ]["edges"].map((edge, index) => {
      return {
        id: `${index + 1}`,
        source: `${edge[0]}`,
        target: `${edge[1]}`,
        type: "smoothstep",
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: "var(--dark-action)",
        },
        style: {
          strokeWidth: 2,
          stroke: "var(--action)",
        },
      };
    });
    setNodes(majorNodes);
    setEdges(majorEdges);
  }, [major, flowType, declaired]);

  useEffect(() => {
    if (nodes[0]?.measured?.width) {
      const dagreGraph = new dagre.graphlib.Graph();
      dagreGraph.setDefaultEdgeLabel(() => ({}));

      const getLayoutedElements = (nodes, edges) => {
        dagreGraph.setGraph({
          rankdir: "BT",
          edgesep: 10,
          ranksep: 50,
          nodesep: 10,
        });

        nodes.forEach((node) =>
          dagreGraph.setNode(node.id, {
            width: node.measured.width,
            height: node.measured.height,
          }),
        );
        edges.forEach((edge) => dagreGraph.setEdge(edge.source, edge.target));

        dagre.layout(dagreGraph);

        return {
          nodes: nodes.map((node) => {
            const nodeWithPosition = dagreGraph.node(node.id);

            return {
              ...node,
              position: {
                x: nodeWithPosition.x - node.measured.width / 2,
                y: nodeWithPosition.y - node.measured.height / 2,
              },
            };
          }),
          edges,
        };
      };

      if (nodes.length > 0) {
        const layouted = getLayoutedElements(nodes, edges);

        setNodes(layouted.nodes);
        setEdges(layouted.edges);
      }
    }

    fitView();
  }, [nodes, edges]);

  const onNodeClick = (event, node) => {
    console.log(node);
    const dialog = document.getElementById("dialog");
    if (dialog instanceof HTMLDialogElement) {
      dialog.showModal();
    }
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      fitView
      nodesDraggable={false}
      proOptions={{ hideAttribution: true }}
      onNodeClick={onNodeClick}
    >
      <Background gap={10} size={1} />
      <Controls
        position="bottom-right"
        fitViewOptions={{ duration: 800 }}
        showInteractive={false}
      />
    </ReactFlow>
  );
}

export default function MajorFlowProvider() {
  const [major, setMajor] = useState(null);
  const [flowType, setFlowType] = useState("major");
  const [declaired, setDeclaired] = useState(true);

  return (
    <ReactFlowProvider>
      <TopPanel
        setMajor={setMajor}
        setFlowType={setFlowType}
        setDeclaired={setDeclaired}
      />
      <MajorFlow major={major} flowType={flowType} declaired={declaired} />
    </ReactFlowProvider>
  );
}

