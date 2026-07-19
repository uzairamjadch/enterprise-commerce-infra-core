const express = require('express');
const app = express();
const PORT = 5000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/api/v1/analytics/overview', (req, res) => {
  const computedThroughput = Math.floor(1300 + Math.random() * 300);
  const computedLatency = (3.5 + Math.random() * 2).toFixed(2);

  res.status(200).json({
    status: "success",
    timestamp: new Date().toISOString(),
    data: {
      systemThroughput: `${computedThroughput} req/s`,
      activeTenants: "32 Active",
      avgLatency: `${computedLatency} ms`,
      logs: [
        { tenant: "tenant-049", route: "GET /v1/analytics/orders", detail: "200 OK — Cache Hit", status: "Healthy" },
        { tenant: "tenant-112", route: "POST /v1/checkout/session", detail: "201 Created — Write Op", status: "Healthy" },
        { tenant: "tenant-184", route: "GET /v1/auth/session-validate", detail: "200 OK — Auth Match", status: "Healthy" }
      ]
    }
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint route context not discovered" });
});

app.listen(PORT, () => {
  console.log(`Telemetry Core Engine listening cleanly on port: ${PORT}`);
});