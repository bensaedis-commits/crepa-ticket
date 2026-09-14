module.exports = {
    name: "messageCreate",

    async execute(message, client) {

        if (message.author.bot) return;

        if (!message.guild) return;

        const prefix = "+";

        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);

        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName);

        if (!command || typeof command.execute !== "function") return;

        try {

            await command.execute(message, args, client);

        } catch (err) {

            console.error("========== COMMAND ERROR ==========");
            console.error(err);
            console.error("===================================");

            message.reply({
                content: "❌ حدث خطأ أثناء تنفيذ الأمر."
            }).catch(() => {});

        }

    }
};