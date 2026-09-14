const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "mt-private-"));

process.env.DATA_DIR = tempDir;

const tm = require("../utils/ticketManager");

test("staff tickets are created as private", () => {
    tm.createTicket("staff1", {
        channelId: "ch-staff",
        messageId: "m-staff",
        type: "staff",
        createdAt: 1000,
        private: true
    });

    assert.equal(tm.getTicket("staff1").private, true);
});

test("angels tickets are created as private", () => {
    tm.createTicket("angel1", {
        channelId: "ch-angels",
        messageId: "m-angels",
        type: "angels",
        createdAt: 1000,
        private: true
    });

    assert.equal(tm.getTicket("angel1").private, true);
});

test("general tickets are created as not private", () => {
    tm.createTicket("gen1", {
        channelId: "ch-gen",
        messageId: "m-gen",
        type: "general",
        createdAt: 1000,
        private: false
    });

    assert.equal(tm.getTicket("gen1").private, false);
});

test("report tickets are created as not private", () => {
    tm.createTicket("rep1", {
        channelId: "ch-rep",
        messageId: "m-rep",
        type: "report",
        createdAt: 1000,
        private: false
    });

    assert.equal(tm.getTicket("rep1").private, false);
});

test("updateTicket preserves private flag", () => {
    const t = tm.getTicket("gen1");

    t.claimedBy = "staff2";

    tm.updateTicket("gen1", t);

    assert.equal(tm.getTicket("gen1").private, false);
    assert.equal(tm.getTicket("gen1").claimedBy, "staff2");
});

test("createTicket defaults private to false", () => {
    tm.createTicket("gen2", {
        channelId: "ch-gen2",
        messageId: "m-gen2",
        type: "general",
        createdAt: 1000
    });

    assert.equal(tm.getTicket("gen2").private, false);
});
