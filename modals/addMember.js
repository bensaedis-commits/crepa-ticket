const { isStaffForTicket, parseMemberId } = require("../utils/permissions");

const {
    getTicketByChannel
} = require("../utils/ticketManager");

module.exports = {

    id: "add_member_modal",

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

        const member = await interaction.guild.members
            .fetch(id)
            .catch(() => null);

        if (!member) {
            return interaction.reply({
                content: "❌ That member was not found in this server.",
                ephemeral: true
            });
        }

        await interaction.channel.permissionOverwrites.edit(id, {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true
        });

        await interaction.reply({
            content: `✅ Added <@${id}> to the ticket.`,
            ephemeral: true
        });

    }

};
