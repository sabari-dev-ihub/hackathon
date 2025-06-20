import React from "react";

const getNodeStyle = (type) => {
  switch (type) {
    case "trigger":
      return { background: "#007bff", color: "#fff" }; // Blue
    case "action":
      return { background: "#28a745", color: "#fff" }; // Green
    case "condition":
      return { background: "#ffc107", color: "#000" }; // Yellow
    case "delay":
      return { background: "#6c757d", color: "#fff" }; // Gray
    default:
      return { background: "#dee2e6", color: "#000" }; // Light gray
  }
};

const WorkflowNode = ({ data }) => {
  console.log(data, "data");
  const style = getNodeStyle(data.type);

  return (
    <div
      style={{
        padding: "10px 15px",
        borderRadius: 5,
        fontWeight: 500,
        border: "1px solid #ccc",
        textAlign: "center",
        ...style,
      }}
    >
      {data.label || "Node"}
    </div>
  );
};

export default WorkflowNode;
