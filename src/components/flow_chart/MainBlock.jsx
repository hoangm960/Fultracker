import { memo } from 'react';
import { Handle, Position } from 'reactflow';

export default memo(({ data }) => {
  return (
    <div className="hover:shadow-2xl hover:opacity-80">
      <p className="text-lg font-semibold">
        {data["name"]}
      </p>
      {data["quantity"] ?
        <p className="text-sm italic">
          ({data["quantity"]} required)
        </p> : ""
      }
      <Handle
        id="t"
        type="source"
        position={Position.Top}
        isConnectable={false}
      />

      <Handle
        id="r"
        type="source"
        position={Position.Right}
        isConnectable={false}
      />

      <Handle
        id="b"
        type="source"
        position={Position.Bottom}
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
