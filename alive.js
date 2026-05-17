const http = require("http");

const apiUrls = [
    "https://yourchemist-backend-deployment.onrender.com/health",
    "https://yourchemist-backend-deployment-s9tm.onrender.com/health",
    "https://yourchemist-backend-deployment-2n1z.onrender.com/health",
    "https://product-service-axdc.onrender.com/health",
    "https://inventory-service-1vff.onrender.com/health",
    "https://yourchemist-backend-deployment-we75.onrender.com/health",
    "https://yourchemist-backend-deployment-7tur.onrender.com/health",
    "https://yourchemist-backend-deployment-zycv.onrender.com/health",
    "https://payment-service-to80.onrender.com/health",
    "https://notification-service-2v8u.onrender.com/health",
    "https://delivery-service-sjx4.onrender.com/health",
    "https://payout-service-69vc.onrender.com/health"
];
// Dynamically add its own URL if deployed on Render
const selfUrl = process.env.RENDER_EXTERNAL_URL || process.env.SELF_URL;
if (selfUrl) {
    const formattedSelfUrl = selfUrl.endsWith("/") ? `${selfUrl}health` : `${selfUrl}/health`;
    if (!apiUrls.includes(formattedSelfUrl) && !apiUrls.includes(selfUrl)) {
        apiUrls.push(formattedSelfUrl);
        console.log(`Self URL detected and added to ping list: ${formattedSelfUrl}`);
    }
}

async function callApis() {
    console.log("\n--- Starting Ping Cycle at:", new Date().toLocaleString() + " ---");

    for (const url of apiUrls) {
        try {
            console.log(`Pinging: ${url}`);
            const response = await fetch(url);

            if (!response.ok) {
                console.error(`[FAIL] ${url} returned status: ${response.status}`);
                continue;
            }

            const data = await response.json().catch(() => ({ status: "ok" }));
            console.log(`[SUCCESS] Response from ${url}:`, data);
        } catch (error) {
            console.error(`[ERROR] Failed to ping ${url}:`, error.message);
        }
    }

    console.log("--- Ping Cycle Completed ---\n");

    // Schedule next execution after 12 minutes
    setTimeout(callApis, 8 * 60 * 1000);
}

// Start simple HTTP Server to bind to Render's required port if in Web Service mode
const PORT = process.env.PORT || 10000;
http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
        status: "alive",
        timestamp: new Date().toISOString(),
        monitoredApisCount: apiUrls.length
    }));
}).listen(PORT, () => {
    console.log(`Keep-alive status server listening on port ${PORT}`);
});

// Start recursion
callApis();