import { useState, useEffect } from "react";
import dagre from "dagre";
import { useReactFlow, useStoreApi } from "@xyflow/react";

const DagreNodePositioning = () => {
    const store = useStoreApi();
    const { nodeLookup, edgeLookup } = store.getState();
    const nodes = Array.from(nodeLookup).map(([, node]) => node);
    const edges = Array.from(edgeLookup).map(([, edge]) => edge);
    const { setNodes, setEdges } = useReactFlow();

    const [nodesPositioned, setNodesPositioned] = useState(false);

    useEffect(() => {
        // node dimensions are not immediately detected, so we want to wait until they are
        if (nodes[0]?.measured?.width) {
            // create dagre graph
            const dagreGraph = new dagre.graphlib.Graph();
            // this prevents error
            dagreGraph.setDefaultEdgeLabel(() => ({}));

            // use dagre graph to layout nodes
            const getLayoutedElements = (nodes, edges) => {
                dagreGraph.setGraph({ rankdir: 'BT' });

                edges.forEach((edge) => dagreGraph.setEdge(edge.source, edge.target));
                nodes.forEach((node) => dagreGraph.setNode(node.id, node));

                dagre.layout(dagreGraph);

                return {
                    nodes: nodes.map((node) => {
                        const nodeWithPosition = dagreGraph.node(node.id);

                        return {
                            ...node, position: {
                                x: nodeWithPosition.x - node.measured.width / 2,
                                y: nodeWithPosition.y - node.measured.height / 2
                            }
                        };
                    }),
                    edges,
                };
            };

            // if nodes exist and nodes are not positioned
            if (nodes.length > 0 && !nodesPositioned) {
                const layouted = getLayoutedElements(nodes, edges);

                // update react flow state
                setNodes(layouted.nodes);
                setEdges(layouted.edges);
                setNodesPositioned(true);
            }
        }
    }, [nodes, edges]);

    return null;
};

export default DagreNodePositioning;