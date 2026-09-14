const { isStaffForTicket } = require("../utils/permissions");

const {
    getTicketByChannel
} = require("../utils/ticketManager");

const { closeTicket } = require("../utils/ticketClose");

module.exports = {

    id: "confirm_delete",

    async execute(interaction) {

        const data = getTicketByChannel(interaction.channel.id);

        if (!data) {
            return interaction.reply({
                content: "❌ Ticket not found.",
                ephemeral: true
            });
        }

        if (!isStaffForTicket(interaction.member, data.ticket.type)) {
            return interaction.reply({
                content: "❌ You are not allowed to do this.",
                ephemeral: true
            });
        }

        if (data.ticket.status !== "deleteConfirm") {
            return interaction.reply({
                content: "❌ Ticket is not pending deletion.",
                ephemeral: true
            });
        }

        await interaction.reply({
            content: "Ticket will be deleted shortly...",
            ephemeral: true
        });

        await closeTicket(interaction, data);

    }

};
