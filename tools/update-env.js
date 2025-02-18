const fs = require("fs");
const { exec } = require("child_process");

// Запускаємо команду NGROK для отримання поточного URL
exec("curl -s http://localhost:4040/api/tunnels", (error, stdout) => {
    if (error) {
        console.error("Помилка отримання NGROK URL:", error);
        return;
    }

    try {
        // Парсимо JSON-відповідь
        const data = JSON.parse(stdout);
        const tunnel = data.tunnels.find(t => t.proto === "https");

        if (!tunnel) {
            console.error("HTTPS-тунель не знайдено!");
            return;
        }

        const ngrokUrl = tunnel.public_url;
        console.log(`NGROK URL: ${ngrokUrl}`);

        // Читаємо поточний `.env` за шляхом ../.env
        const envPath = "../.env";
        let env = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";

        // Оновлюємо або додаємо змінну NGROK_URL
        if (env.includes("NGROK_URL=")) {
            env = env.replace(/NGROK_URL=.*/g, `NGROK_URL=${ngrokUrl}`);
        } else {
            env += `\nNGROK_URL=${ngrokUrl}`;
        }

        // Записуємо у файл `.env`
        fs.writeFileSync(envPath, env.trim() + "\n");
        console.log("Файл .env оновлено!");
    } catch (err) {
        console.error("Помилка парсингу NGROK відповіді:", err);
    }
});
