const fs = require("fs");
const path = require("path");

const dataDir = process.env.DATA_DIR || path.join(__dirname, "..");

const ticketsPath = path.join(dataDir, "tickets.json");

let cache = null;

function loadTickets() {

    if (cache) return cache;

    if (!fs.existsSync(ticketsPath)) {

        cache = {
            lastTicket: 0,
            tickets: {}
        };

        saveTickets(cache);

        return cache;

    }

    cache = JSON.parse(
        fs.readFileSync(ticketsPath, "utf8")
    );

    if (!cache.lastTicket) cache.lastTicket = 0;
    if (!cache.tickets) cache.tickets = {};

    return cache;

}

function saveTickets(data) {

    fs.writeFileSync(
        ticketsPath,
        JSON.stringify(data, null, 4)
    );

}

function getNextTicketNumber() {

    const data = loadTickets();

    data.lastTicket++;

    saveTickets(data);

    return data.lastTicket.toString().padStart(4, "0");

}

function hasOpenTicket(userId) {

    const data = loadTickets();

    return Boolean(data.tickets[userId]);

}

function createTicket(userId, ticketData) {

    const data = loadTickets();

    data.tickets[userId] = {
        userId: userId,
        channelId: ticketData.channelId,
        messageId: ticketData.messageId,
        type: ticketData.type,
        createdAt: ticketData.createdAt,
        claimedBy: ticketData.claimedBy || null,
        claimedAt: ticketData.claimedAt || null,
        status: ticketData.status || "open",
        private: Boolean(ticketData.private),
        avatarUrl: ticketData.avatarUrl || null
    };

    saveTickets(data);

}

function getTicket(userId) {

    const data = loadTickets();

    return data.tickets[userId] || null;

}

function getTicketByChannel(channelId) {

    const data = loadTickets();

    for (const userId in data.tickets) {

        if (data.tickets[userId].channelId === channelId) {

            return {
                userId,
                ticket: data.tickets[userId]
            };

        }

    }

    return null;

}

function updateTicket(userId, ticket) {

    const data = loadTickets();

    data.tickets[userId] = ticket;

    saveTickets(data);

}

function claimTicket(userId, staffId) {

    const data = loadTickets();

    if (!data.tickets[userId]) return false;

    data.tickets[userId].claimedBy = staffId;
    data.tickets[userId].claimedAt = Date.now();

    saveTickets(data);

    return true;

}

function removeTicket(userId) {

    const data = loadTickets();

    delete data.tickets[userId];

    saveTickets(data);

}

module.exports = {
    getNextTicketNumber,
    hasOpenTicket,
    createTicket,
    getTicket,
    getTicketByChannel,
    updateTicket,
    claimTicket,
    removeTicket
};