import { Handle, Position } from 'reactflow';

function TextUpdaterNode({ data }) {
  console.log(data);
  return (
    <div className="h-12 border-2 border-solid p-1 bg-white">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={false}
      />

      <p>
        {data["name"]}
      </p>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={false}
      />
    </div>
  );
}

export default TextUpdaterNode;
