const Workflow = require("../model/WorkflowSchema");
const { executeWorkflow } = require("../utils/executionEngine");
const WorkflowRun = require("../model/WorkflowRun");

class WorkFlowController {
  async createWorkflow(req, res) {
    try {
      const workflow = new Workflow(req.body);
      await workflow.save();
      res.status(201).json(workflow);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  async getAllWorkflows(req, res) {
    try {
      const workflows = await Workflow.find().sort({ createdAt: -1 });
      res.json(workflows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  async getWorkflowById(req, res) {
    try {
      const workflow = await Workflow.findById(req.params.id);
      if (!workflow)
        return res.status(404).json({ error: "Workflow not found" });
      res.json(workflow);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  async deleteWorkflow(req, res) {
    try {
      const workflow = await Workflow.findByIdAndDelete(req.params.id);
      if (!workflow)
        return res.status(404).json({ error: "Workflow not found" });
      res.json({ message: "Workflow deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  async updateWorkflow(req, res) {
    try {
      const { name } = req.body;
      const updated = await Workflow.findByIdAndUpdate(
        req.params.id,
        { name },
        { new: true }
      );
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Rename failed" });
    }
  }
  async testTrigger(req, res) {
    try {
      const { id } = req.params;
      const workflow = await Workflow.findById(id);

      if (!workflow) {
        return res.status(404).json({ error: "Workflow not found" });
      }

      // ✅ Normalize node structure
      workflow.nodes = workflow.nodes.map((n) => ({
        ...n,
        data: {
          type: n.type || n.data?.type,
          label: n.label || n.data?.label || `${n.type} Node`,
          config: n.config || n.data?.config || {},
        },
      }));

      // console.log(workflow.nodes, "Normalized Nodes");
      // return
      // ✅ Safely find the trigger node
      const triggerNode = workflow.nodes.find(
        (n) => n.data?.type === "trigger"
      );

      if (!triggerNode) {
        return res.status(400).json({ error: "No trigger node found" });
      }

      // 🧠 Proceed to execute the workflow starting from trigger
      // console.log(workflow, triggerNode.id, "workflow, triggerNode.id");
      // return;
      await executeWorkflow(workflow, triggerNode.id);

      return res.json({ message: "Trigger executed successfully" });
    } catch (error) {
      console.error("Test Trigger Error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  async getWorkflowRuns(req, res) {
    try {
      const runs = await WorkflowRun.find({ workflowId: req.params.id }).sort({
        startedAt: -1,
      });
      res.json(runs);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch runs" });
    }
  }
}

module.exports = new WorkFlowController();
