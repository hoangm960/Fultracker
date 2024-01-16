import { MarkerType } from 'reactflow';


export default function getNodesAndEdges(flowData, mainNode) {
  const nodes = getMainNodes(flowData, mainNode);
  const edges = getEdges(flowData, mainNode);
  return [nodes, edges];
}

function getMainNodes(flowData, mainNode) {
  const getMainNodeLayout = (nodeID, nodeData) => {
    const X_PADDING = 40;
    const TITLE_HEIGHT = 28;
    const MAX_TITLE_CHAR = 25;
    const SUBTITLE_HEIGHT = 20;
    const TITLE = TITLE_HEIGHT * (Math.floor(nodeData["name"].split("").length / MAX_TITLE_CHAR) + 1);
    const SUBTITLE = SUBTITLE_HEIGHT * +(nodeData["quantity"] != undefined);
    const MAIN_HEIGHT = X_PADDING + TITLE + SUBTITLE;
    const MAIN_WIDTH = 240;

    let mainNode = {
      id: nodeID,
      type: "mainBlock",
      position: { x: 0, y: 0 },
      data: nodeData,
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: MAIN_WIDTH,
        height: MAIN_HEIGHT,
        border: "1px solid black",
        borderRadius: "0.375rem",
        padding: "0.25rem",
        backgroundColor: "#b7ebf3",
        color: "#445953",
        textAlign: "center",
      },
      width: MAIN_WIDTH,
      height: MAIN_HEIGHT,
    };
    
    return mainNode;
  }
  
  let nodes = [];
  if (mainNode) {
    nodes.push(mainNode);
  }

  for (const [nodeID, nodeData] of Object.entries(flowData["nodes"])) {
    nodes.push(getMainNodeLayout(nodeID, nodeData));
  }

  return nodes;
}

function getEdges(flowData, mainNode) {
  let edges = [];
  let mainEdge = {
    sourceHandle: "t",
    targetHandle: "b",
    type: "smoothstep",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 10,
      height: 10,
      color: '#005C73',
    },
    style: {
      strokeWidth: 5,
      stroke: '#005C73',
    },
    animated: true,
    connectionType: "main"
  }

  if (mainNode) {
    for (const nodeID of Object.keys(flowData["nodes"])) {
      mainEdge = {
        ...mainEdge,
         id: `${mainNode.id}-${nodeID}`,
         source: mainNode.id,
         target: nodeID,
      }
      edges.push(mainEdge);
    }
  }

  if (flowData["flows"]) {
    for (const [nodeID, flow] of Object.entries(flowData["flows"])) {
      for (const nextNodeID of flow) {
        mainEdge = {
          ...mainEdge,
          id: `${nodeID}-${nextNodeID}`,
          source: nodeID,
          target: nextNodeID,
        }
        edges.push(mainEdge);
      }
    }
  }

  return edges;
}