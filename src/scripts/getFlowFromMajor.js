import { MarkerType } from 'reactflow';


export default function getNodesAndEdges(flowData) {
  const nodes = getMainNodes(flowData);
  const edges = getEdges(flowData);
  console.log(nodes, edges);
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

    if (nodeData["children"]) {
      const MARGIN_TOP = MAIN_HEIGHT;
      const CHILDREN_SPACING = 30;
      const CHILD_WIDTH = 240;
      const CHILD_HEIGHT = 96;
      const COURSE_WIDTH = 96;
      const COURSE_HEIGHT = 48;
      const NUM_COURSES_FROM_CHILDREN = Object.values(nodeData.children.nodes)
        .map((node) => node.course?.courses.length ?? 0);
      const MAX_COURSES_FROM_CHILDREN = Math.max.apply(null, NUM_COURSES_FROM_CHILDREN);
      const SUB_BLOCK_WIDTH =
        (CHILD_WIDTH + CHILDREN_SPACING) * Object.keys(nodeData["children"]["nodes"]).length
        + COURSE_WIDTH;
      const SUB_BLOCK_HEIGHT =
        MARGIN_TOP
        + CHILD_HEIGHT
        + (COURSE_HEIGHT + CHILDREN_SPACING) * MAX_COURSES_FROM_CHILDREN;

      mainNode = {
        ...mainNode,
        type: "subBlock",
        marginTop: MARGIN_TOP,
        width: SUB_BLOCK_WIDTH,
        height: SUB_BLOCK_HEIGHT
      };
      mainNode.style = {
        ...mainNode.style,
        justifyContent: "start",
        width: SUB_BLOCK_WIDTH,
        height: SUB_BLOCK_HEIGHT
      }

      nodes.push(...getChildrenNodes(nodeID, nodeData, CHILD_WIDTH, CHILDREN_SPACING, MARGIN_TOP));
    }

    if (nodeData["course"]) {
      mainNode = {
        ...mainNode,
        hasCourses: true
      }
      nodes.push(...getCourseNodes(nodeID, nodeData));
    }

    nodes.push(mainNode);
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

function getCourseNodes(nodeID, nodeData) {
  let courseNodes = [];
  for (const courseID of nodeData["course"]["courses"]) {
    const courseNode = {
      id: courseID,
      type: "courseBlock",
      position: { x: 0, y: 0 },
      data: { courseID: courseID },
      width: 96,
      height: 48,
      parentID: nodeID
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
    animated: true,
    connectionType: "main"
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

  for (const [nodeID, nodeData] of Object.entries(flowData["nodes"])) {
    const courseData = nodeData["course"];
    if (courseData) {
      const courses = courseData["courses"];
      edges.push(...getCourseEdges(nodeID, courses));
    }

    if (nodeData["children"]) {
      for (const [childID, childData] of Object.entries(nodeData["children"]["nodes"])) {
        const courseData = childData["course"];
        if (courseData) {
          const courses = courseData["courses"];
          edges.push(...getCourseEdges(childID, courses));
        }
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
      animated: true,
      connectionType: "course"
    };
    courseEdges.push(courseEdge);
  }
  return courseEdges;
}