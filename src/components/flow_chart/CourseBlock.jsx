import { memo } from 'react';
import { Handle, Position } from 'reactflow';


export default memo(({ data }) => {
  const title = data.disabled ? 
  <del>
    {data["courseID"]}
  </del> : 
  data["courseID"];
  
  return (
    <div className="h-12 w-24 border-[1px] border-text border-solid rounded-md p-1 bg-highlight text-text text-center flex items-center justify-center hover:shadow-2xl hover:opacity-80">
      <p className="text-lg font-semibold">

        {title}
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
