const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "mt-tickets-"));

process.env.DATA_DIR = tempDir;

const tm = require("../utils/ticketManager");

test("creates tickets.json on first load", () => {
    tm.hasOpenTicket("none");

    assert.ok(fs.existsSync(path.join(tempDir, "tickets.json")));
});

test("getNextTicketNumber starts at 0001 and increments", () => {
    assert.equal(tm.getNextTicketNumber(), "0001");
    assert.equal(tm.getNextTicketNumber(), "0002");
});

test("hasOpenTicket returns false for unknown user", () => {
    assert.equal(tm.hasOpenTicket("user1"), false);
});

test("createTicket then getTicket and hasOpenTicket", () => {
    tm.createTicket("user1", {
        channelId: "ch1",
        messageId: "msg1",
        type: "general",
        createdAt: 1000
    });

    assert.equal(tm.hasOpenTicket("user1"), true);

    const t = tm.getTicket("user1");

    assert.equal(t.channelId, "ch1");
    assert.equal(t.type, "general");
    assert.equal(t.status, "open");
    assert.equal(t.claimedBy, null);
});

test("getTicketByChannel finds ticket by channel id", () => {
    const found = tm.getTicketByChannel("ch1");

    assert.ok(found);
    assert.equal(found.userId, "user1");
    assert.equal(found.ticket.channelId, "ch1");
});

test("getTicketByChannel returns null for unknown channel", () => {
    assert.equal(tm.getTicketByChannel("nope"), null);
});

test("claimTicket records staff and timestamp", () => {
    assert.equal(tm.claimTicket("user1", "staff1"), true);

    const t = tm.getTicket("user1");

    assert.equal(t.claimedBy, "staff1");
    assert.ok(t.claimedAt);
});

test("claimTicket returns false for missing ticket", () => {
    assert.equal(tm.claimTicket("ghost", "staff1"), false);
});

test("updateTicket replaces ticket data", () => {
    const t = tm.getTicket("user1");

    t.status = "closed";

    tm.updateTicket("user1", t);

    assert.equal(tm.getTicket("user1").status, "closed");
});

test("removeTicket deletes ticket", () => {
    tm.removeTicket("user1");

    assert.equal(tm.hasOpenTicket("user1"), false);
    assert.equal(tm.getTicketByChannel("ch1"), null);
});

test("ticket number persists in the JSON file", () => {
    const raw = JSON.parse(
        fs.readFileSync(path.join(tempDir, "tickets.json"), "utf8")
    );

    assert.equal(raw.lastTicket, 2);
});