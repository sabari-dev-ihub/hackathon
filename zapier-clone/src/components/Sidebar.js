import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const handleOpenEditor = () => {
    // Optional: set last opened workflow to localStorage
    // Example: loadWorkflow ID or a new one
    localStorage.removeItem("loadedWorkflow"); // clear to show blank canvas
    navigate("/"); // navigate to canvas editor
  };
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="d-flex flex-column h-100">
      <h4 className="mb-4">📦 Workflow Builder</h4>

      <div className="flex-grow-1">
        <Link
          to="/"
          onClick={handleOpenEditor}
          className="btn btn-outline-primary mb-2 w-100 text-start"
        >
          📝 Editor
        </Link>
        <Link
          to="/dashboard"
          className="btn btn-outline-secondary mb-2 w-100 text-start"
        >
          🧾 My Workflows
        </Link>
      </div>

      <div className="d-flex flex-column gap-2">
        <div
          className="p-2 bg-primary text-white rounded"
          draggable
          onDragStart={(e) => onDragStart(e, "trigger")}
        >
          ➕ Trigger
        </div>
        <div
          className="p-2 bg-success text-white rounded"
          draggable
          onDragStart={(e) => onDragStart(e, "action")}
        >
          ⚙️ Action
        </div>
        <div
          className="p-2 bg-warning text-dark rounded"
          draggable
          onDragStart={(e) => onDragStart(e, "condition")}
        >
          ❓ Condition
        </div>
        <div
          className="p-2 bg-secondary text-white rounded"
          draggable
          onDragStart={(e) => onDragStart(e, "delay")}
        >
          ⏱️ Delay
        </div>
      </div>

      {user && (
        <div className="border-top pt-3 mt-auto">
          <p className="small mb-1 text-muted">Logged in as:</p>
          <strong>{user.name}</strong>
          <button
            onClick={handleLogout}
            className="btn btn-sm btn-danger mt-2 w-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
