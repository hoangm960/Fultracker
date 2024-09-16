import { Background, Controls, MarkerType, ReactFlow, ReactFlowProvider, useEdgesState, useNodesState, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import MajorNode from './nodes/MajorNode';
import { useEffect, useState } from 'react';
import majorData from '@data/major.json';
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
                type: 'smoothstep',
                animated: true,
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 20,
                    height: 20,
                    color: 'var(--dark-action)',
                },
                style: {
                    strokeWidth: 2,
                    stroke: 'var(--action)',
                },
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
                dagreGraph.setGraph({ rankdir: 'BT', edgesep: 10, ranksep: 40, nodesep: 10 });

                nodes.forEach((node) => dagreGraph.setNode(
                    node.id,
                    {
                        width: node.measured.width,
                        height: node.measured.height
                    }
                ));
                edges.forEach((edge) => dagreGraph.setEdge(edge.source, edge.target));

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
            nodesDraggable={false}
            proOptions={{ hideAttribution: true }}
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
                <MajorFlow />
            </ReactFlowProvider>

        </div>
    );
}