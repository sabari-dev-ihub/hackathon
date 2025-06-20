import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import CanvasEditor from "./components/CanvasEditor";
import Login from "./pages/Login";
import Register from "./pages/Register";
import WorkflowDashboard from "./pages/WorkflowDashboard";
import api from "./services/api";
import MessageAlert from "./components/common/MessageAlert";
// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return isLoggedIn ? children : <Navigate to="/login" />;
};

// Layout with sidebar
function AppLayout({ children }) {
  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        <div className="col-md-3 bg-light p-3 border-end">
          <Sidebar />
        </div>
        <div className="col-md-9 p-0">{children}</div>
      </div>
    </div>
  );
}

// Main App
function App() {
  const handleSave = async (workflow) => {
    console.log("Saved Workflow JSON:", JSON.stringify(workflow, null, 2));
    try {
      const response = await api.post("/workflows", {
        name: "Untitled Workflow",
        nodes: workflow.nodes,
        edges: workflow.edges,
      });
      alert(`Workflow saved with ID: ${response.data._id}`);
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout>
                <CanvasEditor onSaveWorkflow={handleSave} />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <WorkflowDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
