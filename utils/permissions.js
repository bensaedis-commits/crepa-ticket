const {
    PermissionFlagsBits
} = require("discord.js");

const config = require("../config.json");

function getRoleForType(type) {
    const map = {
        general: config.supportRole,
        angels: config.angelsRole,
        staff: config.staffRole,
        report: config.reportRole
    };
    return map[type] || null;
}

function getCategoryForType(type) {
    const map = {
        general: config.generalCategory,
        angels: config.angelsCategory,
        staff: config.staffCategory,
        report: config.reportCategory
    };
    return map[type] || null;
}

function isValidId(id) {
    return typeof id === "string" && /^\d{17,20}$/.test(id);
}

function isStaff(member) {

    if (!member) return false;

    const allowedRoles = [
        config.supportRole,
        config.angelsRole,
        config.staffRole,
        config.reportRole
    ];

    return (
        member.permissions?.has(PermissionFlagsBits.Administrator) ||
        allowedRoles.some(role => member.roles.cache.has(role))
    );

}

function isStaffForTicket(member, ticketType) {
    if (!member) return false;
    if (member.permissions?.has(PermissionFlagsBits.Administrator)) return true;

    const role = getRoleForType(ticketType);
    if (!role || !isValidId(role)) return false;

    return member.roles.cache.has(role);
}

function parseMemberId(input) {

    if (!input) return null;

    const trimmed = input.trim();

    const mentionMatch = trimmed.match(/<@!?(\d{17,20})>/);
    const rawMatch = trimmed.match(/^(\d{17,20})$/);

    const id = mentionMatch ? mentionMatch[1] : (rawMatch ? rawMatch[1] : null);

    return id;

}

module.exports = {
    isStaff,
    isStaffForTicket,
    getRoleForType,
    getCategoryForType,
    isValidId,
    parseMemberId
};
