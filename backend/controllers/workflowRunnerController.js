const Workflow = require("../model/WorkflowSchema");
const WorkflowRun = require("../model/WorkflowRun");

// Helper: simulate delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 🔧 Execute a single node based on its type
async function executeNode(node) {
  const { type, config } = node.data;

  switch (type) {
    case "trigger":
      return { status: "triggered" };

    case "action":
      // Simulate action (like email, DB write, etc.)
      return {
        status: "success",
        output: `Action executed (${node.data.label})`,
      };

    case "condition":
      const condition = config?.condition || "";
      const passed = eval(condition); // ⚠️ WARNING: Only use trusted config for `eval`
      return {
        status: "success",
        output: `Condition evaluated: ${passed}`,
        nextNodeId: passed ? config.trueNodeId : config.falseNodeId,
      };

    case "delay":
      const duration = parseInt(config?.duration || 1000);
      await delay(duration);
      return { status: "delayed", output: `Waited ${duration}ms` };

    default:
      return { status: "skipped", output: "Unknown node type" };
  }
}

// 🔁 Execute full workflow
async function executeWorkflow(workflow, runId) {
  const nodeMap = new Map();
  workflow.nodes.forEach((n) => nodeMap.set(n.id, n));

  const edgeMap = new Map(); // source -> [targets]
  workflow.edges.forEach((e) => {
    if (!edgeMap.has(e.source)) edgeMap.set(e.source, []);
    edgeMap.get(e.source).push(e.target);
  });
  //   console.log(workflow.nodes, "workflow.nodes");
  //   return;
  let currentNodeId = workflow.nodes.find((n) => n.data.type === "trigger")?.id;

  while (currentNodeId) {
    const currentNode = nodeMap.get(currentNodeId);
    const result = await executeNode(currentNode);

    await WorkflowRun.findByIdAndUpdate(runId, {
      $push: {
        logs: {
          step: currentNode.data.label || currentNode.data.type,
          status: result.status,
          output: result.output,
          timestamp: new Date(),
        },
      },
    });

    if (currentNode.data.type === "condition") {
      currentNodeId = result.nextNodeId;
    } else {
      currentNodeId = edgeMap.get(currentNodeId)?.[0] || null;
    }
  }

  await WorkflowRun.findByIdAndUpdate(runId, { status: "completed" });
}

// 🔘 Test Trigger Endpoint
exports.testWorkflowTrigger = async (req, res) => {
  try {
    const workflowId = req.params.id;
    const workflow = await Workflow.findById(workflowId);
    // console.log(workflow, "workflowworkflow");
    // return
    if (!workflow) return res.status(404).json({ error: "Workflow not found" });

    // console.log(workflow, " run._id");
    // return;
    const run = await WorkflowRun.create({
      workflowId,
      status: "running",
      logs: [],
    });
    executeWorkflow(workflow, run._id); // Async execution
    res.json({ message: "Workflow execution started", runId: run._id });
  } catch (err) {
    console.error("Execution error:", err);
    res.status(500).json({ error: "Execution failed" });
  }
};
