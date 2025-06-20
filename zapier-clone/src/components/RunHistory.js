import React, { useEffect, useState } from "react";
import api from "../services/api";

const RunHistory = ({ workflowId }) => {
  const [runs, setRuns] = useState([]);

  useEffect(() => {
    if (workflowId) {
      api.get(`/workflows/${workflowId}/runs`).then((res) => {
        console.log(res.data, "Run history data");
        setRuns(res.data);
      });
    }
  }, [workflowId]);

  return (
    <div>
      <h6 className="mt-3">🕒 Run History</h6>
      {runs.length === 0 ? (
        <p>No runs yet</p>
      ) : (
        <ul className="list-group">
          {runs.map((run) => (
            <li key={run._id} className="list-group-item">
              <div>
                <strong>Run:</strong> {new Date(run.startedAt).toLocaleString()}
              </div>
              {run.logs.map((step, idx) => (
                <div key={idx}>
                  ➤ [{step.status.toUpperCase()}] {step.status}
                </div>
              ))}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RunHistory;
