const createTicket = require("../utils/createTicket");

module.exports = {

    id: "report",

    async execute(interaction) {

        await createTicket(interaction, {
            name: "report",
            title: "Player Report"
        });

    }

};
