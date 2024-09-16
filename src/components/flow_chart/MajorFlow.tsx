import { Background, Controls, ReactFlow, ReactFlowProvider, useEdgesState, useNodesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import MajorNode from './nodes/MajorNode';
import { useEffect } from 'react';
import majorData from '@data/major.json';
import DagreNodePositioning from './Layout';


const nodeTypes = { majorNode: MajorNode };

export default function MajorFlow() {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

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

    return (
        <div className='w-full h-full'>
            <ReactFlowProvider>
                <DagreNodePositioning />
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
            </ReactFlowProvider>

        </div>
    );
}