"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var iots = require("io-ts");
var withMessage_1 = require("io-ts-types/lib/withMessage");
var src_1 = require("../src");
ava_1.default('reports an empty array when the result doesn’t contain errors', function (t) {
    var PrimitiveType = iots.string;
    var result = PrimitiveType.decode('foo');
    t.deepEqual(src_1.default.report(result), []);
});
ava_1.default('formats a top-level primitve type correctly', function (t) {
    var PrimitiveType = iots.string;
    var result = PrimitiveType.decode(42);
    t.deepEqual(src_1.default.report(result), [
        'Expecting string but instead got: 42'
    ]);
});
ava_1.default('formats array items', function (t) {
    var NumberGroups = iots.array(iots.array(iots.number));
    var result = NumberGroups.decode({});
    t.deepEqual(src_1.default.report(result), [
        'Expecting Array<Array<number>> but instead got: {}'
    ]);
});
ava_1.default('formats nested array item mismatches correctly', function (t) {
    var NumberGroups = iots.array(iots.array(iots.number));
    var result = NumberGroups.decode([[{}]]);
    t.deepEqual(src_1.default.report(result), [
        'Expecting number at 0.0 but instead got: {}'
    ]);
});
ava_1.default('formats branded types correctly', function (t) {
    var Positive = iots.brand(iots.number, function (n) { return n >= 0; }, 'Positive');
    t.deepEqual(src_1.default.report(Positive.decode(-1)), [
        'Expecting Positive but instead got: -1'
    ]);
    var PatronizingPositive = withMessage_1.withMessage(Positive, function (_i) { return "Don't be so negative!"; });
    t.deepEqual(src_1.default.report(PatronizingPositive.decode(-1)), [
        "Expecting Positive but instead got: -1 (Don't be so negative!)"
    ]);
});
ava_1.default('truncates really long types', function (t) {
    var longType = iots.type({
        '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890': iots.number
    });
    var messages = src_1.default.report(longType.decode(null));
    t.is(messages.length, 1);
    t.regex(messages[0], new RegExp("^Expecting .{" + (src_1.TYPE_MAX_LEN - 3) + "}\\.{3} but instead got: null$"), 'Should be truncated');
});
ava_1.default('doesn’t truncate really long types when truncating is disabled', function (t) {
    var _a;
    var longTypeName = '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890';
    var longType = iots.type((_a = {},
        _a[longTypeName] = iots.number,
        _a));
    var messages = src_1.default.report(longType.decode(null), {
        truncateLongTypes: false
    });
    t.is(messages.length, 1);
    t.is(messages[0], "Expecting { " + longTypeName + ": number } but instead got: null", 'Should not be truncated');
});
//# sourceMappingURL=index.test.js.map