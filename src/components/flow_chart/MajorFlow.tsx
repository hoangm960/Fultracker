import { Background, Controls, ReactFlow, useEdgesState, useNodesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import MajorNode from './nodes/MajorNode';
import { useEffect } from 'react';
import majorData from '@data/major.json';
const nodeTypes = { majorNode: MajorNode };

export default function MajorFlow() {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        const majorNodes = majorData["MATH"]["declair"]["major"]["nodes"].map((major, index) => {
            return {
                id: `${index+1}`,
                type: 'majorNode',
                position: { x: 0, y: index * -100 },
                data: {
                    label: major.title,
                    major: major
                }
            }
        });
        setNodes(majorNodes);

        const majorEdges = majorData["MATH"]["declair"]["major"]["edges"].map((edge, index) => {
            return {
                id: `${index+1}`,
                source: `${edge[0]}`,
                target: `${edge[1]}`,
            }
        });
        setEdges(majorEdges);
    }, []);

    return (
        <div className='w-full h-full'>
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

        </div>
    );
}