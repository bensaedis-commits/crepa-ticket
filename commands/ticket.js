const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const config = require("../config.json");

function isValidId(id) {
    return typeof id === "string" && /^\d{17,20}$/.test(id);
}

function e(id, animated = false) {
    if (!isValidId(id)) return "";
    return `<${animated ? "a:" : ":"}e:${id}>`;
}

module.exports = {
    name: "ticket",

    async execute(message) {

        const owners = config.ownerIDs || (config.ownerID ? [config.ownerID] : []);
        if (!owners.includes(message.author.id)) {
            return;
        }

        const generalE = e(config.generalEmoji, false);
        const lunaE = e(config.angelsEmoji, true);
        const staffE = e(config.staffEmoji, true);
        const reportE = e(config.reportEmoji, true);

        const guildIcon = message.guild.iconURL({ dynamic: true, size: 512 });

        const embed = new EmbedBuilder()
            .setColor("#FF0000")
            .setAuthor({ name: `${config.serverName} • Support Center`, iconURL: guildIcon || undefined })
            .setTitle(`${config.serverName} — Support Center`)
            .setDescription(
`**Welcome to ${config.serverName}** — Algeria Community

Need help? Choose the department that fits your request. A private ticket will be created instantly.

${generalE} **General Support**
> General questions & assistance

${lunaE} **Luna Support**
> Private & dedicated support

${staffE} **Staff Apply**
> Apply to join our staff team

${reportE} **Report**
> Report a member or an issue

*Your ticket is private — only you and the staff for that department can see it.*`
            )
            .setFooter({ text: `${config.serverName} • Algeria Community` })
            .setTimestamp()
            .setImage("attachment://banner.gif");

        if (guildIcon) embed.setThumbnail(guildIcon);

        const generalBtn = new ButtonBuilder()
            .setCustomId("general")
            .setLabel("General Support")
            .setStyle(ButtonStyle.Primary);

        const lunaBtn = new ButtonBuilder()
            .setCustomId("angels")
            .setLabel("Luna Support")
            .setStyle(ButtonStyle.Primary);

        const staffBtn = new ButtonBuilder()
            .setCustomId("staff")
            .setLabel("Staff Apply")
            .setStyle(ButtonStyle.Secondary);

        const reportBtn = new ButtonBuilder()
            .setCustomId("report")
            .setLabel("Report")
            .setStyle(ButtonStyle.Danger);

        if (isValidId(config.generalEmoji)) generalBtn.setEmoji({ id: config.generalEmoji });
        if (isValidId(config.angelsEmoji)) lunaBtn.setEmoji({ id: config.angelsEmoji });
        if (isValidId(config.staffEmoji)) staffBtn.setEmoji({ id: config.staffEmoji });
        if (isValidId(config.reportEmoji)) reportBtn.setEmoji({ id: config.reportEmoji });

        const row = new ActionRowBuilder().addComponents(generalBtn, lunaBtn, staffBtn, reportBtn);

        await message.channel.send({
            embeds: [embed],
            components: [row],
            files: [config.banner]
        });

        await message.delete().catch(() => {});

    }
};
