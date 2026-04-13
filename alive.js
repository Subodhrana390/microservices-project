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
    "https://payout-service-69vc.onrender.com/health"

];

async function callApis() {
    console.log("Calling APIs at:", new Date().toLocaleTimeString());

    try {
        for (const url of apiUrls) {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed: ${url}`);
            }

            const data = await response.json();
            console.log(`Response from ${url}:`, data);
        }

    } catch (error) {
        console.error("API error:", error.message);
    }

    // Schedule next execution after 14 minutes
    setTimeout(callApis, 12 * 60 * 1000);
}

// Start recursion
callApis();