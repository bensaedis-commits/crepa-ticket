const fs = require("fs");
const path = require("path");

module.exports = (client) => {

    const modals = [];

    const modalsPath = path.join(__dirname, "..", "modals");

    fs.readdirSync(modalsPath)
        .filter(file => file.endsWith(".js"))
        .forEach(file => {

            const modal = require(path.join(modalsPath, file));

            if (!modal.id) return;

            modals.push(modal);

        });

    client.on("interactionCreate", async (interaction) => {

        if (!interaction.isModalSubmit()) return;

        const modal = modals.find(m => m.id === interaction.customId);

        if (!modal) return;

        try {

            await modal.execute(interaction);

        } catch (err) {

            console.error("========== MODAL ERROR ==========");
            console.error(err);
            console.error("=================================");

            if (!interaction.replied && !interaction.deferred) {

                await interaction.reply({
                    content: "❌ حدث خطأ أثناء تنفيذ النموذج.",
                    ephemeral: true
                }).catch(() => {});

            }

        }

    });

    console.log("☑ Modals Loaded");

};