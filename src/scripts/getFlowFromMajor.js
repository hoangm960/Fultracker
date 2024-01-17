import { MarkerType } from 'reactflow';


export default function getNodesAndEdges(flowData, mainNode, showCourses = false) {
  const nodes = getMainNodes(flowData, mainNode, showCourses);
  const edges = getEdges(flowData, mainNode, showCourses);
  return [nodes, edges];
}

function getMainNodes(flowData, mainNode, showCourses) {
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

  const filterDoneCourses = (nodes) => {
    let newNodes = [];
    let selectedCourses = localStorage["selectedCourses"];
    
    if (selectedCourses) {
      selectedCourses = JSON.parse(selectedCourses);
      for (const node of nodes) {
        if ((node.type == "courseBlock") & (selectedCourses.map((course) => course.code).includes(node.id))) {
          newNodes.push({ ...node, data: { ...node.data, disabled: true } });
        } else {
          newNodes.push(node);
        }
      }
    } else {
      newNodes = [...nodes];
    }
    return newNodes;
  }

  let nodes = [];
  if (mainNode) {
    nodes.push(mainNode);
    if (showCourses) {
      if (mainNode.data.course) {
        for (const courseID of mainNode.data.course.courses) {
          nodes.push({
            id: courseID,
            type: "courseBlock",
            position: { x: 0, y: 0 },
            data: { courseID: courseID, disabled: false },
            width: 96,
            height: 48
          });
        }
      }
    }
  }

  if (flowData) {
    for (const [nodeID, nodeData] of Object.entries(flowData.nodes)) {
      nodes.push(getMainNodeLayout(nodeID, nodeData));
      if (showCourses) {
        if (nodeData.course) {
          for (const courseID of nodeData.course.courses) {
            nodes.push({
              id: courseID,
              type: "courseBlock",
              position: { x: 0, y: 0 },
              data: { courseID: courseID },
              width: 96,
              height: 48
            });
          }
        }
      }
    }
  }

  return filterDoneCourses(nodes);
}

function getEdges(flowData, mainNode, showCourses) {
  let edges = [];
  let mainEdgeLayout = {
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
    if (mainNode.data.children) {
      for (const nodeID of Object.keys(mainNode.data.children.nodes)) {
        mainEdgeLayout = {
          ...mainEdgeLayout,
          id: `${mainNode.id}-${nodeID}`,
          source: mainNode.id,
          target: nodeID,
        }
        edges.push(mainEdgeLayout);
      }
    }

    if (showCourses & (mainNode.data.course != undefined)) {
      for (const courseID of mainNode.data.course.courses) {
        edges.push({
          ...mainEdgeLayout,
          id: `${mainNode.id}-${courseID}`,
          source: mainNode.id,
          target: courseID,
          sourceHandle: "r",
          targetHandle: "l",
          connectionType: "course"
        })
      }
    }
  }

  if (flowData) {
    if (flowData["flows"]) {
      for (const [nodeID, flow] of Object.entries(flowData["flows"])) {
        for (const nextNodeID of flow) {
          mainEdgeLayout = {
            ...mainEdgeLayout,
            id: `${nodeID}-${nextNodeID}`,
            source: nodeID,
            target: nextNodeID,
          }
          edges.push(mainEdgeLayout);
        }
      }
    }

    if (showCourses) {
      for (const [nodeID, nodeData] of Object.entries(flowData["nodes"])) {
        if (nodeData["course"]) {
          for (const courseID of nodeData["course"]["courses"]) {
            edges.push({
              ...mainEdgeLayout,
              id: `${nodeID}-${courseID}`,
              source: nodeID,
              target: courseID,
              sourceHandle: "r",
              targetHandle: "l",
              connectionType: "course"
            })
          }
        }
      }
    }
  }

  return edges;
}