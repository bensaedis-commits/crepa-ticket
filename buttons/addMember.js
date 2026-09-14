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

function buildAddMemberModal() {

    return new ModalBuilder()
        .setCustomId("add_member_modal")
        .setTitle("Add Member to Ticket")
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

    id: "add_member",

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
                content: "❌ You are not allowed to add members to this ticket.",
                ephemeral: true
            });
        }

        if (data.ticket.status === "closed" || data.ticket.status === "deleteConfirm") {
            return interaction.reply({
                content: "❌ You cannot modify a closed ticket.",
                ephemeral: true
            });
        }

        await interaction.showModal(buildAddMemberModal());

    }

};
