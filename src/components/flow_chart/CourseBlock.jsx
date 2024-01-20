import { memo } from 'react';
import { Handle, Position } from 'reactflow';


export default memo(({ data }) => {
  return (
    <div
      className="h-12 w-24 border-[1px] border-text border-solid rounded-md p-1 bg-highlight text-text text-center flex items-center justify-center hover:shadow-2xl hover:opacity-80"
      style={{backgroundColor: data.disabled? "#6d8f94" : "#dffcf6"}}
    >
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
