import React, { useCallback, useRef, useState, useEffect } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
} from "react-flow-renderer";
import NodeConfigModal from "./NodeConfigModal";
import WorkflowNode from "./WorkflowNode";
import api from "../services/api";
import RunHistory from "./RunHistory";
import MessageAlert from "./common/MessageAlert";

let id = 1;
const getId = () => `${id++}`;

const nodeTypes = {
  default: WorkflowNode,
};

const CanvasEditor = ({ onSaveWorkflow }) => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [selectedNode, setSelectedNode] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [workflowId, setWorkflowId] = useState(null);
  const [workflowName, setWorkflowName] = useState("Untitled Workflow");

  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");

  // 1️⃣ Add Node
  const onDrop = (event) => {
    event.preventDefault();

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const type = event.dataTransfer.getData("application/reactflow");

    if (!type) return;

    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    };

    const newNode = {
      id: getId(),
      type: "default",
      position,
      data: {
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
        type,
        config: {},
      },
    };

    setNodes((nds) => nds.concat(newNode));
  };

  // 2️⃣ Save Config from Modal
  const handleSaveConfig = (nodeId, config) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, config } } : node
      )
    );
  };

  // 3️⃣ Save Workflow
  const handleSaveWorkflow = () => {
    const workflow = {
      name: workflowName,
      nodes: nodes.map((n) => ({
        id: n.id,
        position: n.position,
        data: {
          type: n.data.type,
          config: n.data.config || {},
          label:
            n.data.label ||
            `${
              n.data.type.charAt(0).toUpperCase() + n.data.type.slice(1)
            } Node`,
        },
      })),
      edges: edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
      })),
    };

    if (onSaveWorkflow) {
      onSaveWorkflow(workflow);
    }
  };

  // 4️⃣ Test Trigger Button
  const testTrigger = async () => {
    try {
      if (!workflowId) {
        setMessage("No workflow loaded to test.");
        setMessageType("success");
        return;
      }
      const res = await api.post(`/workflows/${workflowId}/test`);
      setMessage("Trigger test executed");
      setMessageType("success");
    } catch (err) {
      console.error("Test failed:", err);
      setMessage("Test failed");
      setMessageType("danger");
    }
  };

  // 🔁 Load Workflow from Backend
  const loadWorkflow = async (id) => {
    try {
      const res = await api.get(`/workflows/${id}`);
      const data = res.data;
      if (data) {
        loadWorkflowFromData(data);
        localStorage.setItem("loadedWorkflow", JSON.stringify(data));
      }
    } catch (err) {
      console.error("Load error:", err);
      setMessage("Test failed");
      setMessageType("danger");
    }
  };

  // 🔁 Normalize Nodes from JSON
  const loadWorkflowFromData = (data) => {
    const loadedNodes = data.nodes.map((n) => ({
      id: n.id,
      type: "default",
      position: n.position,
      data: {
        type: n.data?.type || "action",
        config: n.data?.config || {},
        label:
          n.data?.label ||
          `${
            n.data?.type?.charAt(0).toUpperCase() + n.data?.type?.slice(1)
          } Node`,
      },
    }));

    setNodes(loadedNodes);
    setEdges(data.edges || []);
    setWorkflowId(data._id || null);
    setWorkflowName(data.name || "Untitled Workflow");
  };

  // 🧠 Initialize
  useEffect(() => {
    const saved = localStorage.getItem("loadedWorkflow");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        loadWorkflowFromData(parsed);
        localStorage.removeItem("loadedWorkflow");
      } catch (e) {
        console.error("Parse error:", e);
      }
    }

    window.loadWorkflow = loadWorkflowFromData;
  }, []);

  return (
    <div className="w-100 h-100" ref={reactFlowWrapper}>
      <MessageAlert
        message={message}
        type={messageType}
        onClose={() => setMessage(null)}
      />
      <ReactFlowProvider>
        {/* Top Toolbar */}
        <div className="d-flex justify-content-between align-items-center p-2 bg-white border-bottom">
          <div className="d-flex align-items-center gap-2">
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="form-control"
              style={{ width: 250 }}
            />
            <button className="btn btn-primary" onClick={handleSaveWorkflow}>
              💾 Save
            </button>
            <button className="btn btn-outline-info" onClick={testTrigger}>
              ⚙️ Test Trigger
            </button>
          </div>
        </div>

        {/* Canvas */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={(params) => setEdges((eds) => addEdge(params, eds))}
          onDrop={onDrop}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
          }}
          onNodeClick={(e, node) => {
            setSelectedNode(node);
            setShowModal(true);
          }}
          fitView
          nodeTypes={nodeTypes}
        >
          <MiniMap />
          <Controls />
          <Background gap={16} />
        </ReactFlow>

        {/* Config Modal */}
        <NodeConfigModal
          show={showModal}
          onClose={() => setShowModal(false)}
          node={selectedNode}
          onSave={handleSaveConfig}
        />

        {/* Run History Footer */}
        <div className="p-3 border-top bg-light">
          <RunHistory workflowId={workflowId} />
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default CanvasEditor;
