const { test } = require("node:test");
const assert = require("node:assert/strict");

const config = require("../config.json");

const {
    isStaff,
    parseMemberId
} = require("../utils/permissions");

function makeMember({ admin = false, roles = [] } = {}) {

    return {
        permissions: {
            has: () => admin
        },
        roles: {
            cache: {
                has: (id) => roles.includes(id)
            }
        }
    };

}

test("isStaff returns false for null member", () => {
    assert.equal(isStaff(null), false);
});

test("isStaff returns true for administrator", () => {
    assert.equal(isStaff(makeMember({ admin: true })), true);
});

test("isStaff returns true for any configured staff role", () => {
    assert.equal(isStaff(makeMember({ roles: [config.supportRole] })), true);
    assert.equal(isStaff(makeMember({ roles: [config.angelsRole] })), true);
    assert.equal(isStaff(makeMember({ roles: [config.staffRole] })), true);
    assert.equal(isStaff(makeMember({ roles: [config.reportRole] })), true);
});

test("isStaff returns false for a regular member", () => {
    assert.equal(isStaff(makeMember({ roles: ["999"] })), false);
});

test("parseMemberId accepts mentions and raw ids", () => {
    assert.equal(parseMemberId("<@123456789012345678>"), "123456789012345678");
    assert.equal(parseMemberId("<@!123456789012345678>"), "123456789012345678");
    assert.equal(parseMemberId("123456789012345678"), "123456789012345678");
});

test("parseMemberId trims whitespace", () => {
    assert.equal(parseMemberId("  123456789012345678  "), "123456789012345678");
});

test("parseMemberId rejects invalid input", () => {
    assert.equal(parseMemberId("hello"), null);
    assert.equal(parseMemberId(""), null);
    assert.equal(parseMemberId(null), null);
    assert.equal(parseMemberId("12345"), null);
});