const createTicket = require("../utils/createTicket");

module.exports = {

    id: "general",

    async execute(interaction) {

        await createTicket(interaction, {
            name: "general",
            title: "General Support"
        });

    }

};
