const {
    Collection
} = require("discord.js");

const fs = require("fs");
const path = require("path");

module.exports = (client) => {

    client.buttons = new Collection();

    const buttonsPath = path.join(__dirname, "..", "buttons");

    const files = fs.readdirSync(buttonsPath)
        .filter(file => file.endsWith(".js"));

    for (const file of files) {

        const button = require(path.join(buttonsPath, file));

        if (!button.id) continue;

        client.buttons.set(button.id.toString(), button);

    }

    client.on("interactionCreate", async (interaction) => {

        if (!interaction.isButton()) return;

        let button = client.buttons.find(btn => {

            if (typeof btn.id === "string")
                return btn.id === interaction.customId;

            if (btn.id instanceof RegExp)
                return btn.id.test(interaction.customId);

            return false;

        });

        if (!button) return;

        try {

            await button.execute(interaction);

        } catch (err) {

            console.error("========== BUTTON ERROR ==========");
            console.error(err);
            console.error("==================================");

            if (!interaction.replied && !interaction.deferred) {

                await interaction.reply({

                    content: "❌ حدث خطأ أثناء تنفيذ الزر.",

                    ephemeral: true

                }).catch(() => {});

            }

        }

    });

    console.log("☑ Buttons Loaded");

};