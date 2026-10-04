import { useMemo, useState } from "react";
import "./App.css";
import ToolchainPage from "./Toolchain";

const navItems = [
  ["Overview", "▦"],
  ["Deployments", "↗"],
  ["Pipelines", "⑂"],
  ["Infrastructure", "▤"],
  ["Security", "⬡"],
  ["Monitoring", "◉"],
  ["Toolchain", "⑂"],
];

const initialDeployments = [
  {
    id: 1284,
    name: "deploypulse-frontend",
    branch: "main",
    commit: "a83f2c1",
    status: "Success",
    time: "2 min ago",
    duration: "1m 42s",
  },
  {
    id: 1283,
    name: "api-gateway",
    branch: "main",
    commit: "b72e9d4",
    status: "Success",
    time: "18 min ago",
    duration: "2m 08s",
  },
  {
    id: 1282,
    name: "auth-service",
    branch: "develop",
    commit: "c19a5f8",
    status: "Running",
    time: "Just now",
    duration: "—",
  },
  {
    id: 1281,
    name: "notification-service",
    branch: "main",
    commit: "d40b6e2",
    status: "Failed",
    time: "1 hour ago",
    duration: "0m 48s",
  },
];
const stages = [
  { name: "Source", detail: "Code checkout", icon: "⌘" },
  { name: "Build", detail: "Docker image", icon: "▣" },
  { name: "Test", detail: "Unit tests", icon: "✓" },
  { name: "Security", detail: "Trivy scan", icon: "⬡" },
  { name: "Deploy", detail: "Kubernetes", icon: "↗" },
];
const demoServices = [
  {
    name: "Frontend",
    type: "Web application",
    status: "Demo",
    detail: "React / Vite frontend",
  },
  {
    name: "API Gateway",
    type: "API",
    status: "Not connected",
    detail: "Backend endpoint not configured",
  },
  {
    name: "Database",
    type: "Data store",
    status: "Not connected",
    detail: "Database health check not configured",
  },
  {
    name: "Kubernetes",
    type: "Orchestration",
    status: "Not connected",
    detail: "No cluster connection configured",
  },
];
const demoFindings = [
  {
    package: "Example dependency",
    id: "DEMO-CVE-001",
    severity: "High",
    target: "frontend image",
    status: "Sample finding",
  },
  {
    package: "Example base image",
    id: "DEMO-CVE-002",
    severity: "Medium",
    target: "container image",
    status: "Sample finding",
  },
];

function PageHeading({
  eyebrow = "DEPLOYPULSE WORKSPACE",
  title,
  description,
  action,
  onAction,
}) {
  return (
    <section className="welcome-row">
      <div>
        <div className="eyebrow">
          <span /> {eyebrow}
        </div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action && (
        <button className="primary-button" onClick={onAction}>
          <span>＋</span> {action}
        </button>
      )}
    </section>
  );
}
function Panel({ title, description, children, action, onAction }) {
  return (
    <article className="panel" style={{ marginBottom: 18 }}>
      <div className="panel-heading">
        <div>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        {action && (
          <button className="secondary-button" onClick={onAction}>
            {action}
          </button>
        )}
      </div>
      {children}
    </article>
  );
}
function Notice({ children }) {
  return (
    <p
      role="status"
      style={{
        padding: "10px 13px",
        border: "1px solid rgba(139,124,255,.35)",
        borderRadius: 10,
        color: "#b9adff",
        background: "rgba(139,124,255,.08)",
        fontSize: 12,
      }}
    >
      {children}
    </p>
  );
}
function EmptyIntegration({ name }) {
  return (
    <Notice>
      {name} is not connected yet. This page is interactive, but live results
      require a backend integration and configured credentials.
    </Notice>
  );
}

function OverviewPage({ setActiveNav }) {
  const metrics = [
    {
      label: "Total Deployments",
      value: "1,284",
      change: "Sample data",
      icon: "↗",
    },
    { label: "Success Rate", value: "98.6%", change: "Sample data", icon: "✓" },
    {
      label: "Avg. Build Time",
      value: "2m 34s",
      change: "Sample data",
      icon: "◷",
    },
    {
      label: "Active Services",
      value: "4",
      change: "Integrations pending",
      icon: "⌘",
    },
  ];
  return (
    <>
      <PageHeading
        title="Good morning, Admin"
        description="Your deployment command center. The metrics below are illustrative demo data."
        action="New deployment"
        onAction={() => setActiveNav("Deployments")}
      />
      <section className="metrics-grid">
        {metrics.map((m, i) => (
          <article className="metric-card" key={m.label}>
            <div className="metric-top">
              <span>{m.label}</span>
              <span className={`metric-icon icon-${i}`}>{m.icon}</span>
            </div>
            <div className="metric-value">{m.value}</div>
            <div className="metric-foot">
              <span className="good">{m.change}</span>
            </div>
            <div className={`sparkline spark-${i}`}>
              {Array.from({ length: 12 }, (_, j) => (
                <i key={j} />
              ))}
            </div>
          </article>
        ))}
      </section>
      <section className="content-grid">
        <Panel
          title="Deployment pipeline"
          description="Illustrative CI/CD workflow"
          action="Open pipelines →"
          onAction={() => setActiveNav("Pipelines")}
        >
          <div className="pipeline-track">
            {stages.map((s, i) => (
              <div className="pipeline-stage" key={s.name}>
                <div
                  className={`stage-node ${i < 3 ? "complete" : i === 3 ? "current" : ""}`}
                >
                  {s.icon}
                </div>
                <strong>{s.name}</strong>
                <small>{s.detail}</small>
                {i < stages.length - 1 && (
                  <div
                    className={`stage-connector ${i < 2 ? "connected" : ""}`}
                  />
                )}
              </div>
            ))}
          </div>
          <Notice>
            No pipeline has been executed from this dashboard yet.
          </Notice>
        </Panel>
        <Panel
          title="Integration status"
          description="Connection status, not simulated health metrics"
        >
          {demoServices.map((s) => (
            <div className="health-row" key={s.name}>
              <div className="health-info">
                <span className="service-icon">⌘</span>
                <strong>{s.name}</strong>
                <span className="service-status">
                  <i />
                  {s.status}
                </span>
              </div>
              <small style={{ color: "#9294ad" }}>{s.detail}</small>
            </div>
          ))}
        </Panel>
      </section>
      <Panel
        title="Recent deployments"
        description="Example records for UI preview"
        action="View all →"
        onAction={() => setActiveNav("Deployments")}
      >
        <DeploymentTable rows={initialDeployments.slice(0, 3)} />
      </Panel>
    </>
  );
}
function DeploymentTable({ rows, onInspect }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>SERVICE</th>
            <th>BRANCH</th>
            <th>COMMIT</th>
            <th>STATUS</th>
            <th>TIME</th>
            <th>DURATION</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((d) => (
            <tr key={d.id}>
              <td>
                <span className="service-symbol">▣</span>
                <strong>{d.name}</strong>
              </td>
              <td>
                <span className="branch-pill">⑂ {d.branch}</span>
              </td>
              <td>
                <code>{d.commit}</code>
              </td>
              <td>
                <span className={`deployment-status ${d.status.toLowerCase()}`}>
                  <i />
                  {d.status}
                </span>
              </td>
              <td>{d.time}</td>
              <td>{d.duration}</td>
              <td>
                <button
                  className="row-menu"
                  aria-label={`Inspect ${d.name}`}
                  onClick={() => onInspect?.(d)}
                >
                  ···
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function DeploymentsPage() {
  const [rows, setRows] = useState(initialDeployments);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState(
    "Records shown are local demo data; no deployment service is connected.",
  );
  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          (filter === "All" || r.status === filter) &&
          `${r.name} ${r.branch} ${r.commit}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [rows, filter, query],
  );
  const startDemo = () => {
    const id = Math.max(...rows.map((r) => r.id), 0) + 1;
    setRows([
      {
        id,
        name: "deploypulse-frontend",
        branch: "main",
        commit: "local-demo",
        status: "Queued",
        time: "Just now",
        duration: "—",
      },
      ...rows,
    ]);
    setMessage(
      "A local demo deployment record was added. No real deployment was triggered.",
    );
  };
  return (
    <>
      <PageHeading
        title="Deployments"
        description="Search deployment records and inspect release history."
        action="＋ New deployment"
        onAction={startDemo}
      />
      <Notice>{message}</Notice>
      <Panel
        title="Deployment history"
        description={`${filtered.length} matching records`}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          <input
            className="toolchain-search"
            placeholder="Search service, branch, commit…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="toolchain-search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>All</option>
            <option>Success</option>
            <option>Running</option>
            <option>Failed</option>
            <option>Queued</option>
          </select>
        </div>
        <DeploymentTable
          rows={filtered}
          onInspect={(d) =>
            setMessage(
              `Deployment #${d.id}: ${d.name} · ${d.status}. These are example records, not connected deployment logs.`,
            )
          }
        />
      </Panel>
    </>
  );
}
function PipelinesPage() {
  const [runs, setRuns] = useState([
    { id: 1284, status: "Demo only", time: "Example run", branch: "main" },
  ]);
  const [message, setMessage] = useState(
    "Connect Jenkins to execute a real pipeline.",
  );
  const runDemo = () => {
    const id = Math.max(...runs.map((r) => r.id), 0) + 1;
    setRuns([
      {
        id,
        status: "Not executed",
        time: new Date().toLocaleString(),
        branch: "main",
      },
      ...runs,
    ]);
    setMessage("Added a local run entry only. Jenkins was not called.");
  };
  return (
    <>
      <PageHeading
        title="Pipelines"
        description="Review CI/CD stages and pipeline run records."
        action="Run demo"
        onAction={runDemo}
      />
      <Notice>{message}</Notice>
      <Panel
        title="Delivery workflow"
        description="Configured stages shown for planning; execution is not connected."
      >
        <div className="pipeline-track">
          {stages.map((s, i) => (
            <div className="pipeline-stage" key={s.name}>
              <div
                className={`stage-node ${i < 3 ? "complete" : i === 3 ? "current" : ""}`}
              >
                {s.icon}
              </div>
              <strong>{s.name}</strong>
              <small>{s.detail}</small>
              {i < stages.length - 1 && (
                <div
                  className={`stage-connector ${i < 2 ? "connected" : ""}`}
                />
              )}
            </div>
          ))}
        </div>
        <EmptyIntegration name="Jenkins" />
      </Panel>
      <Panel title="Run history" description="Local preview records">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>RUN</th>
                <th>BRANCH</th>
                <th>TIME</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((r) => (
                <tr key={r.id}>
                  <td>#{r.id}</td>
                  <td>{r.branch}</td>
                  <td>{r.time}</td>
                  <td>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
function InfrastructurePage() {
  const [selected, setSelected] = useState("Docker");
  return (
    <>
      <PageHeading
        title="Infrastructure"
        description="Inspect the infrastructure integrations planned for DeployPulse."
      />
      <div className="metrics-grid">
        {[
          { name: "Docker", desc: "Container engine and image inventory" },
          { name: "Kubernetes", desc: "Deployments, pods and services" },
          { name: "Terraform", desc: "Infrastructure as code" },
          { name: "Ansible", desc: "Configuration automation" },
        ].map((x) => (
          <button
            className="metric-card"
            key={x.name}
            onClick={() => setSelected(x.name)}
            style={{
              textAlign: "left",
              color: "inherit",
              cursor: "pointer",
              border: selected === x.name ? "1px solid #8b7cff" : undefined,
            }}
          >
            <div className="metric-top">
              <span>{x.name}</span>
              <span className="metric-icon">↗</span>
            </div>
            <strong>{x.desc}</strong>
            <div className="metric-foot">
              <span>Not connected</span>
            </div>
          </button>
        ))}
      </div>
      <Panel
        title={`${selected} integration`}
        description="Integration details"
      >
        <p style={{ color: "#b5b6ca", lineHeight: 1.7 }}>
          {selected} controls will appear here after its backend connection is
          configured. The browser dashboard cannot safely query host
          infrastructure directly.
        </p>
        <EmptyIntegration name={selected} />
      </Panel>
    </>
  );
}
function SecurityPage() {
  const [severity, setSeverity] = useState("All");
  const [scanned, setScanned] = useState(false);
  const findings = demoFindings.filter(
    (f) => severity === "All" || f.severity === severity,
  );
  return (
    <>
      <PageHeading
        title="Security"
        description="Review sample vulnerability findings and planned image-scanning integration."
        action="Simulate scan"
        onAction={() => setScanned(true)}
      />
      {scanned && (
        <Notice>
          Demo scan requested locally. Trivy was not executed because no scanner
          backend is connected.
        </Notice>
      )}
      <EmptyIntegration name="Trivy scanner" />
      <Panel title="Findings" description="Clearly labelled sample data">
        <div style={{ marginBottom: 14 }}>
          <select
            className="toolchain-search"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
          >
            <option>All</option>
            <option>High</option>
            <option>Medium</option>
          </select>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>PACKAGE / TARGET</th>
                <th>FINDING ID</th>
                <th>SEVERITY</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {findings.map((f) => (
                <tr key={f.id}>
                  <td>
                    <strong>{f.package}</strong>
                    <br />
                    <small>{f.target}</small>
                  </td>
                  <td>
                    <code>{f.id}</code>
                  </td>
                  <td>
                    <span
                      className={`deployment-status ${f.severity.toLowerCase()}`}
                    >
                      {f.severity}
                    </span>
                  </td>
                  <td>{f.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
function MonitoringPage() {
  const [checked, setChecked] = useState(false);
  return (
    <>
      <PageHeading
        title="Monitoring"
        description="Service observability and health-check integration status."
        action="Check integrations"
        onAction={() => setChecked(true)}
      />
      {checked && (
        <Notice>
          Checked dashboard configuration: no monitoring endpoints are
          configured, so no live health checks were performed.
        </Notice>
      )}
      <div className="metrics-grid">
        {[
          { label: "CPU usage", value: "—", change: "No metrics source" },
          { label: "Memory usage", value: "—", change: "No metrics source" },
          { label: "Request rate", value: "—", change: "No metrics source" },
          { label: "Error rate", value: "—", change: "No metrics source" },
        ].map((m) => (
          <article className="metric-card" key={m.label}>
            <div className="metric-top">
              <span>{m.label}</span>
            </div>
            <div className="metric-value">{m.value}</div>
            <div className="metric-foot">
              <span>{m.change}</span>
            </div>
          </article>
        ))}
      </div>
      <Panel
        title="Monitoring integrations"
        description="Connect a metrics source to display real measurements."
      >
        <div className="health-row">
          <div className="health-info">
            <strong>Prometheus</strong>
            <span className="service-status">Not connected</span>
          </div>
        </div>
        <div className="health-row">
          <div className="health-info">
            <strong>Grafana</strong>
            <span className="service-status">Not connected</span>
          </div>
        </div>
        <EmptyIntegration name="Prometheus / Grafana" />
      </Panel>
    </>
  );
}

function App() {
  const [activeNav, setActiveNav] = useState("Overview");
  const [notice, setNotice] = useState(false);
  const pageMap = {
    Overview: <OverviewPage setActiveNav={setActiveNav} />,
    Deployments: <DeploymentsPage />,
    Pipelines: <PipelinesPage />,
    Infrastructure: <InfrastructurePage />,
    Security: <SecurityPage />,
    Monitoring: <MonitoringPage />,
  };
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">D</div>
          <div>
            <strong>DeployPulse</strong>
            <span>DEVOPS PLATFORM</span>
          </div>
        </div>
        <div className="workspace-label">WORKSPACE</div>
        <div className="workspace">
          <span className="workspace-dot" /> Production{" "}
          <span className="chevron">⌄</span>
        </div>
        <div className="nav-label">PLATFORM</div>
        {navItems.map(([label, icon]) => (
          <button
            key={label}
            className={`nav-item ${activeNav === label ? "active" : ""}`}
            onClick={() => setActiveNav(label)}
          >
            <span className="nav-icon">{icon}</span>
            {label}
            {label === "Security" && <span className="nav-badge">2</span>}
          </button>
        ))}
        <div className="sidebar-bottom">
          <div className="online-card">
            <span className="pulse-dot" />
            <div>
              <strong>Demo workspace</strong>
              <small>Live integrations not configured</small>
            </div>
          </div>
          <div className="profile">
            <div className="avatar">PR</div>
            <div>
              <strong>Project Admin</strong>
              <small>Free workspace</small>
            </div>
            <button
              className="row-menu"
              aria-label="Profile options"
              onClick={() => setNotice(!notice)}
            >
              ···
            </button>
          </div>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> <strong>{activeNav}</strong>
          </div>
          <div className="top-actions">
            <span className="live-status">
              <i /> Demo environment
            </span>
            <button
              className="icon-button"
              aria-label="Notifications"
              onClick={() => setNotice(!notice)}
            >
              ♧<b />
            </button>
            <div className="avatar">PR</div>
          </div>
        </header>
        <div
          className={`page-content ${activeNav === "Toolchain" ? "hidden" : ""}`}
        >
          {notice && (
            <Notice>
              DeployPulse is running in demo mode. Connect a backend before
              using real deployment, security, or infrastructure operations.
            </Notice>
          )}
          {pageMap[activeNav]}
          <footer className="footer">
            <span>© 2026 DeployPulse · DevOps dashboard</span>
            <span>
              <i /> Demo mode · integrations pending
            </span>
          </footer>
        </div>
        {activeNav === "Toolchain" && (
          <div className="page-content">
            <ToolchainPage />
          </div>
        )}
      </main>
    </div>
  );
}
export default App;
