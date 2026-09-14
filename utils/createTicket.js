const {
    ChannelType,
    PermissionsBitField
} = require("discord.js");

const config = require("../config.json");

const {
    getNextTicketNumber,
    hasOpenTicket,
    createTicket
} = require("./ticketManager");

const { buildTicketEmbed } = require("./ticketEmbed");
const { buildControls } = require("./ticketControls");
const { getRoleForType, getCategoryForType, isValidId } = require("./permissions");

module.exports = async (interaction, options) => {

    if (hasOpenTicket(interaction.user.id)) {
        return interaction.reply({
            content: "You already have an open ticket.",
            ephemeral: true
        });
    }

    const roleId = options.role || getRoleForType(options.name);
    const categoryId = options.category || getCategoryForType(options.name);

    if (!roleId || !isValidId(roleId)) {
        console.error(`[CreateTicket] Invalid role for type ${options.name}:`, roleId);
        return interaction.reply({
            content: `Ticket setup for **${options.name}** is not configured. Please set the role in config.json`,
            ephemeral: true
        });
    }

    if (!categoryId || !isValidId(categoryId)) {
        console.error(`[CreateTicket] Invalid category for type ${options.name}:`, categoryId);
        return interaction.reply({
            content: `Ticket setup for **${options.name}** is not configured. Please set the category in config.json`,
            ephemeral: true
        });
    }

    const ticketNumber = getNextTicketNumber();

    let channel;

    try {

        channel = await interaction.guild.channels.create({

            name: `${options.name}-${ticketNumber}`,

            type: ChannelType.GuildText,

            parent: categoryId,

            topic: `Ticket ${ticketNumber} | ${options.name} | User: ${interaction.user.tag} (${interaction.user.id})`,

            permissionOverwrites: [

                {
                    id: interaction.guild.roles.everyone.id,
                    deny: [PermissionsBitField.Flags.ViewChannel]
                },

                {
                    id: interaction.user.id,
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.ReadMessageHistory
                    ]
                },

                {
                    id: roleId,
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.ManageMessages
                    ]
                }

            ]

        });

    } catch (err) {

        console.error("Failed to create ticket channel:", err);

        return interaction.reply({
            content: "Failed to create your ticket. Please check bot permissions and config IDs.",
            ephemeral: true
        });

    }

    const avatarUrl = interaction.user.displayAvatarURL({ dynamic: true, size: 512 });

    const ticket = {

        userId: interaction.user.id,
        channelId: channel.id,
        messageId: null,
        type: options.name,
        createdAt: Date.now(),
        claimedBy: null,
        claimedAt: null,
        status: "open",
        private: true,
        avatarUrl: avatarUrl

    };

    const embed = buildTicketEmbed(
        `<@${interaction.user.id}>`,
        ticket,
        avatarUrl
    );

    const controls = buildControls(ticket);

    const ticketMessage = await channel.send({

        content: `<@${interaction.user.id}> <@&${roleId}>`,

        embeds: [embed],

        components: [controls],

        files: [config.banner]

    });

    ticket.messageId = ticketMessage.id;

    createTicket(interaction.user.id, ticket);

    await interaction.reply({

        content: `Your ticket has been created: ${channel}`,

        ephemeral: true

    });

};
