// utils/executionEngine.js

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const handlers = {
  trigger: async (node, log) => {
    log.push({ node: node.id, type: node.type, status: "triggered" });
  },

  action: async (node, log) => {
    log.push({
      node: node.id,
      type: node.type,
      status: "executed",
      config: node.config,
    });
    // Simulate sending email / db update
  },

  condition: async (node, log) => {
    const passed = node.config?.value >= 50; // Dummy rule
    log.push({
      node: node.id,
      type: node.type,
      status: passed ? "passed" : "failed",
    });
    return passed;
  },

  delay: async (node, log) => {
    const ms = parseInt(node.config?.ms || 1000);
    log.push({ node: node.id, type: node.type, status: `waiting ${ms}ms` });
    await delay(ms);
  },
};

const buildGraph = (nodes, edges) => {
  const map = {};
  const inDegree = {};

  nodes.forEach((n) => {
    map[n.id] = { ...n, next: [] };
    inDegree[n.id] = 0;
  });

  edges.forEach((e) => {
    map[e.source].next.push(e.target);
    inDegree[e.target]++;
  });

  return { graph: map, inDegree };
};

const findStartNodes = (inDegree) => {
  return Object.keys(inDegree).filter((key) => inDegree[key] === 0);
};

const executeWorkflow = async (workflow) => {
  const { graph, inDegree } = buildGraph(workflow.nodes, workflow.edges);
  const queue = findStartNodes(inDegree);
  const log = [];

  while (queue.length) {
    const currentId = queue.shift();
    const node = graph[currentId];
    const type = node.type;

    const result = await handlers[type]?.(node, log);

    for (const nextId of node.next) {
      // Special: for condition node, only continue if passed
      if (type === "condition" && !result) continue;

      inDegree[nextId]--;
      if (inDegree[nextId] === 0) queue.push(nextId);
    }
  }

  return log;
};

module.exports = { executeWorkflow };
