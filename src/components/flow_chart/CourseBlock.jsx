import { memo } from 'react';
import { Handle, Position } from 'reactflow';

export default memo(({ data }) => {
  return (
    <div className="h-12 w-24 border-[1px] border-black border-solid rounded-md p-1 bg-highlight text-text">
      <p className="text-lg font-semibold">
        {data["courseID"]}
      </p>

      <Handle
        id="r"
        type="source"
        position={Position.Right}
        isConnectable={false}
      />

      <Handle
        id="l"
        type="source"
        position={Position.Left}
        isConnectable={false}
      />
    </div>
  );
});
