const { removeTicket } = require("./ticketManager");

const {
    addClosed,
    addResponseTime,
    addCloseTime
} = require("./staffStatsManager");

async function closeTicket(interaction, data) {

    const ticket = data.ticket;

    if (ticket.claimedBy) {

        addClosed(ticket.claimedBy);

        if (ticket.claimedAt) {

            addResponseTime(
                ticket.claimedBy,
                ticket.claimedAt - ticket.createdAt
            );

        }

        addCloseTime(
            ticket.claimedBy,
            Date.now() - ticket.createdAt
        );

    }

    setTimeout(async () => {

        try {

            await interaction.channel.delete();

            removeTicket(data.userId);

        } catch (err) {

            console.error("[TicketClose] Failed to delete channel:", err.message);

            removeTicket(data.userId);

        }

    }, 1500);

}

module.exports = {
    closeTicket
};
