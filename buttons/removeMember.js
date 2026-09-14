const {
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle
} = require("discord.js");

const { isStaffForTicket } = require("../utils/permissions");

const {
    getTicketByChannel
} = require("../utils/ticketManager");

function buildRemoveMemberModal() {

    return new ModalBuilder()
        .setCustomId("remove_member_modal")
        .setTitle("Remove Member from Ticket")
        .addComponents(
            new ActionRowBuilder()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId("member_id")
                        .setLabel("User ID or mention")
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder("e.g. 123456789012345678 or @user")
                        .setRequired(true)
                )
        );

}

module.exports = {

    id: "remove_member",

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
                content: "❌ You are not allowed to remove members from this ticket.",
                ephemeral: true
            });
        }

        if (data.ticket.status === "closed" || data.ticket.status === "deleteConfirm") {
            return interaction.reply({
                content: "❌ You cannot modify a closed ticket.",
                ephemeral: true
            });
        }

        await interaction.showModal(buildRemoveMemberModal());

    }

};
