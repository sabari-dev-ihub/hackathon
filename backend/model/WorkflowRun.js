const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  step: String,
  status: String,
  output: String,
  timestamp: Date,
});

const WorkflowRunSchema = new mongoose.Schema({
  workflowId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workflow",
  },
  status: {
    type: String,
    enum: ["running", "completed", "failed"],
    default: "running",
  },
  logs: [logSchema],
});

module.exports = mongoose.model("WorkflowRun", WorkflowRunSchema);

