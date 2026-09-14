const { EmbedBuilder } = require("discord.js");
const config = require("../config.json");

function getEmoji(type) {
    const map = {
        general: config.generalEmoji,
        angels: config.angelsEmoji,
        luna: config.angelsEmoji,
        staff: config.staffEmoji,
        report: config.reportEmoji
    };
    const id = map[type];
    if (!id || !/^\d{17,20}$/.test(id)) return "";
    const isAnimated = type === "angels" || type === "luna" || type === "staff" || type === "report";
    const prefix = isAnimated && type !== "general" ? "a" : "";
    return `<${prefix ? "a:" : ":"}e:${id}>`;
}

function getDepartment(type) {
    const names = {
        general: "General Support",
        angels: "Luna Support",
        luna: "Luna Support",
        staff: "Staff Apply",
        report: "Report"
    };
    return names[type] || "Support";
}

function buildTicketEmbed(user, ticket, avatarUrl = null) {
    const emoji = getEmoji(ticket.type);
    const dept = getDepartment(ticket.type);
    const claimed = ticket.claimedBy ? `<@${ticket.claimedBy}>` : "`Not claimed`";
    const statusMap = {
        open: "`Open`",
        closed: "`Closed`",
        deleteConfirm: "`Pending Delete`"
    };
    const status = statusMap[ticket.status] || "`Open`";
    const createdTs = Math.floor(ticket.createdAt / 1000);
    const avatar = avatarUrl || ticket.avatarUrl || null;

    const embed = new EmbedBuilder()
        .setColor("#FF0000")
        .setTitle(`${emoji} ${dept} • Ticket`)
        .setDescription(
`Hello ${user} — thanks for reaching out to **${config.serverName}**.

Our team will assist you shortly. Please describe your issue clearly while you wait.

━━━━━━━━━━━━━━━━━━
**Client:** ${user}
**Department:** ${emoji} ${dept}
**Opened:** <t:${createdTs}:F> (<t:${createdTs}:R>)
**Staff:** ${claimed}
**Status:** ${status}
━━━━━━━━━━━━━━━━━━`
        )
        .setFooter({ text: `${config.serverName} • Algeria Community` })
        .setTimestamp(ticket.createdAt)
        .setImage("attachment://banner.gif");

    if (avatar) embed.setThumbnail(avatar);

    return embed;
}

module.exports = {
    buildTicketEmbed
};
