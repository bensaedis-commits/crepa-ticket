const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "mt-stats-"));

process.env.DATA_DIR = tempDir;

const sm = require("../utils/staffStatsManager");

test("getStats returns zeroed defaults for a new staff member", () => {
    const s = sm.getStats("staff1");

    assert.equal(s.claimed, 0);
    assert.equal(s.closed, 0);
    assert.equal(s.reviews, 0);
    assert.equal(s.rating, 0);
    assert.equal(s.totalResponseTime, 0);
    assert.equal(s.totalCloseTime, 0);
});

test("addClaim increments claimed", () => {
    sm.addClaim("staff1");

    assert.equal(sm.getStats("staff1").claimed, 1);
});

test("addClosed increments closed", () => {
    sm.addClosed("staff1");

    assert.equal(sm.getStats("staff1").closed, 1);
});

test("addReview accumulates rating and reviews", () => {
    sm.addReview("staff1", 5);
    sm.addReview("staff1", 3);

    const s = sm.getStats("staff1");

    assert.equal(s.reviews, 2);
    assert.equal(s.rating, 8);
});

test("addResponseTime and addCloseTime accumulate", () => {
    sm.addResponseTime("staff1", 5000);
    sm.addResponseTime("staff1", 5000);
    sm.addCloseTime("staff1", 10000);

    const s = sm.getStats("staff1");

    assert.equal(s.totalResponseTime, 10000);
    assert.equal(s.totalCloseTime, 10000);
});

test("getAllStats contains the staff member", () => {
    const all = sm.getAllStats();

    assert.ok(all["staff1"]);
});

test("data persists to staffStats.json", () => {
    const raw = JSON.parse(
        fs.readFileSync(path.join(tempDir, "staffStats.json"), "utf8")
    );

    assert.ok(raw.staff["staff1"]);
});