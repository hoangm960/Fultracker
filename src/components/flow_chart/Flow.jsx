import ReactFlow from 'reactflow';
import MainBlock from './MainBlock';
import CourseBlock from './CourseBlock';
import 'reactflow/dist/style.css';

import majorData from "@data/major.json"

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
      nodes[i * 1 + j * 1 + 1]["position"]["x"] = 200 * (j * 1 + 0.5 - flow.length / 2)
      nodes[i * 1 + j * 1 + 1]["position"]["y"] = nodes[i * 1]["position"]["y"] - 80;
    }
  }

  for (const [nodeID, node] of Object.entries(flowData["flows"]["course"])) {
    const courses = node["courses"];
    const nodeIdx = nodes.findIndex(node => node["id"] == nodeID)
    for (let courseIdx = 0; courseIdx < courses.length; courseIdx++) {
      const courseID = courses[courseIdx];
      console.log(courseID);
      const nodeData = {
        id: courseID,
        type: 'courseBlock',
        position: {
          x: nodeIdx % 2 === 0 ? 200 : -150,
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


  return [nodes, edges];
}


function Flow(props) {
  const proOptions = { hideAttribution: true };
  const nodeTypes = { mainBlock: MainBlock, courseBlock: CourseBlock };

  let [nodes, edges] = [[], []]
  if (props.major != "") {
    const flowData = majorData[props.major]["requirements"]["major"];
    [nodes, edges] = getNodesAndEdges(flowData);
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      fitView
      proOptions={proOptions}
    />
  );
}

export default Flow;