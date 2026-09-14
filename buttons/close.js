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

    id: "close_ticket",

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
                content: "❌ You are not allowed to close this ticket. Only the role for this ticket type can close it.",
                ephemeral: true
            });
        }

        const ticket = data.ticket;

        if (ticket.status === "closed") {
            return interaction.reply({
                content: "❌ This ticket is already closed.",
                ephemeral: true
            });
        }

        ticket.status = "closed";
        ticket.closedBy = interaction.user.id;
        ticket.closedAt = Date.now();

        updateTicket(data.userId, ticket);

        await interaction.channel.permissionOverwrites.edit(data.userId, {
            SendMessages: false
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
            content: `Ticket closed by ${interaction.user}.`,
            ephemeral: true
        });

    }

};
