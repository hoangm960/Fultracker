import { MarkerType } from 'reactflow';


export default function getNodesAndEdges(flowData) {
    let nodes = [];
    for (const nodeID of Object.keys(flowData["nodes"])) {
        nodes.push({
            id: nodeID,
            type: "mainBlock",
            targetPosition: "bottom",
            position: { x: 0, y: 0 },
            data: flowData["nodes"][nodeID],
        });
    }

    let edges = [];
    if (flowData["flows"]) {
        if (flowData["flows"]["main"]) {
            for (const [id, flow] of Object.entries(flowData["flows"]["main"])) {
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

        if (flowData["flows"]["sub-flows"]) {
            for (const [id, flow] of Object.entries(flowData["flows"]["sub-flows"])) {
                const nodeIdx = nodes.findIndex((node) => node["id"] == id);
                const positions = [];
                const mid = Math.floor(flow.length / 2);
                for (let i = -mid; i <= mid; i++) {
                    positions.push(i * 60);
                }
                if (flow.length % 2 == 0) {
                    positions.splice(mid, 1);
                }
                console.log(positions);
                for (const [j, nextNodeID] of Object.entries(flow)) {
                    const edgeData = {
                        id: `${id}-${nextNodeID}`,
                        source: id,
                        target: nextNodeID,
                        type: "floating",
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

                    const nextNodePos = {
                        x: nodes.find((node) => node.id === id)["position"]["x"] + (nodeIdx % 2 === 0 ? -400 : 400),
                        y:
                            nodes.find((node) => node.id === id)["position"]["y"] + positions[j],
                    };
                    const nextNode = nodes.find((node) => node.id === nextNodeID);
                    nextNode["position"] = nextNodePos;
                    edges.push(edgeData);
                }
            }
        }

        if (flowData["flows"]["course"]) {
            for (const [nodeID, node] of Object.entries(flowData["flows"]["course"])) {
                const courses = node["courses"];
                const nodeIdx = nodes.findIndex((node) => node["id"] == nodeID);
                const positions = [];
                const mid = Math.floor(courses.length / 2);
                for (let i = -mid; i <= mid; i++) {
                    positions.push(i * 30);
                }
                if (courses.length % 2 == 0) {
                    positions.splice(mid, 1);
                }

                for (let courseIdx = 0; courseIdx < courses.length; courseIdx++) {
                    const courseID = courses[courseIdx];
                    const nodeData = {
                        id: courseID,
                        type: "courseBlock",
                        position: {
                            x: nodes[nodeIdx]["position"]["x"] + (nodeIdx % 2 === 0 ? 300 : -150),
                            y:
                                nodes[nodeIdx]["position"]["y"] + positions[courseIdx],
                        },
                        data: {
                            course: courseID
                        },
                    };
                    const edgeData = {
                        id: `${nodeID}-${courseID}`,
                        source: nodeID,
                        target: courseID,
                        type: "floating"
                    };

                    nodes.push(nodeData);
                    edges.push(edgeData);
                }
            }

        }
    }

    return [nodes, edges];
}