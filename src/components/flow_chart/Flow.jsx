import ReactFlow from 'reactflow';
import MainBlock from './MainBlock';
import 'reactflow/dist/style.css';

import majorData from "@data/major.json"

function getNodesAndEdges(flowData) {
  let nodes = [
    {
      id: flowData[0]['id'],
      type: 'mainBlock',
      position: { x: 0, y: 0 },
      data: flowData[0]
    }
  ];
  
  let edges = [];
  
  for (let i = 1; i < flowData.length; i++) {
    const previousElement = flowData[i - 1];
    const currentElement = flowData[i];
    let nodeData = {
      id: currentElement['id'],
      type: 'mainBlock',
      targetPosition: 'bottom',
      position: { x: 0, y: -(80 * i) },
      data: currentElement
    };
    let edgeData = {
      id: `edge-${i}`,
      source: previousElement['id'],
      target: currentElement['id'],
      sourceHandle: "main"
    };
    if (Array.isArray(currentElement)) {
      for (let j = 0; j < currentElement.length; j++) {
        const element = currentElement[j];
        nodeData = {
          id: element['id'],
          type: 'mainBlock',
          targetPosition: 'bottom',
          position: { x: 200*(j + 1 - currentElement.length / 2), y: -(80 * i) },
          data: element
        };
        edgeData = {
          id: `edge-${i}-${j+1}`,
          source: previousElement['id'],
          target: element['id'],
          sourceHandle: "main"
        };
        
        nodes.push(nodeData);
        edges.push(edgeData);
      };
    } else{ 
      nodes.push(nodeData);
      edges.push(edgeData);
    }
  }
  
  return [nodes, edges];
}

const proOptions = { hideAttribution: true };

const flowData = majorData["MATH"]["requirements"]["major"]["flow"];
console.log(getNodesAndEdges(flowData));
let [nodes, edges] = getNodesAndEdges(flowData);

const nodeTypes = { mainBlock: MainBlock };

function Flow() {
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