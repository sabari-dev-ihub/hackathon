import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const WorkflowDashboard = () => {
  const [workflows, setWorkflows] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");
  const navigate = useNavigate();

  const fetchWorkflows = async () => {
    try {
      const res = await api.get("/workflows");
      setWorkflows(res.data);
    } catch (err) {
      console.error("Error fetching workflows", err);
    }
  };

  const handleLoad = (wf) => {
    localStorage.setItem("loadedWorkflow", JSON.stringify(wf));
    navigate("/");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this workflow?")) return;

    try {
      await api.delete(`/workflows/${id}`);
      setWorkflows((prev) => prev.filter((w) => w._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleRename = (id, currentName) => {
    setEditingId(id);
    setNewName(currentName);
  };

  const handleRenameSubmit = async (id) => {
    try {
      const res = await api.put(`/workflows/${id}`, { name: newName });
      setWorkflows((prev) =>
        prev.map((w) => (w._id === id ? { ...w, name: res.data.name } : w))
      );
      setEditingId(null);
    } catch (err) {
      console.error("Rename failed", err);
    }
  };
  const handleTrigger = async (id) => {
    try {
      const res = await api.post(`/workflows/${id}/trigger`);
      alert("Workflow executed successfully!");
    } catch (err) {
      console.error("Trigger failed", err);
      alert("Trigger failed");
    }
  };
  useEffect(() => {
    fetchWorkflows();
  }, []);

  return (
    <div className="p-4">
      <h4 className="mb-4">📋 My Workflows</h4>

      {workflows.length === 0 ? (
        <p>No workflows found.</p>
      ) : (
        <div className="list-group">
          {workflows.map((wf) => (
            <div
              key={wf._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div style={{ flex: 1 }}>
                {editingId === wf._id ? (
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onBlur={() => handleRenameSubmit(wf._id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRenameSubmit(wf._id);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    className="form-control"
                    autoFocus
                  />
                ) : (
                  <>
                    <h6
                      className="mb-1"
                      onClick={() => handleRename(wf._id, wf.name)}
                      style={{ cursor: "pointer" }}
                    >
                      ✏️ {wf.name}
                    </h6>
                    <small className="text-muted">
                      Created: {new Date(wf.createdAt).toLocaleString()}
                    </small>
                  </>
                )}
              </div>
              <div>
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => handleLoad(wf)}
                >
                  ▶ Load
                </button>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleTrigger(wf._id)}
                >
                  🧪 Test Trigger
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(wf._id)}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkflowDashboard;
