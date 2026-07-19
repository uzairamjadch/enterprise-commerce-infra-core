<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Enterprise Core - Analytical Dashboard</title>
  <style>
    /* Reset & Base Setup */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    body {
      min-height: 100vh;
      background: linear-gradient(135deg, #020617 0%, #0b0f19 50%, #020617 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      overflow-x: hidden;
      padding: 20px;
    }

    /* Ambient Glow Blobs */
    .glow-blob {
      position: absolute;
      width: 450px;
      height: 450px;
      border-radius: 50%;
      filter: blur(130px);
      z-index: 0;
      opacity: 0.2;
      pointer-events: none;
    }
    .blob-1 { top: 5%; left: 10%; background: #3b82f6; }
    .blob-2 { bottom: 5%; right: 10%; background: #a855f7; }

    /* Core Glass Container */
    .dashboard-container {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 1100px;
      background: rgba(255, 255, 255, 0.02);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 24px;
      padding: 40px;
      box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.6);
      color: #f8fafc;
      animation: viewportEntrance 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    /* Dashboard Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding-bottom: 20px;
    }

    .brand h1 {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.5px;
      background: linear-gradient(to right, #3b82f6, #a855f7);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .brand p {
      font-size: 13px;
      color: #94a3b8;
      margin-top: 4px;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .back-btn {
      color: #94a3b8;
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      border: 1px solid rgba(255, 255, 255, 0.06);
      padding: 8px 16px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.01);
      transition: all 0.2s ease;
    }
    .back-btn:hover {
      color: #f8fafc;
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.15);
    }

    .status-badge {
      background: rgba(244, 63, 94, 0.08);
      border: 1px solid rgba(244, 63, 94, 0.2);
      color: #fb7185;
      padding: 8px 16px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
    }

    .status-badge.connected {
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.2);
      color: #34d399;
    }

    .status-dot {
      width: 6px;
      height: 6px;
      background-color: #f43f5e;
      border-radius: 50%;
      transition: background-color 0.3s;
    }
    .status-badge.connected .status-dot {
      background-color: #10b981;
      animation: pulse 2s infinite;
    }

    /* Metrics Grid */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .card {
      background: rgba(255, 255, 255, 0.01);
      border: 1px solid rgba(255, 255, 255, 0.04);
      border-radius: 16px;
      padding: 24px;
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease;
    }

    .card:hover {
      transform: translateY(-4px);
      border-color: rgba(255, 255, 255, 0.12);
      background: rgba(255, 255, 255, 0.03);
    }

    .card-label {
      font-size: 13px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }

    .card-value {
      font-size: 32px;
      font-weight: 700;
      margin: 12px 0 6px 0;
      color: #f1f5f9;
      transition: color 0.2s ease;
    }

    .card-trend {
      font-size: 12px;
      font-weight: 500;
      color: #94a3b8;
    }

    /* Table Details Area */
    .details-section {
      background: rgba(255, 255, 255, 0.005);
      border: 1px solid rgba(255, 255, 255, 0.03);
      border-radius: 16px;
      padding: 28px;
    }

    .section-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 20px;
      color: #e2e8f0;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .data-table th {
      font-size: 12px;
      color: #475569;
      text-transform: uppercase;
      padding: 14px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      font-weight: 700;
    }

    .data-table td {
      padding: 16px;
      font-size: 14px;
      color: #cbd5e1;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    }

    .tenant-id {
      font-family: monospace;
      background: rgba(255, 255, 255, 0.06);
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 12px;
      color: #e2e8f0;
    }

    .status-indicator {
      font-weight: 600;
      color: #34d399;
    }

    /* System Keyframe Animations */
    @keyframes pulse {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }

    @keyframes viewportEntrance {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body>

  <div class="glow-blob blob-1"></div>
  <div class="glow-blob blob-2"></div>

  <main class="dashboard-container">
    
    <header class="header">
      <div class="brand">
        <h1>Enterprise Core Engine</h1>
        <p>Live Multi-Tenant Telemetry Stream Client</p>
      </div>
      <div class="header-actions">
        <a href="../index.html" class="back-btn">← Portal Gateway</a>
        <div id="connection-badge" class="status-badge">
          <span class="status-dot"></span>
          <span id="connection-text">Connecting to Node Cluster...</span>
        </div>
      </div>
    </header>

    <section class="metrics-grid">
      <div class="card">
        <div class="card-label">System Throughput</div>
        <div id="throughput-val" class="card-value">-- req/s</div>
        <div class="card-trend">▲ Real-time node throughput</div>
      </div>
      
      <div class="card">
        <div class="card-label">Isolated Tenancy Scopes</div>
        <div id="tenants-val" class="card-value">-- Active</div>
        <div class="card-trend">▲ Workspace allocation boundaries</div>
      </div>

      <div class="card">
        <div class="card-label">Avg Transaction Latency</div>
        <div id="latency-val" class="card-value">-- ms</div>
        <div class="card-trend">▼ Dynamic hardware calculation overhead</div>
      </div>
    </section>

    <section class="details-section">
      <h2 class="section-title">Live Isolated Workspace Cluster Logs</h2>
      <table class="data-table">
        <thead>
          <tr>
            <th>Tenant Context</th>
            <th>Operation Target</th>
            <th>Metrics Context Context</th>
            <th>Status Indicator</th>
          </tr>
        </thead>
        <tbody id="logs-tbody">
          <tr>
            <td colspan="4" style="text-align: center; color: #64748b; padding: 30px;">
              Awaiting payload confirmation from running background cluster stream...
            </td>
          </tr>
        </tbody>
      </table>
    </section>

  </main>

  <script>
    const API_URL = 'http://localhost:5000/api/v1/analytics/overview';
    
    async function fetchClusterMetrics() {
      const badge = document.getElementById('connection-badge');
      const text = document.getElementById('connection-text');
      
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Cluster rejected stream parsing parameters');
        
        const payload = await response.json();
        const telemetry = payload.data;
        
        // Mark Connection status UI badge as valid
        badge.classList.add('connected');
        text.innerText = "API Cluster Connected";
        
        // Inject Dynamic Live Metrics Values
        document.getElementById('throughput-val').innerText = telemetry.systemThroughput;
        document.getElementById('tenants-val').innerText = telemetry.activeTenants;
        document.getElementById('latency-val').innerText = telemetry.avgLatency;
        
        // Build Logs Table Dynamic Row Output
        const tbody = document.getElementById('logs-tbody');
        tbody.innerHTML = ''; // Clear prior entry stack
        
        telemetry.logs.forEach(log => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td><span class="tenant-id">${log.tenant}</span></td>
            <td style="font-family: monospace; color: #a855f7;">${log.route}</td>
            <td>${log.detail}</td>
            <td><span class="status-indicator">${log.status}</span></td>
          `;
          tbody.appendChild(row);
        });
        
      } catch (error) {
        // Handle Disconnected states cleanly
        badge.classList.remove('connected');
        text.innerText = "API offline — Run 'npm start'";
        
        document.getElementById('throughput-val').innerText = "-- req/s";
        document.getElementById('tenants-val').innerText = "-- Active";
        document.getElementById('latency-val').innerText = "-- ms";
      }
    }

    // Initialize tracking poll engine cycle loop immediately (every 2.5 seconds)
    fetchClusterMetrics();
    setInterval(fetchClusterMetrics, 2500);
  </script>
</body>
</html>