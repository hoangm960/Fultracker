import majorData from "@data/major.json";
import MajorDropdown from "@components/flow_chart/MajorDropdown";
import FlowRadioBox from "@components/flow_chart/FlowRadioBox";
import ReactFlow, { Background, Controls, ReactFlowProvider, useEdgesState, useNodesState } from "reactflow";
import MainBlock from "./MainBlock";
import CourseBlock from "./CourseBlock";
import 'reactflow/dist/style.css';


function getNodesAndEdges(flowData) {
    let nodes = [];
    for (const [index, [id, node]] of Object.entries(Object.entries(flowData["nodes"]))) {
        nodes.push({
            id: id,
            type: 'mainBlock',
            targetPosition: 'bottom',
            position: { x: 0, y: -(80 * index) },
            data: node
        });
    }

    let edges = [];
    for (const [i, [id, flow]] of Object.entries(Object.entries(flowData["flows"]["main"]))) {
        for (const [j, nextNodeID] of Object.entries(flow)) {
            edges.push({
                id: `${id}-${nextNodeID}`,
                source: id,
                target: nextNodeID,
                sourceHandle: "main"
            });
            nodes[i * 1 + j * 1 + 1]["position"]["x"] = 300 * (j * 1 + 0.5 - flow.length / 2)
            nodes[i * 1 + j * 1 + 1]["position"]["y"] = nodes[i * 1]["position"]["y"] - 100;
        }
    }

    if (flowData["flows"]["course"]) {
        for (const [nodeID, node] of Object.entries(flowData["flows"]["course"])) {
            const courses = node["courses"];
            const nodeIdx = nodes.findIndex(node => node["id"] == nodeID)
            for (let courseIdx = 0; courseIdx < courses.length; courseIdx++) {
                const courseID = courses[courseIdx];
                const nodeData = {
                    id: courseID,
                    type: 'courseBlock',
                    position: {
                        x: nodeIdx % 2 === 0 ? 300 : -150,
                        y: 60 * (courseIdx + 0.5 - courses.length / 2) + nodes[nodeIdx]["position"]["y"]
                    },
                    data: {
                        course: courseID,
                        position: nodeIdx % 2 === 0 ? "left" : "right"
                    }
                };
                const edgeData = {
                    id: `${nodeID}-${courseID}`,
                    source: nodeID,
                    target: courseID,
                    sourceHandle: nodeIdx % 2 === 0 ? "courseRight" : "courseLeft"
                };

                nodes.push(nodeData);
                edges.push(edgeData);
            };
        }
    }

    return [nodes, edges];
}

const proOptions = { hideAttribution: true };
const nodeTypes = { mainBlock: MainBlock, courseBlock: CourseBlock };

const ProviderFlow = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const updateFlow = () => {
        const majorSelect = document.getElementById("major");
        const flowRadios = document.getElementsByName("flow-radio");
        let selectedFlow;
        flowRadios.forEach((radio) => {
            if (radio.checked) {
                selectedFlow = radio.value;
            }
        });
        const [newNodes, newEdges] = getNodesAndEdges(majorData[majorSelect.value.toUpperCase()]["flow-chart"][selectedFlow]);
        setNodes(newNodes);
        setEdges(newEdges);
    }

    return (
        <ReactFlowProvider>
            <div className="flex flex-row w-full gap-1">
                <MajorDropdown updateFlow={updateFlow} />
                <FlowRadioBox updateFlow={updateFlow} />
            </div>
            <div id="flow-box" class="h-full w-full">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    nodeTypes={nodeTypes}
                    fitView
                    proOptions={proOptions}
                >
                    <Background />
                    <Controls />
                </ReactFlow>
            </div>
        </ReactFlowProvider>
    );
};

export default ProviderFlow;
