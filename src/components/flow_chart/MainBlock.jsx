import { Handle, Position } from 'reactflow';

function MainBlock({ data }) {
  return (
    <div className="h-12 border-[1px] border-black border-solid rounded-md p-1 bg-white">
      <p>
        {data["name"]}
      </p>

      <Handle
        id="main"
        type="source"
        position={Position.Top}
        isConnectable={false}
        />

      <Handle
        id="course"
        type="source"
        position={Position.Right}
        isConnectable={false}
      />

      <Handle
        id="course"
        type="source"
        position={Position.Left}
        isConnectable={false}
      />

      <Handle
        id="course"
        type="target"
        position={Position.Bottom}
        isConnectable={false}
      />
    </div>
  );
}

export default MainBlock;
