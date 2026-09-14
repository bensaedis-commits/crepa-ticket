const fs = require("fs");
const path = require("path");

module.exports = (client) => {
    const eventsPath = path.join(__dirname, "..", "events");

    fs.readdirSync(eventsPath)
        .filter(file => file.endsWith(".js"))
        .forEach(file => {

            const event = require(path.join(eventsPath, file));

            const handler = (...args) => event.execute(...args, client);

            if (event.once) {
                client.once(event.name, handler);
            } else {
                client.on(event.name, handler);
            }

        });

    console.log("✅ Events Loaded");
};