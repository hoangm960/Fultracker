import { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';

export default function MajorNode({ data }) {

  return (
    <>
      <Handle
        type="source"
        position={Position.Top}
        isConnectable={false}
      />
      <div
        className="bg-background border-[1px] border-text border-solid rounded-md p-5 text-text text-center flex items-center justify-center hover:shadow-2xl hover:opacity-80"

      >
        <label htmlFor="text" className="text-lg font-semibold">{data.label}</label>
      </div>
      <Handle
        type="target"
        position={Position.Bottom}
        isConnectable={false}
      />
    </>
  );
}