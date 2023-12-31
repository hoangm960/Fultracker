import { Handle, Position } from 'reactflow';

function CourseBlock({ data }) {
  return (
    <div className="h-12 border-[1px] border-black border-solid rounded-md p-1 bg-highlight text-text">
      <p className="text-lg font-semibold">
        {data["course"]}
      </p>

      <Handle
        id="r"
        type="source"
        position={Position.Right}
        isConnectable={false}
      />

      <Handle
        id="r"
        type="source"
        position={Position.Left}
        isConnectable={false}
      />
    </div>
  );
}

export default CourseBlock;
