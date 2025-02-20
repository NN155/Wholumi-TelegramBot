async function setWebhook() {
    const NGROK_URL = process.env.NGROK_URL;
    const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;
    
    const response = await fetch(`${TELEGRAM_API_URL}/setWebhook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            url: `${NGROK_URL}/webhook`
        })
    });

    const data = await response.json();
    console.log("📡 Webhook set:", data);
}

module.exports = setWebhook;