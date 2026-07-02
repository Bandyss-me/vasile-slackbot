require("dotenv").config();
const axios = require("axios");

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/vasile-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Latency: ${latency}ms` });
});

app.command("/vasile-translate", async ({command, ack, respond}) => {
    await ack();
    const input = command.text.trim();
    if (!input) {
        return respond({
            text: "Usage: /vasile-translate <text>"
        });
    }
    try {
        const response = await axios.post(
            "https://advanced-multilanguage-ai-translator-api-with-fast-responses.p.rapidapi.com/translate.php",
            {
                text: input,
                source: "en",
                target: "Romanian"
            },
            {
                headers: {
                    "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
                    "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
                    "Content-Type": "application/json"
                }
            }
        );
        const r=JSON.stringify(response.data.translation);
        r.substring(1,r.length-1);
        await respond({
            text: r
        });
    }
    catch (err) {
        console.error("FULL ERROR:", err.response?.data || err.message);
        await respond({text: "Translation failed."});
    }
});

app.command("/vasile-glaze", async ({ command, ack, respond }) => {
  await ack();
  await respond({ text: "Romania is the best country ever!!! Glory to Romania!!!"});
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();