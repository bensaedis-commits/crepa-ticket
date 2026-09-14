const { isStaffForTicket } = require("../utils/permissions");

const {
    getTicketByChannel,
    updateTicket
} = require("../utils/ticketManager");

const {
    buildControls
} = require("../utils/ticketControls");

module.exports = {

    id: "cancel_delete",

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

        const ticket = data.ticket;

        ticket.status = "closed";

        updateTicket(data.userId, ticket);

        await interaction.update({
            components: [
                buildControls(ticket)
            ]
        });

    }

};
