import { useState } from "react";
import "./App.css";
import ToolchainPage from "./Toolchain";

const metrics = [
  { label: "Total Deployments", value: "1,284", change: "+12.8%", icon: "↗" },
  { label: "Success Rate", value: "98.6%", change: "+2.4%", icon: "✓" },
  { label: "Avg. Build Time", value: "2m 34s", change: "-18.2%", icon: "◷" },
  {
    label: "Active Services",
    value: "12/12",
    change: "All healthy",
    icon: "⌘",
  },
];

const deployments = [
  {
    name: "deploypulse-frontend",
    branch: "main",
    commit: "a83f2c1",
    status: "Success",
    time: "2 min ago",
    duration: "1m 42s",
  },
  {
    name: "api-gateway",
    branch: "main",
    commit: "b72e9d4",
    status: "Success",
    time: "18 min ago",
    duration: "2m 08s",
  },
  {
    name: "auth-service",
    branch: "develop",
    commit: "c19a5f8",
    status: "Running",
    time: "Just now",
    duration: "—",
  },
  {
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

function App() {
  const [activeNav, setActiveNav] = useState("Overview");

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
        {[
          ["Overview", "▦"],
          ["Deployments", "↗"],
          ["Pipelines", "⑂"],
          ["Infrastructure", "▤"],
          ["Security", "⬡"],
          ["Monitoring", "◉"],
          ["Toolchain", "⑂"],
        ].map(([label, icon]) => (
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
              <strong>All systems operational</strong>
              <small>Last checked just now</small>
            </div>
          </div>
          <div className="profile">
            <div className="avatar">PR</div>
            <div>
              <strong>Project Admin</strong>
              <small>Free workspace</small>
            </div>
            <span className="chevron">···</span>
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
              <i /> Live environment
            </span>
            <button className="icon-button" aria-label="Notifications">
              ♧<b />
            </button>
            <div className="avatar">PR</div>
          </div>
        </header>

        <div
          className={`page-content ${activeNav === "Toolchain" ? "hidden" : ""}`}
        >
          <section className="welcome-row">
            <div>
              <div className="eyebrow">
                <span /> YOUR DEPLOYMENT COMMAND CENTER
              </div>
              <h1>
                {activeNav === "Overview" ? "Good morning, Admin" : activeNav}
              </h1>
              <p>Here's what's happening across your infrastructure today.</p>
            </div>
            <button
              className="primary-button"
              onClick={() => setActiveNav("Pipelines")}
            >
              <span>＋</span> New deployment
            </button>
          </section>
          <section className="metrics-grid">
            {metrics.map((metric, index) => (
              <article className="metric-card" key={metric.label}>
                <div className="metric-top">
                  <span>{metric.label}</span>
                  <span className={`metric-icon icon-${index}`}>
                    {metric.icon}
                  </span>
                </div>
                <div className="metric-value">{metric.value}</div>
                <div className="metric-foot">
                  <span className={index === 2 ? "good" : "good"}>
                    ↗ {metric.change}
                  </span>
                  <span>vs last week</span>
                </div>
                <div className={`sparkline spark-${index}`}>
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              </article>
            ))}
          </section>
          <section className="content-grid">
            <article className="panel pipeline-panel">
              <div className="panel-heading">
                <div>
                  <h2>Deployment pipeline</h2>
                  <p>Your continuous delivery workflow</p>
                </div>
                <span className="tag">CI/CD</span>
              </div>
              <div className="pipeline-track">
                {stages.map((stage, index) => (
                  <div className="pipeline-stage" key={stage.name}>
                    <div
                      className={`stage-node ${index < 3 ? "complete" : index === 3 ? "current" : ""}`}
                    >
                      {index < 3 ? "✓" : stage.icon}
                    </div>
                    <strong>{stage.name}</strong>
                    <small>{stage.detail}</small>
                    {index < stages.length - 1 && (
                      <div
                        className={`stage-connector ${index < 2 ? "connected" : ""}`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="pipeline-footer">
                <span>
                  <i className="status-dot green" /> Last run{" "}
                  <strong>#build-1284</strong>
                </span>
                <span>Triggered 2 minutes ago</span>
                <button onClick={() => setActiveNav("Pipelines")}>
                  View pipeline ↗
                </button>
              </div>
            </article>

            <article className="panel health-panel">
              <div className="panel-heading">
                <div>
                  <h2>Infrastructure health</h2>
                  <p>Live service overview</p>
                </div>
                <span className="health-ring">98%</span>
              </div>
              {[
                ["Frontend", "Operational", 96],
                ["API Gateway", "Operational", 88],
                ["Database", "Operational", 99],
                ["Cache Layer", "Operational", 76],
              ].map(([name, status, value]) => (
                <div className="health-row" key={name}>
                  <div className="health-info">
                    <span className="service-icon">⌘</span>
                    <strong>{name}</strong>
                    <span className="service-status">
                      <i />
                      {status}
                    </span>
                  </div>
                  <div className="health-bar">
                    <span style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </article>
          </section>
          <section className="panel deployments-panel">
            <div className="panel-heading">
              <div>
                <h2>Recent deployments</h2>
                <p>Track the latest releases across your services</p>
              </div>
              <button
                className="secondary-button"
                onClick={() => setActiveNav("Deployments")}
              >
                View all deployments ↗
              </button>
            </div>
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
                  {deployments.map((deployment) => (
                    <tr key={deployment.name}>
                      <td>
                        <span className="service-symbol">▣</span>
                        <strong>{deployment.name}</strong>
                      </td>
                      <td>
                        <span className="branch-pill">
                          ⑂ {deployment.branch}
                        </span>
                      </td>
                      <td>
                        <code>{deployment.commit}</code>
                      </td>
                      <td>
                        <span
                          className={`deployment-status ${deployment.status.toLowerCase()}`}
                        >
                          <i />
                          {deployment.status}
                        </span>
                      </td>
                      <td>{deployment.time}</td>
                      <td>{deployment.duration}</td>
                      <td>
                        <button
                          className="row-menu"
                          aria-label={`More options for ${deployment.name}`}
                        >
                          ···
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-footer">
              <span>
                Showing <strong>4</strong> of <strong>1284</strong> deployments
              </span>
              <button onClick={() => setActiveNav("Deployments")}>
                Explore deployment history →
              </button>
            </div>
          </section>
          ```jsx
          <footer className="footer">
            <span>© 2026 DeployPulse · Built for reliable deployments</span>
            <span>
              <i /> All services operational
            </span>
          </footer>
        </div>

        {/* Toolchain page */}
        {activeNav === "Toolchain" && <ToolchainPage />}
      </main>
    </div>
  );
}

export default App;
