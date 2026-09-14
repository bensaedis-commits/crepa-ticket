require("dotenv").config();

const {
    Client,
    GatewayIntentBits,
    Collection
} = require("discord.js");

const fs = require("fs");
const path = require("path");
const { startMemoryMonitor } = require("./utils/memoryMonitor");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();
client.buttons = new Collection();

const handlersPath = path.join(__dirname, "handlers");

fs.readdirSync(handlersPath).forEach(file => {
    require(path.join(handlersPath, file))(client);
});

process.on("unhandledRejection", (reason) => {
    console.error("========== UNHANDLED REJECTION ==========");
    console.error(reason);
    console.error("=========================================");
});

process.on("uncaughtException", (err) => {
    console.error("========== UNCAUGHT EXCEPTION ==========");
    console.error(err);
    console.error("========================================");
});

for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, async () => {
        console.log(`\n🛑 Received ${signal}, shutting down gracefully...`);
        try {
            await client.destroy();
        } catch {}
        process.exit(0);
    });
}

client.login(process.env.TOKEN).then(() => {
    startMemoryMonitor();
}).catch(err => {
    console.error("Failed to login:", err);
    process.exit(1);
});