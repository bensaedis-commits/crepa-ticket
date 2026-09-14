const createTicket = require("../utils/createTicket");

module.exports = {

    id: "staff",

    async execute(interaction) {

        await createTicket(interaction, {
            name: "staff",
            title: "Staff Application"
        });

    }

};
