import { Handle, Position } from 'reactflow';

function CourseBlock({ data }) {
  return (
    <div className="h-12 border-[1px] border-black border-solid rounded-md p-1 bg-white">
      <p>
        {data["course"]}
      </p>

      <Handle
        id="course"
        type={data["position"] == "right" ? "target" : "source"}
        position={Position.Right}
        isConnectable={false}
      />

      <Handle
        id="course"
        type={data["position"] == "left" ? "target" : "source"}
        position={Position.Left}
        isConnectable={false}
      />
    </div>
  );
}

export default CourseBlock;
