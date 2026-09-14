const { isStaffForTicket } = require("../utils/permissions");

const {
    getTicketByChannel,
    updateTicket
} = require("../utils/ticketManager");

const {
    buildTicketEmbed
} = require("../utils/ticketEmbed");

const {
    buildControls
} = require("../utils/ticketControls");

module.exports = {

    id: "reopen_ticket",

    async execute(interaction) {

        const data = getTicketByChannel(interaction.channel.id);

        if (!data) {
            return interaction.reply({
                content: "❌ Ticket data was not found.",
                ephemeral: true
            });
        }

        if (!isStaffForTicket(interaction.member, data.ticket.type)) {
            return interaction.reply({
                content: "❌ You are not allowed to reopen this ticket.",
                ephemeral: true
            });
        }

        const ticket = data.ticket;

        if (ticket.status === "open") {
            return interaction.reply({
                content: "❌ This ticket is already open.",
                ephemeral: true
            });
        }

        ticket.status = "open";
        ticket.closedBy = null;
        ticket.closedAt = null;

        updateTicket(data.userId, ticket);

        await interaction.channel.permissionOverwrites.edit(data.userId, {
            SendMessages: true
        });

        const embed = buildTicketEmbed(
            `<@${data.userId}>`,
            ticket
        );

        const controls = buildControls(ticket);

        await interaction.message.edit({
            embeds: [embed],
            components: [controls]
        });

        await interaction.reply({
            content: `Ticket reopened by ${interaction.user}.`,
            ephemeral: true
        });

    }

};
