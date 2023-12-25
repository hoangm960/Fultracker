import { Handle, Position } from 'reactflow';

function MainBlock({ data }) {
  return (
    <div className="h-fit w-60 border-[1px] border-black border-solid rounded-md p-1 bg-background text-text text-center">
      <p className="text-lg font-semibold">
        {data["name"]}
      </p>
      <p className="text-sm italic">
        ({data["quantity"]} required)
      </p>

      <Handle
        id="main"
        type="source"
        position={Position.Top}
        isConnectable={false}
        />

      <Handle
        id="courseRight"
        type="source"
        position={Position.Right}
        isConnectable={false}
      />

      <Handle
        id="courseLeft"
        type="source"
        position={Position.Left}
        isConnectable={false}
      />

      <Handle
        id="main"
        type="target"
        position={Position.Bottom}
        isConnectable={false}
      />
    </div>
  );
}

export default MainBlock;
