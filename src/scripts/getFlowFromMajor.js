import { MarkerType } from 'reactflow';


export default function getNodesAndEdges(flowData) {
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


    if (!nodeData["children"]) {
      nodes.push(mainNode);
      continue;
    }

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

    for (const [idx, [childNodeID, childNodeData]] of Object.entries(Object.entries(nodeData["children"]["nodes"]))) {
      let childNode = structuredClone(mainNode);
      const CHILD_HEIGHT =
        X_PADDING
        + TITLE_HEIGHT * (Math.floor(childNodeData["name"].split("").length / MAX_TITLE_CHAR) + 1)
        + SUBTITLE_HEIGHT * +(nodeData["quantity"] != undefined);
      childNode = {
        ...childNode,
        id: childNodeID,
        type: "mainBlock",
        position: { x: (CHILD_WIDTH + CHILDREN_SPACING) * idx, y: MARGIN_TOP },
        height: CHILD_HEIGHT,
        data: childNodeData,
        parentNode: nodeID,
        extent: 'parent'
      };
      childNode.style = {
        ...childNode.style,
        height: CHILD_HEIGHT
      };
      nodes.push(childNode);
    }
  }

  let edges = [];
  if (flowData["flows"]) {
    if (flowData["flows"]) {
      for (const [id, flow] of Object.entries(flowData["flows"])) {
        for (const [j, nextNodeID] of Object.entries(flow)) {
          edges.push({
            id: `${id}-${nextNodeID}`,
            source: id,
            target: nextNodeID,
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
          });

        }
      }
    }

    // if (flowData["flows"]["course"]) {
    //   for (const [nodeID, node] of Object.entries(flowData["flows"]["course"])) {
    //     const courses = node["courses"];
    //     const nodeIdx = nodes.findIndex((node) => node["id"] == nodeID);
    //     const positions = [];
    //     const mid = Math.floor(courses.length / 2);
    //     for (let i = -mid; i <= mid; i++) {
    //       positions.push(i * 60);
    //     }
    //     if (courses.length % 2 == 0) {
    //       positions.splice(mid, 1);
    //     }

    //     for (let courseIdx = 0; courseIdx < courses.length; courseIdx++) {
    //       const courseID = courses[courseIdx];
    //       const nodeData = {
    //         id: courseID,
    //         type: "courseBlock",
    //         position: {
    //           x: nodes[nodeIdx]["position"]["x"] + (nodeIdx % 2 === 0 ? 300 : -150),
    //           y:
    //             nodes[nodeIdx]["position"]["y"] + positions[courseIdx],
    //         },
    //         data: {
    //           course: courseID
    //         },
    //       };
    //       const edgeData = {
    //         id: `${nodeID}-${courseID}`,
    //         source: nodeID,
    //         target: courseID,
    //         type: "floating"
    //       };

    //       nodes.push(nodeData);
    //       edges.push(edgeData);
    //     }
    //   }
    // }
  }

  return [nodes, edges];
}