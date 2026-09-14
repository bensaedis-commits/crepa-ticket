const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

function buildControls(ticket) {

    const row = new ActionRowBuilder();

    if (ticket.status === "deleteConfirm") {

        row.addComponents(

            new ButtonBuilder()
                .setCustomId("confirm_delete")
                .setLabel("Confirm Delete")
                .setStyle(ButtonStyle.Danger),

            new ButtonBuilder()
                .setCustomId("cancel_delete")
                .setLabel("Cancel")
                .setStyle(ButtonStyle.Secondary)

        );

    }

    else if (ticket.status === "closed") {

        row.addComponents(

            new ButtonBuilder()
                .setCustomId("reopen_ticket")
                .setLabel("Reopen")
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId("delete_ticket")
                .setLabel("Delete")
                .setStyle(ButtonStyle.Danger)

        );

    }

    else {

        row.addComponents(

            new ButtonBuilder()
                .setCustomId("close_ticket")
                .setLabel("Close")
                .setStyle(ButtonStyle.Danger),

            new ButtonBuilder()
                .setCustomId("claim_ticket")
                .setLabel("Claim")
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId("add_member")
                .setLabel("Add")
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId("remove_member")
                .setLabel("Remove")
                .setStyle(ButtonStyle.Secondary)

        );

    }

    return row;

}

module.exports = {
    buildControls
};
