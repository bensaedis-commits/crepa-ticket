const { isStaffForTicket } = require("../utils/permissions");

const {
    getTicketByChannel,
    updateTicket
} = require("../utils/ticketManager");

const {
    buildControls
} = require("../utils/ticketControls");

module.exports = {

    id: "delete_ticket",

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
                content: "❌ You are not allowed to delete this ticket.",
                ephemeral: true
            });
        }

        const ticket = data.ticket;

        ticket.status = "deleteConfirm";

        updateTicket(data.userId, ticket);

        await interaction.update({

            components: [
                buildControls(ticket)
            ]

        });

    }

};
