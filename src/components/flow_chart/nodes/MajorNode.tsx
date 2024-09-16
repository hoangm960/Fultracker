import { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';

export default function MajorNode({ data }) {

  return (
    <>
      <Handle type="source" position={Position.Top} />
      <div>
        <label htmlFor="text">{data.label}</label>
      </div>
      <Handle type="target" position={Position.Bottom} />
    </>
  );
}