const fs = require("fs");
const path = require("path");

module.exports = (client) => {
    const commandsPath = path.join(__dirname, "..", "commands");

    fs.readdirSync(commandsPath)
        .filter(file => file.endsWith(".js"))
        .forEach(file => {

            const command = require(path.join(commandsPath, file));

            client.commands.set(command.name, command);

        });

    console.log("✅ Commands Loaded");
};