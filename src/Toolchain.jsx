import { useCallback, useMemo, useState } from "react";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  BackgroundVariant,
  addEdge,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";

import {
  GitBranch,
  Boxes,
  ShieldCheck,
  Cloud,
  Settings,
  Network,
  Activity,
  BarChart3,
  Server,
  RefreshCw,
  X,
  CheckCircle2,
  AlertTriangle,
  CircleOff,
  Workflow,
  Zap,
  Rocket,
} from "lucide-react";

import "@xyflow/react/dist/style.css";

import "./Toolchain.css";

const initialNodes = [
  {
    id: "GitBranch",

    type: "toolNode",

    position: { x: 40, y: 150 },

    data: {
      name: "GitBranch",

      category: "SOURCE CONTROL",

      description: "Source code repository and version control.",

      status: "Healthy",

      icon: "GitBranch",

      detail:
        "Stores application source code and triggers the workflow when changes are pushed.",

      endpoint: "GitHub repository",

      role: "Source repository",
    },
  },

  {
    id: "jenkins",

    type: "toolNode",

    position: { x: 270, y: 150 },

    data: {
      name: "Jenkins",

      category: "CI / CD",

      description: "Build and test automation.",

      status: "Healthy",

      icon: "jenkins",

      detail:
        "Runs pipeline stages to install dependencies, test the application, and prepare build artifacts.",

      endpoint: "localhost:8080",

      role: "Continuous integration",
    },
  },

  {
    id: "docker",

    type: "toolNode",

    position: { x: 500, y: 150 },

    data: {
      name: "Docker",

      category: "CONTAINERS",

      description: "Package the application into an image.",

      status: "Healthy",

      icon: "docker",

      detail:
        "Builds a portable container image so the application can run consistently across environments.",

      endpoint: "Docker Engine",

      role: "Containerization",
    },
  },

  {
    id: "trivy",

    type: "toolNode",

    position: { x: 730, y: 150 },

    data: {
      name: "Trivy",

      category: "SECURITY",

      description: "Scan images for vulnerabilities.",

      status: "Warning",

      icon: "trivy",

      detail:
        "Scans container images and dependencies for known vulnerabilities and misconfigurations.",

      endpoint: "Image scanner",

      role: "Security scanning",
    },
  },

  {
    id: "terraform",

    type: "toolNode",

    position: { x: 500, y: 390 },

    data: {
      name: "Terraform",

      category: "PROVISIONING",

      description: "Provision infrastructure as code.",

      status: "Healthy",

      icon: "terraform",

      detail:
        "Defines and provisions infrastructure through repeatable configuration files.",

      endpoint: "Terraform CLI",

      role: "Infrastructure provisioning",
    },
  },

  {
    id: "ansible",

    type: "toolNode",

    position: { x: 730, y: 390 },

    data: {
      name: "Ansible",

      category: "CONFIGURATION",

      description: "Configure servers and environments.",

      status: "Healthy",

      icon: "ansible",

      detail:
        "Automates server configuration, application setup, and repeatable deployment tasks.",

      endpoint: "Ansible CLI",

      role: "Configuration management",
    },
  },

  {
    id: "kubernetes",

    type: "toolNode",

    position: { x: 960, y: 150 },

    data: {
      name: "Kubernetes",

      category: "ORCHESTRATION",

      description: "Manage application containers.",

      status: "Healthy",

      icon: "kubernetes",

      detail:
        "Schedules containers and manages deployment replicas, service discovery, and recovery.",

      endpoint: "Kubernetes cluster",

      role: "Container orchestration",
    },
  },

  {
    id: "deployment",
    type: "toolNode",
    position: { x: 1190, y: 150 },
    data: {
      name: "Deployment",
      category: "APPLICATION RELEASE",
      description: "Release the application to the target environment.",
      status: "Healthy",
      icon: "deployment",
      detail:
        "Represents the release stage after the application is packaged and scheduled by Kubernetes. This node is a visual demo and does not deploy the app by itself.",
      endpoint: "Target environment",
      role: "Application deployment",
    },
  },

  {
    id: "prometheus",

    type: "toolNode",

    position: { x: 960, y: 390 },

    data: {
      name: "Prometheus",

      category: "MONITORING",

      description: "Collect metrics and alerts.",

      status: "Healthy",

      icon: "prometheus",

      detail:
        "Collects time-series metrics from configured targets and supports alerting rules.",

      endpoint: "Metrics endpoint",

      role: "Metrics collection",
    },
  },

  {
    id: "grafana",

    type: "toolNode",

    position: { x: 1190, y: 390 },

    data: {
      name: "Grafana",

      category: "OBSERVABILITY",

      description: "Visualize system health.",

      status: "Healthy",

      icon: "grafana",

      detail:
        "Displays monitoring data in dashboards so teams can inspect application and infrastructure health.",

      endpoint: "Grafana dashboard",

      role: "Visualization",
    },
  },
];

const initialEdges = [
  {
    id: "e-GitBranch-jenkins",

    source: "GitBranch",

    target: "jenkins",

    animated: true,
  },

  {
    id: "e-jenkins-docker",

    source: "jenkins",

    target: "docker",

    animated: true,
  },

  { id: "e-docker-trivy", source: "docker", target: "trivy", animated: true },

  {
    id: "e-trivy-terraform",

    source: "trivy",

    target: "terraform",

    animated: true,
  },

  { id: "e-trivy-ansible", source: "trivy", target: "ansible", animated: true },

  {
    id: "e-terraform-kubernetes",

    source: "terraform",

    target: "kubernetes",

    animated: true,
  },

  {
    id: "e-ansible-kubernetes",

    source: "ansible",

    target: "kubernetes",

    animated: true,
  },
  {
    id: "e-kubernetes-deployment",
    source: "kubernetes",
    target: "deployment",
    animated: true,
    label: "Release",
  },
  {
    id: "e-deployment-prometheus",
    source: "deployment",
    target: "prometheus",
    animated: true,
  },

  {
    id: "e-prometheus-grafana",

    source: "prometheus",

    target: "grafana",

    animated: true,

    style: { strokeDasharray: "5 5" },
  },
];

const iconMap = {
  GitBranch: GitBranch,

  jenkins: Workflow,

  docker: Boxes,

  trivy: ShieldCheck,

  terraform: Cloud,

  ansible: Settings,

  kubernetes: Network,

  prometheus: Activity,

  grafana: BarChart3,
  deployment: Rocket,
};

function ToolNode({ data, selected }) {
  const Icon = iconMap[data.icon] || Server;

  const statusClass = data.status.toLowerCase();

  return (
    <div
      className={`tool-node ${statusClass} ${selected ? "node-selected" : ""}`}
    >
      <Handle type="target" position={Position.Left} className="tool-handle" />

      <div className="tool-node-top">
        <div className={`tool-icon ${data.icon}`}>
          <Icon size={19} strokeWidth={1.8} />
        </div>

        <span className={`tool-status-dot ${statusClass}`} />
      </div>

      <div className="tool-node-name">{data.name}</div>

      <div className="tool-node-category">{data.category}</div>

      <div className="tool-node-description">{data.description}</div>

      <div className={`tool-node-status ${statusClass}`}>
        {data.status === "Healthy" && <CheckCircle2 size={12} />}

        {data.status === "Warning" && <AlertTriangle size={12} />}

        {data.status === "Offline" && <CircleOff size={12} />}

        {data.status}
      </div>

      <Handle type="source" position={Position.Right} className="tool-handle" />
    </div>
  );
}

const nodeTypes = { toolNode: ToolNode };

const statusDescriptions = {
  Healthy: "This tool is marked healthy in the demo.",

  Warning: "This tool has a simulated warning. Review its configuration.",

  Offline: "This tool is marked offline in the demo.",
};

export default function ToolchainPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [selectedId, setSelectedId] = useState("jenkins");

  const [search, setSearch] = useState("");

  const [notice, setNotice] = useState("");

  const selectedNode = nodes.find((node) => node.id === selectedId);

  const healthyCount = nodes.filter(
    (node) => node.data.status === "Healthy",
  ).length;

  const warningCount = nodes.filter(
    (node) => node.data.status === "Warning",
  ).length;

  const offlineCount = nodes.filter(
    (node) => node.data.status === "Offline",
  ).length;

  const filteredNodes = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return nodes;

    return nodes.map((node) => ({
      ...node,

      hidden: !`${node.data.name} ${node.data.category} ${node.data.role}`

        .toLowerCase()

        .includes(term),
    }));
  }, [nodes, search]);

  const onConnect = useCallback(
    (params) => {
      setEdges((currentEdges) =>
        addEdge(
          {
            ...params,

            animated: true,

            style: { stroke: "#8b7cff", strokeWidth: 1.8 },
          },

          currentEdges,
        ),
      );

      setNotice("Connection added to the workflow.");
    },

    [setEdges],
  );

  const updateStatus = (status) => {
    if (!selectedNode) return;

    setNodes((currentNodes) =>
      currentNodes.map((node) =>
        node.id === selectedNode.id
          ? { ...node, data: { ...node.data, status } }
          : node,
      ),
    );

    setNotice(
      `${selectedNode.data.name} marked ${status.toLowerCase()} (demo only).`,
    );
  };

  const resetWorkflow = () => {
    setNodes(initialNodes.map((node) => ({ ...node, data: { ...node.data } })));

    setEdges(initialEdges.map((edge) => ({ ...edge })));

    setSelectedId("jenkins");

    setSearch("");

    setNotice("Workflow reset to the demo configuration.");
  };

  const runDemo = () => {
    setNotice("Demo run complete. No real pipeline was executed.");
  };

  return (
    <section className="toolchain-page">
      <div className="toolchain-heading">
        <div>
          <div className="toolchain-eyebrow">
            <Workflow size={14} /> WORKFLOW DESIGNER
          </div>

          <h1>
            Toolchain <span>Studio</span>
          </h1>

          <p>
            Explore your DevOps delivery path, connect tools, and inspect their
            demo status.
          </p>
        </div>

        <div className="toolchain-heading-actions">
          <button className="tc-button tc-button-quiet" onClick={resetWorkflow}>
            <RefreshCw size={15} /> Reset
          </button>

          <button className="tc-button tc-button-primary" onClick={runDemo}>
            <Zap size={15} /> Run demo
          </button>
        </div>
      </div>

      <div className="toolchain-stats">
        <div className="tc-stat">
          <span className="tc-stat-icon purple">
            <Workflow size={17} />
          </span>

          <div>
            <span>Connected tools</span>

            <strong>{nodes.length}</strong>
          </div>
        </div>

        <div className="tc-stat">
          <span className="tc-stat-icon green">
            <CheckCircle2 size={17} />
          </span>

          <div>
            <span>Healthy</span>

            <strong>{healthyCount}</strong>
          </div>
        </div>

        <div className="tc-stat">
          <span className="tc-stat-icon amber">
            <AlertTriangle size={17} />
          </span>

          <div>
            <span>Warnings</span>

            <strong>{warningCount}</strong>
          </div>
        </div>

        <div className="tc-stat">
          <span className="tc-stat-icon red">
            <CircleOff size={17} />
          </span>

          <div>
            <span>Offline</span>

            <strong>{offlineCount}</strong>
          </div>
        </div>
      </div>

      <div className="toolchain-workspace">
        <div className="workflow-panel">
          <div className="workflow-toolbar">
            <div className="workflow-toolbar-title">
              <span className="live-indicator" />

              <div>
                <strong>Deployment workflow</strong>

                <small>Drag nodes · Connect handles · Select a tool</small>
              </div>
            </div>

            <div className="workflow-toolbar-right">
              <input
                className="toolchain-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Find a tool..."
                aria-label="Find a tool"
              />

              <span className="workflow-version">DEMO V1.0</span>
            </div>
          </div>

          <div className="workflow-canvas">
            <ReactFlow
              nodes={filteredNodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={(_, node) => setSelectedId(node.id)}
              fitView
              fitViewOptions={{ padding: 0.08, minZoom: 0.42, maxZoom: 1.1 }}
              minZoom={0.2}
              maxZoom={1.6}
              defaultEdgeOptions={{
                animated: true,

                style: { stroke: "#6456a8", strokeWidth: 1.8 },
              }}
              proOptions={{ hideAttribution: true }}
            >
              <Background
                variant={BackgroundVariant.Dots}
                gap={20}
                size={1}
                color="#29283c"
              />

              <Controls />

              <MiniMap
                nodeColor={(node) => {
                  if (node.data.status === "Healthy") return "#36c994";

                  if (node.data.status === "Warning") return "#f2b84b";

                  return "#ff647c";
                }}
                maskColor="rgba(9, 10, 19, 0.72)"
              />
            </ReactFlow>
          </div>

          <div className="workflow-footer">
            <span>
              <i className="legend-dot healthy" /> Healthy
            </span>

            <span>
              <i className="legend-dot warning" /> Warning
            </span>

            <span>
              <i className="legend-dot offline" /> Offline
            </span>

            <span className="workflow-footer-hint">
              Connect nodes by dragging from a handle.
            </span>
          </div>
        </div>

        <aside className="tool-details-panel">
          {selectedNode ? (
            <>
              <div className="tool-details-header">
                <div>
                  <span className="panel-overline">TOOL INSPECTOR</span>

                  <h2>Node details</h2>
                </div>

                <button
                  className="tc-icon-button"
                  onClick={() => setSelectedId(null)}
                  aria-label="Close tool details"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="selected-tool-card">
                <div className={`selected-tool-icon ${selectedNode.data.icon}`}>
                  {(() => {
                    const Icon = iconMap[selectedNode.data.icon] || Server;

                    return <Icon size={24} />;
                  })()}
                </div>

                <div className="selected-tool-name">
                  <h3>{selectedNode.data.name}</h3>

                  <span>{selectedNode.data.category}</span>
                </div>
              </div>

              <div
                className={`inspector-status ${selectedNode.data.status.toLowerCase()}`}
              >
                {selectedNode.data.status === "Healthy" && (
                  <CheckCircle2 size={15} />
                )}

                {selectedNode.data.status === "Warning" && (
                  <AlertTriangle size={15} />
                )}

                {selectedNode.data.status === "Offline" && (
                  <CircleOff size={15} />
                )}

                <div>
                  <strong>{selectedNode.data.status}</strong>

                  <span>{statusDescriptions[selectedNode.data.status]}</span>
                </div>
              </div>

              <div className="inspector-section">
                <span className="panel-overline">OVERVIEW</span>

                <p>{selectedNode.data.detail}</p>
              </div>

              <div className="inspector-field">
                <span>Role</span>

                <strong>{selectedNode.data.role}</strong>
              </div>

              <div className="inspector-field">
                <span>Endpoint / target</span>

                <strong className="endpoint-value">
                  {selectedNode.data.endpoint}
                </strong>
              </div>

              <div className="inspector-field">
                <span>Incoming connections</span>

                <strong>
                  {
                    edges.filter((edge) => edge.target === selectedNode.id)
                      .length
                  }
                </strong>
              </div>

              <div className="inspector-field">
                <span>Outgoing connections</span>

                <strong>
                  {
                    edges.filter((edge) => edge.source === selectedNode.id)
                      .length
                  }
                </strong>
              </div>

              <div className="inspector-section status-controls-section">
                <span className="panel-overline">DEMO STATUS CONTROLS</span>

                <p>
                  Change this node's simulated status to test the interface.
                </p>

                <div className="status-control-buttons">
                  <button
                    className="status-control healthy-control"
                    onClick={() => updateStatus("Healthy")}
                  >
                    <CheckCircle2 size={14} /> Healthy
                  </button>

                  <button
                    className="status-control warning-control"
                    onClick={() => updateStatus("Warning")}
                  >
                    <AlertTriangle size={14} /> Warning
                  </button>

                  <button
                    className="status-control offline-control"
                    onClick={() => updateStatus("Offline")}
                  >
                    <CircleOff size={14} /> Offline
                  </button>
                </div>
              </div>

              <div className="inspector-note">
                <Activity size={15} />

                <span>
                  Demo mode: no credentials, external services, or real health
                  checks are connected.
                </span>
              </div>
            </>
          ) : (
            <div className="inspector-empty">
              <Network size={28} />

              <h3>Select a tool</h3>

              <p>
                Click any workflow node to inspect its status, role, and
                connections.
              </p>

              <button
                className="tc-button tc-button-quiet"
                onClick={() => setSelectedId("jenkins")}
              >
                Select Jenkins
              </button>
            </div>
          )}
        </aside>
      </div>

      {notice && (
        <div className="toolchain-toast" role="status">
          <CheckCircle2 size={15} />

          <span>{notice}</span>

          <button onClick={() => setNotice("")} aria-label="Dismiss message">
            <X size={14} />
          </button>
        </div>
      )}
    </section>
  );
}
