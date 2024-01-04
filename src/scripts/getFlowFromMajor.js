import { MarkerType } from 'reactflow';


export default function getNodesAndEdges(flowData) {
  let nodes = [];
  for (const [nodeID, nodeData] of Object.entries(flowData["nodes"])) {
    if (!nodeData["children"]) {
      nodes.push({
        id: nodeID,
        type: "mainBlock",
        targetPosition: "bottom",
        position: { x: 0, y: 0 },
        data: nodeData,
      });
      continue;
    }

    const marginFromTop = 100;
    const spacingBetweenNodes = 30;
    const childNodeHeight = 96;

    nodes.push({
      id: nodeID,
      type: "subBlock",
      targetPosition: "bottom",
      position: { x: 0, y: 0 },
      data: nodeData,
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        width: 300,
        height: (childNodeHeight + spacingBetweenNodes) * Object.keys(nodeData["children"]["nodes"]).length + marginFromTop,
        border: "1px solid black",
        borderRadius: "0.375rem",
        padding: "0.25rem",
        backgroundColor: "#b7ebf3",
        color: "#445953",
        textAlign: "center",
      }
    });
    for (const [idx, [childNodeID, childNodeData]] of Object.entries(Object.entries(nodeData["children"]["nodes"]))) {
      nodes.push({
        id: childNodeID,
        type: "mainBlock",
        targetPosition: "bottom",
        position: { x: 30, y: marginFromTop + (childNodeHeight + spacingBetweenNodes) * idx },
        data: childNodeData,
        parentNode: nodeID,
        extent: 'parent'
      });
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

          const nextNodePos = {
            x: nodes.find((node) => node.id === id)["position"]["x"] +
              300 * (+j + 0.5 - flow.length / 2),
            y: nodes.find((node) => node.id === id)["position"]["y"] - 150
          };
          const nextNode = nodes.find((node) => node.id === nextNodeID);
          nextNode["position"] = nextNodePos;
        }
      }
    }

    // if (flowData["flows"]["sub-flows"]) {
    //   for (const [id, flow] of Object.entries(flowData["flows"]["sub-flows"])) {
    //     const nodeIdx = nodes.findIndex((node) => node["id"] == id);
    //     const positions = [];
    //     const mid = Math.floor(flow.length / 2);
    //     for (let i = -mid; i <= mid; i++) {
    //       positions.push(i * 60);
    //     }
    //     if (flow.length % 2 == 0) {
    //       positions.splice(mid, 1);
    //     }

    //     for (const [j, nextNodeID] of Object.entries(flow)) {
    //       const edgeData = {
    //         id: `${id}-${nextNodeID}`,
    //         source: id,
    //         target: nextNodeID,
    //         type: "floating",
    //         markerEnd: {
    //           type: MarkerType.ArrowClosed,
    //           width: 10,
    //           height: 10,
    //           color: '#005C73',
    //         },
    //         style: {
    //           strokeWidth: 5,
    //           stroke: '#005C73',
    //         },
    //         animated: true
    //       };

    //       const nextNodePos = {
    //         x: nodes.find((node) => node.id === id)["position"]["x"] + (nodeIdx % 2 === 0 ? -400 : 400),
    //         y:
    //           nodes.find((node) => node.id === id)["position"]["y"] + positions[j],
    //       };
    //       const nextNode = nodes.find((node) => node.id === nextNodeID);
    //       nextNode["position"] = nextNodePos;
    //       edges.push(edgeData);
    //     }
    //   }
    // }

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