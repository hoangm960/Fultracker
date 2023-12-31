export default function getNodesAndEdges(flowData) {
    let nodes = [];
    for (const [index, id] of Object.entries(
        Object.keys(flowData["flows"]["main"])
    )) {
        nodes.push({
            id: id,
            type: "mainBlock",
            targetPosition: "bottom",
            position: { x: 0, y: -(80 * index) },
            data: flowData["nodes"][id],
        });
    }

    let edges = [];
    if (flowData["flows"]["main"]) {
        for (const [id, flow] of Object.entries(flowData["flows"]["main"])) {
            for (const [j, nextNodeID] of Object.entries(flow)) {
                edges.push({
                    id: `${id}-${nextNodeID}`,
                    source: id,
                    target: nextNodeID,
                    sourceHandle: "main",
                });

                const nextNodePos = {
                    x: nodes.find((node) => node.id === id)["position"]["x"] +
                        300 * (+j + 0.5 - flow.length / 2),
                    y: nodes.find((node) => node.id === id)["position"]["y"] - 100
                };
                const nextNode = nodes.find((node) => node.id === nextNodeID);
                if (nextNode) {
                    nextNode["position"] = nextNodePos;
                } else {
                    nodes.push({
                        id: nextNodeID,
                        type: "mainBlock",
                        targetPosition: "bottom",
                        position: nextNodePos,
                        data: flowData["nodes"][nextNodeID],
                    });
                }
            }
        }
    }

    if (flowData["flows"]["sub-flows"]) {
        for (const [id, flow] of Object.entries(flowData["flows"]["sub-flows"])) {
            const nodeIdx = nodes.findIndex((node) => node["id"] == id);

            for (const [j, nextNodeID] of Object.entries(flow)) {
                // edges.push({
                //     id: `${id}-${nextNodeID}`,
                //     source: id,
                //     target: nextNodeID
                // });

                // const nextNodePos = {
                //     x: nodes.find((node) => node.id === id)["position"]["x"] +
                //         300 * (+j + 0.5 - flow.length / 2),
                //     y: nodes.find((node) => node.id === id)["position"]["y"] - 100
                // };
                // const nextNode = nodes.find((node) => node.id === nextNodeID);
                // if (nextNode) {
                //     nextNode["position"] = nextNodePos;
                // } else {
                //     nodes.push({
                //         id: nextNodeID,
                //         type: "mainBlock",
                //         targetPosition: "bottom",
                //         position: nextNodePos,
                //         data: flowData["nodes"][nextNodeID],
                //     });
                // }
                
                const nodeData = {
                    id: nextNodeID,
                    type: "courseBlock",
                    position: {
                        x: nodeIdx % 2 === 0 ? 300 : -150,
                        y:
                            60 * (j + 0.5 - flow.length / 2) +
                            nodes.find((node) => node.id === id)["position"]["y"],
                    },
                    data: {
                        course: nextNodeID,
                        position: nodeIdx % 2 === 0 ? "left" : "right",
                    },
                };
                const edgeData = {
                    id: `${id}-${nextNodeID}`,
                    source: id,
                    target: nextNodeID,
                    sourceHandle: nodeIdx % 2 === 0 ? "courseRight" : "courseLeft",
                };

                nodes.push(nodeData);
                edges.push(edgeData);
            }
        }
    }

    if (flowData["flows"]["course"]) {
        for (const [nodeID, node] of Object.entries(flowData["flows"]["course"])) {
            const courses = node["courses"];
            const nodeIdx = nodes.findIndex((node) => node["id"] == nodeID);
            for (let courseIdx = 0; courseIdx < courses.length; courseIdx++) {
                const courseID = courses[courseIdx];
                const nodeData = {
                    id: courseID,
                    type: "courseBlock",
                    position: {
                        x: nodeIdx % 2 === 0 ? 300 : -150,
                        y:
                            60 * (courseIdx + 0.5 - courses.length / 2) +
                            nodes[nodeIdx]["position"]["y"],
                    },
                    data: {
                        course: courseID,
                        position: nodeIdx % 2 === 0 ? "left" : "right",
                    },
                };
                const edgeData = {
                    id: `${nodeID}-${courseID}`,
                    source: nodeID,
                    target: courseID,
                    sourceHandle: nodeIdx % 2 === 0 ? "courseRight" : "courseLeft",
                };

                nodes.push(nodeData);
                edges.push(edgeData);
            }
        }

    }

    return [nodes, edges];
}