import { MarkerType } from 'reactflow';


export default function getNodesAndEdges(flowData) {
  const nodes = getMainNodes(flowData);
  const edges = getEdges(flowData);
  return [nodes, edges];
}

function getMainNodes(flowData) {
  let nodes = [];
  for (const [nodeID, nodeData] of Object.entries(flowData["nodes"])) {
    const X_PADDING = 40;
    const TITLE_HEIGHT = 28;
    const MAX_TITLE_CHAR = 25;
    const SUBTITLE_HEIGHT = 20;
    const TITLE = TITLE_HEIGHT * (Math.floor(nodeData["name"].split("").length / MAX_TITLE_CHAR) + 1);
    const SUBTITLE = SUBTITLE_HEIGHT * +(nodeData["quantity"] != undefined);
    const MAIN_HEIGHT = X_PADDING + TITLE + SUBTITLE;
    const mainNode = {
      id: nodeID,
      type: "mainBlock",
      targetPosition: "bottom",
      position: { x: 0, y: 0 },
      data: nodeData,
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: 240,
        height: MAIN_HEIGHT,
        border: "1px solid black",
        borderRadius: "0.375rem",
        padding: "0.25rem",
        backgroundColor: "#b7ebf3",
        color: "#445953",
        textAlign: "center",
      },
      width: 240,
      height: MAIN_HEIGHT,
    };

    if (nodeData["children"]) {

      const MARGIN_TOP = 100;
      const CHILDREN_SPACING = 30;
      const CHILD_WIDTH = 240;
      const SUB_BLOCK_WIDTH = (CHILD_WIDTH + CHILDREN_SPACING) * Object.keys(nodeData["children"]["nodes"]).length;

      let subNode = structuredClone(mainNode);
      subNode = {
        ...subNode,
        type: "subBlock",
        marginTop: MARGIN_TOP,
        width: SUB_BLOCK_WIDTH,
        height: 96 + MARGIN_TOP
      };
      subNode.style = {
        ...subNode.style,
        justifyContent: "start",
        width: SUB_BLOCK_WIDTH,
        height: 96 + MARGIN_TOP
      }
      nodes.push(subNode);
      nodes.push(...getChildrenNodes(nodeID, nodeData, CHILD_WIDTH, CHILDREN_SPACING, MARGIN_TOP));
    } else {
      nodes.push(mainNode);
    }
    if (nodeData["course"]) {
      nodes.push(...getCourseNodes(nodeData));
    }
  }

  return nodes;
}

function getChildrenNodes(nodeID, nodeData, width, spacing, marginTop) {
  let childrenNodes = getMainNodes(nodeData["children"]);
  for (const [idx, childNode] of Object.entries(childrenNodes)) {
    childrenNodes[idx] = {
      ...childNode,
      position: { x: (width + spacing) * idx, y: marginTop },
      parentNode: nodeID,
      extent: 'parent'
    };
  }
  return childrenNodes;
}

function getCourseNodes(nodeData) {
  let courseNodes = [];
  for (const courseID of nodeData["course"]["courses"]) {
    const courseNode = {
      id: courseID,
      type: "courseBlock",
      position: { x: 0, y: 0 },
      data: { courseID: courseID },
      width: 96,
      height: 48
    };

    courseNodes.push(courseNode);
  }

  return courseNodes;
}

function getEdges(flowData) {
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
    animated: true
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

      const courseData = flowData["nodes"][nodeID]["course"];
      if (courseData) {
        const courses = courseData["courses"];
        edges.push(...getCourseEdges(nodeID, courses));
      }
    }
  }
  return edges;
}

function getCourseEdges(nodeID, courses) {
  let courseEdges = [];
  for (const courseID of courses) {
    const courseEdge = {
      id: `${nodeID}-${courseID}`,
      source: nodeID,
      target: courseID,
      sourceHandle: "r",
      targetHandle: "l",
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
      animated: true
    };
    courseEdges.push(courseEdge);
  }
  return courseEdges;
}