const {
    ActivityType
} = require("discord.js");

module.exports = {
    name: "clientReady",

    once: true,

    execute(client) {

        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("CREPA Ticket Bot");
        console.log(`✅ Logged in as ${client.user.tag}`);
        console.log("🚀 Bot is Online!");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

        try {

            client.user.setPresence({
                status: "idle",
                activities: [
                    {
                        name: "CREPA",
                        type: ActivityType.Watching
                    }
                ]
            });

        } catch (err) {

            console.error("Failed to set presence:", err);

        }

    }
};