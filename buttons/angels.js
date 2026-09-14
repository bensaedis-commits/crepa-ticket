const createTicket = require("../utils/createTicket");

module.exports = {

    id: "angels",

    async execute(interaction) {

        await createTicket(interaction, {
            name: "angels",
            title: "Angels Support"
        });

    }

};
