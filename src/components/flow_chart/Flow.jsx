import ReactFlow from 'reactflow';
import MainBlock from './MainBlock';
import 'reactflow/dist/style.css';

import flowData from "@data/flow_chart.json"

const rfStyle = {
  backgroundColor: '#dffcf6',
};
const proOptions = { hideAttribution: true };

const flows = flowData["MATH"]["requirements"]["major"]["flow"]

const nodes = [
  {
    id: flows[0]["id"],
    type: 'MainBlock',
    position: { x: 0, y: 0 },
    data: flows[0]
  },
  {
    id: 'node-2',
    type: 'output',
    targetPosition: 'top',
    position: { x: 0, y: 200 },
    data: { label: 'node 2' },
  },
  {
    id: 'node-3',
    type: 'output',
    targetPosition: 'top',
    position: { x: 200, y: 200 },
    data: { label: 'node 3' },
  },
];

const edges = [
  { id: 'edge-1', source: flows[0]["id"], target: 'node-2'},
  { id: 'edge-2', source: flows[0]["id"], target: 'node-3'},
];

// we define the nodeTypes outside of the component to prevent re-renderings
// you could also use useMemo inside the component
const nodeTypes = { MainBlock: MainBlock };

function Flow() {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      fitView
      style={rfStyle}
      proOptions={proOptions}
    />
  );
}

export default Flow;