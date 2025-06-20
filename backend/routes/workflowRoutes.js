const express = require("express");
const router = express.Router();
const workflowController = require("../controllers/workflowController");
const workflowRunnerController = require("../controllers/workflowRunnerController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, workflowController.createWorkflow);
router.get("/", protect, workflowController.getAllWorkflows);
router.get("/:id", protect, workflowController.getWorkflowById);
router.delete("/:id", protect, workflowController.deleteWorkflow);
router.put("/:id", protect, workflowController.updateWorkflow);
router.post("/:id/test", workflowRunnerController.testWorkflowTrigger);
router.post("/:id/trigger", protect, workflowController.testTrigger);
router.get("/:id/runs", protect, workflowController.getWorkflowRuns);
module.exports = router;
