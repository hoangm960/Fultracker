import { Background, Controls, ReactFlow, ReactFlowProvider, useEdgesState, useNodesState, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import MajorNode from './nodes/MajorNode';
import { useEffect, useState } from 'react';
import majorData from '@data/major.json';
import DagreNodePositioning from './Layout';
import dagre from "dagre";



const nodeTypes = { majorNode: MajorNode };

function MajorFlow() {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const { fitView } = useReactFlow();

    const [nodesPositioned, setNodesPositioned] = useState(false);


    useEffect(() => {
        const majorNodes = majorData["MATH"]["flow-chart"]["major"]["nodes"].map((major, index) => {
            return {
                id: `${index + 1}`,
                position: { x: 0, y: 0 },
                type: 'majorNode',
                data: {
                    label: major.title,
                    major: major
                }
            }
        });

        const majorEdges = majorData["MATH"]["flow-chart"]["major"]["edges"].map((edge, index) => {
            return {
                id: `${index + 1}`,
                source: `${edge[0]}`,
                target: `${edge[1]}`,
            }
        });
        setNodes(majorNodes);
        setEdges(majorEdges);
    }, []);

    useEffect(() => {
        if (nodes[0]?.measured?.width) {
            const dagreGraph = new dagre.graphlib.Graph();
            dagreGraph.setDefaultEdgeLabel(() => ({}));

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

            if (nodes.length > 0 && !nodesPositioned) {
                const layouted = getLayoutedElements(nodes, edges);

                setNodes(layouted.nodes);
                setEdges(layouted.edges);
                setNodesPositioned(true);
            }
        }

        fitView();
    }, [nodes, edges]);

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
        >
            <Background />
            <Controls />

        </ReactFlow>
    );
}

export default function MajorFlowProvider() {
    return (
        <div className='w-full h-full'>
            <ReactFlowProvider>
                <DagreNodePositioning />
                <MajorFlow />
            </ReactFlowProvider>

        </div>
    );
}