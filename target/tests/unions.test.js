"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var iots = require("io-ts");
var src_1 = require("../src");
ava_1.default('formats keyof unions as "regular" types', function (t) {
    var WithKeyOf = iots.interface({
        oneOf: iots.keyof({ a: null, b: null, c: null })
    });
    t.deepEqual(src_1.default.report(WithKeyOf.decode({ oneOf: '' })), [
        'Expecting "a" | "b" | "c" at oneOf but instead got: ""'
    ]);
});
ava_1.default('union of string literals (no key)', function (t) {
    t.deepEqual(src_1.default.report(Gender.decode('male')), [
        [
            'Expecting one of:',
            '    "Male"',
            '    "Female"',
            '    "Other"',
            'but instead got: "male"'
        ].join('\n')
    ]);
});
ava_1.default('union of interfaces', function (t) {
    var UnionOfInterfaces = iots.union([
        iots.interface({ key: iots.string }),
        iots.interface({ code: iots.number })
    ]);
    var WithUnion = iots.interface({ data: UnionOfInterfaces });
    t.deepEqual(src_1.default.report(WithUnion.decode({})), [
        [
            'Expecting one of:',
            '    { key: string }',
            '    { code: number }',
            'at data but instead got: undefined'
        ].join('\n')
    ]);
    t.deepEqual(src_1.default.report(WithUnion.decode({ data: '' })), [
        [
            'Expecting one of:',
            '    { key: string }',
            '    { code: number }',
            'at data but instead got: ""'
        ].join('\n')
    ]);
    t.deepEqual(src_1.default.report(WithUnion.decode({ data: {} })), [
        [
            'Expecting one of:',
            '    { key: string }',
            '    { code: number }',
            'at data but instead got: {}'
        ].join('\n')
    ]);
    t.deepEqual(src_1.default.report(WithUnion.decode({ data: { code: '123' } })), [
        [
            'Expecting one of:',
            '    { key: string }',
            '    { code: number }',
            'at data but instead got: {"code":"123"}'
        ].join('\n')
    ]);
});
var Gender = iots.union([
    iots.literal('Male'),
    iots.literal('Female'),
    iots.literal('Other')
]);
ava_1.default('string union when provided undefined', function (t) {
    var Person = iots.interface({ name: iots.string, gender: Gender });
    t.deepEqual(src_1.default.report(Person.decode({ name: 'Jane' })), [
        [
            'Expecting one of:',
            '    "Male"',
            '    "Female"',
            '    "Other"',
            'at gender but instead got: undefined'
        ].join('\n')
    ]);
});
ava_1.default('string union when provided another string', function (t) {
    var Person = iots.interface({ name: iots.string, gender: Gender });
    t.deepEqual(src_1.default.report(Person.decode({ name: 'Jane', gender: 'female' })), [
        [
            'Expecting one of:',
            '    "Male"',
            '    "Female"',
            '    "Other"',
            'at gender but instead got: "female"'
        ].join('\n')
    ]);
    t.deepEqual(src_1.default.report(Person.decode({ name: 'Jane' })), [
        [
            'Expecting one of:',
            '    "Male"',
            '    "Female"',
            '    "Other"',
            'at gender but instead got: undefined'
        ].join('\n')
    ]);
});
ava_1.default('string union deeply nested', function (t) {
    var Person = iots.interface({
        name: iots.string,
        children: iots.array(iots.interface({ gender: Gender }))
    });
    t.deepEqual(src_1.default.report(Person.decode({
        name: 'Jane',
        children: [{}, { gender: 'Whatever' }]
    })), [
        [
            'Expecting one of:',
            '    "Male"',
            '    "Female"',
            '    "Other"',
            'at children.0.gender but instead got: undefined'
        ].join('\n'),
        [
            'Expecting one of:',
            '    "Male"',
            '    "Female"',
            '    "Other"',
            'at children.1.gender but instead got: "Whatever"'
        ].join('\n')
    ]);
});
ava_1.default('truncates really long unions', function (t) {
    var longUnion = iots.union([
        iots.type({
            '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890': iots.string
        }),
        iots.type({
            '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890': iots.number
        })
    ]);
    var messages = src_1.default.report(longUnion.decode(null));
    t.is(messages.length, 1);
    t.regex(messages[0], new RegExp("^Expecting one of:\n( *.{" + (src_1.TYPE_MAX_LEN - 3) + "}\\.{3}\n){2} *but instead got: null$"), 'Should be truncated');
});
//# sourceMappingURL=unions.test.js.map