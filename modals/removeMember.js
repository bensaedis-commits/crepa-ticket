const { isStaffForTicket, parseMemberId } = require("../utils/permissions");

const {
    getTicketByChannel
} = require("../utils/ticketManager");

module.exports = {

    id: "remove_member_modal",

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
                content: "❌ You are not allowed to do this.",
                ephemeral: true
            });
        }

        const id = parseMemberId(
            interaction.fields.getTextInputValue("member_id")
        );

        if (!id) {
            return interaction.reply({
                content: "❌ Invalid user ID or mention.",
                ephemeral: true
            });
        }

        if (id === data.userId) {
            return interaction.reply({
                content: "❌ You cannot remove the ticket owner.",
                ephemeral: true
            });
        }

        await interaction.channel.permissionOverwrites
            .delete(id)
            .catch(() => {});

        await interaction.reply({
            content: `✅ Removed <@${id}> from the ticket.`,
            ephemeral: true
        });

    }

};
