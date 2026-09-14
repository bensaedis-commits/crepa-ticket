const { test } = require("node:test");
const assert = require("node:assert/strict");

const {
    formatTime,
    getRank,
    getProgressBar,
    getAverageRating,
    getAverageResponse,
    getStars
} = require("../utils/statsFormat");

test("formatTime handles zero and negatives", () => {
    assert.equal(formatTime(0), "0s");
    assert.equal(formatTime(-5), "0s");
    assert.equal(formatTime(null), "0s");
});

test("formatTime converts ms to readable units", () => {
    assert.equal(formatTime(1000), "1s");
    assert.equal(formatTime(61000), "1m 1s");
    assert.equal(formatTime(3600000), "1h");
    assert.equal(formatTime(86400000), "1d");
});

test("getRank thresholds", () => {
    assert.equal(getRank(0), "🔰 Rookie");
    assert.equal(getRank(10), "🟢 Helper");
    assert.equal(getRank(30), "⭐ Support");
    assert.equal(getRank(70), "🛡 Senior");
    assert.equal(getRank(150), "💎 Expert");
    assert.equal(getRank(300), "👑 Elite");
});

test("getProgressBar", () => {
    assert.equal(getProgressBar(50), "█████░░░░░");
    assert.equal(getProgressBar(0), "░░░░░░░░░░");
    assert.equal(getProgressBar(100), "██████████");
});

test("getAverageRating", () => {
    assert.equal(getAverageRating({ reviews: 0, rating: 0 }), 0);
    assert.equal(getAverageRating({ reviews: 2, rating: 8 }), 4);
});

test("getAverageResponse uses MAX_SAFE_INTEGER when no claims", () => {
    assert.equal(
        getAverageResponse({ claimed: 0 }),
        Number.MAX_SAFE_INTEGER
    );

    assert.equal(
        getAverageResponse({ claimed: 2, totalResponseTime: 10000 }),
        5000
    );
});

test("getStars", () => {
    assert.equal(getStars(0), "☆☆☆☆☆");
    assert.equal(getStars(4), "★★★★☆");
    assert.equal(getStars(5), "★★★★★");
});