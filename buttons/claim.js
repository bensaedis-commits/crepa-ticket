const { isStaffForTicket } = require("../utils/permissions");

const {
    getTicketByChannel,
    updateTicket
} = require("../utils/ticketManager");

const {
    buildTicketEmbed
} = require("../utils/ticketEmbed");

const {
    addClaim
} = require("../utils/staffStatsManager");

module.exports = {

    id: "claim_ticket",

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
                content: "❌ You are not allowed to claim this ticket. Only the role for this ticket type can claim it.",
                ephemeral: true
            });
        }

        const ticket = data.ticket;

        if (ticket.claimedBy) {

            if (ticket.claimedBy === interaction.user.id) {

                return interaction.reply({
                    content: "❌ You already claimed this ticket.",
                    ephemeral: true
                });

            }

            return interaction.reply({
                content: `❌ This ticket has already been claimed by <@${ticket.claimedBy}>.`,
                ephemeral: true
            });

        }

        ticket.claimedBy = interaction.user.id;
        ticket.claimedAt = Date.now();

        updateTicket(data.userId, ticket);

        // زيادة عدد الـ Claims للستاف
        addClaim(interaction.user.id);

        const embed = buildTicketEmbed(
            `<@${data.userId}>`,
            ticket
        );

        await interaction.message.edit({
            embeds: [embed],
            components: interaction.message.components
        });

        await interaction.reply({
            content: `✅ Ticket claimed by ${interaction.user}.`,
            ephemeral: true
        });

    }

};