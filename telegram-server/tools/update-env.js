const fs = require("fs");
const { exec } = require("child_process");
const path = require('path');
// Run the NGROK command to get the current URL
exec("curl -s http://localhost:4040/api/tunnels", (error, stdout) => {
    if (error) {
        console.error("Error getting NGROK URL:", error);
        return;
    }

    try {
        // Parse the JSON response
        const data = JSON.parse(stdout);
        const tunnel = data.tunnels.find(t => t.proto === "https");

        if (!tunnel) {
            console.error("HTTPS tunnel not found!");
            return;
        }

        const ngrokUrl = tunnel.public_url;
        console.log(`NGROK URL: ${ngrokUrl}`);

        // Read the current `.env` file at the path ../.env
        const envPath = path.join(__dirname, '../.env');

        let env = fs.readFileSync(envPath, "utf8");
        console.log()
        // Update or add the NGROK_URL variable
        if (env.includes("NGROK_URL=")) {
            env = env.replace(/NGROK_URL=.*/g, `NGROK_URL=${ngrokUrl}`);
        } else {
            env += `\nNGROK_URL=${ngrokUrl}`;
        }

        // Write to the `.env` file
        fs.writeFileSync(envPath, env.trim() + "\n");
        console.log(".env file updated!");
    } catch (err) {
        console.error("Error parsing NGROK response:", err);
    }
});