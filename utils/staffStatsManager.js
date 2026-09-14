const fs = require("fs");
const path = require("path");

const dataDir = process.env.DATA_DIR || path.join(__dirname, "..");

const statsPath = path.join(dataDir, "staffStats.json");

let cache = null;

function loadStats() {

    if (cache) return cache;

    if (!fs.existsSync(statsPath)) {

        cache = {
            staff: {}
        };

        saveStats(cache);

        return cache;

    }

    cache = JSON.parse(
        fs.readFileSync(statsPath, "utf8")
    );

    if (!cache.staff)
        cache.staff = {};

    return cache;

}

function saveStats(data) {

    fs.writeFileSync(
        statsPath,
        JSON.stringify(data, null, 4)
    );

}

function ensureStaff(staffId) {

    const data = loadStats();

    if (!data.staff[staffId]) {

        data.staff[staffId] = {

            claimed: 0,
            closed: 0,

            totalResponseTime: 0,
            totalCloseTime: 0,

            reviews: 0,
            rating: 0

        };

        saveStats(data);

    }

    return data;

}

function addClaim(staffId) {

    const data = ensureStaff(staffId);

    data.staff[staffId].claimed++;

    saveStats(data);

}

function addClosed(staffId) {

    const data = ensureStaff(staffId);

    data.staff[staffId].closed++;

    saveStats(data);

}

function addResponseTime(staffId, milliseconds) {

    const data = ensureStaff(staffId);

    data.staff[staffId].totalResponseTime += milliseconds;

    saveStats(data);

}

function addCloseTime(staffId, milliseconds) {

    const data = ensureStaff(staffId);

    data.staff[staffId].totalCloseTime += milliseconds;

    saveStats(data);

}

function addReview(staffId, stars) {

    const data = ensureStaff(staffId);

    data.staff[staffId].reviews++;

    data.staff[staffId].rating += stars;

    saveStats(data);

}

function getStats(staffId) {

    const data = ensureStaff(staffId);

    return data.staff[staffId];

}

function getAllStats() {

    const data = loadStats();

    return data.staff;

}

module.exports = {

    addClaim,
    addClosed,

    addResponseTime,
    addCloseTime,

    addReview,

    getStats,
    getAllStats

};