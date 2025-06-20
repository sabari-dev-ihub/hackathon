import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-center">Modular Workflow Builder</h1>
      <p className="text-center">No-code automation for campus workflows</p>
      <div className="text-center">
        <Link to="/builder" className="btn btn-primary mt-3">
          Start Building
        </Link>
      </div>
    </div>
  );
};

export default Home;
