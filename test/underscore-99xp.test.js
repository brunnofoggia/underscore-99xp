import _ from '../lib/underscore-99xp.esm.js';

// template render
test('template rendering with mustaches {{\'99xp\'}}', () => {
    var html = _.template("{{'99xp'}}")();
    expect(html === '99xp').toBe(true);
});

// results2
test('result2 > sending args and context', () => {
    var json = {
        name: '99xp',
        methods: {
            fn: function(attr) { return this[attr]; }
        }
    };

    expect(_.result2(json.methods, 'fn', '', ['name'], json) === '99xp').toBe(true);
});

// defaults2
test('defaults2 > replacing data on complex objects', () => {
    var defaults = {
        name: 'unknown',
        contact: {
            phone: '9999999999',
            skype: 'xxxxx',
        }
    };
    var o = {
        name: '99xp',
        contact: {
            email: 'team@99xp.org',
            phone: '11912345678'
        }
    };

    var r = _.defaults2(o, defaults);
    expect(r.name==='99xp' && r.contact.email==='team@99xp.org' && r.contact.phone==='11912345678' &&   r.contact.skype==='xxxxx').toBe(true);
});

// deepValueSearch
var json = {name: '99xp', contacts: [ {email: 'team@99xp.org'} , {email: 'admin@99xp.org'} ]};
test('deepValueSearch > "name" from : '+JSON.stringify(json), () => {
    expect(_.deepValueSearch('name', json)==='99xp').toBe(true);
});

test('deepValueSearch > first email > "contacts[0][email]" from : '+JSON.stringify(json), () => {
    expect(_.deepValueSearch('contacts[0][email]', json)==='team@99xp.org').toBe(true);
});

test('deepValueSearch > list of emails > "contacts[][email]" from : '+JSON.stringify(json), () => {
    var r = _.deepValueSearch('contacts[][email]', json);
    expect(_.isArray(r) && r.length===2).toBe(true);
});

// is only object
test('isOnlyObject > testing against a json', () => {
    expect(_.isOnlyObject({})).toBe(true);
});
test('isOnlyObject > testing against an array', () => {
    expect(_.isOnlyObject([])).toBe(false);
});

// is json
test('isJSON > testing against a json', () => {
    expect(_.isJSON({})).toBe(true);
});
test('isJSON > testing against _', () => {
    expect(_.isJSON(_)).toBe(false);
});

// matchAll
test('matchAll > locating every *na* or *no*', () => {
    var r = _.matchAll('bruno fernandes', /n[ao]/g);
    expect(_.size(r)===2 && r[0]['index']===3 && r[1]['index']===9).toBe(true);
});
test('matchAll > locating something unexistent', () => {
    var r = _.matchAll('bruno fernandes', /nao/g);
    expect(r===null).toBe(true);
});

// regex Index Of
test('regexIndexOf > locating first N that is at position 3', () => {
    expect(_.regexIndexOf('bruno fernandes', /n/g)).toBe(3);
});
test('regexIndexOf > locating first N that is at position 9 because the string was cut at position 4', () => {
    expect(_.regexIndexOf('bruno fernandes', /n/g, 4)).toBe(9);
});
test('regexIndexOf > locating first i where there is none', () => {
    expect(_.regexIndexOf('bruno fernandes', /i/g)).toBe(-1);
});

// regex Last Index Of
test('regexLastIndexOf > locating last N that is at position 11 ', () => {
    expect(_.regexLastIndexOf('bruno fernandes', /n/g)).toBe(11);
});
test('regexLastIndexOf > locating last N that is at position 3 because the string was cut at position 7', () => {
    expect(_.regexLastIndexOf('bruno fernandes', /n/g, 7)).toBe(3);
});
test('regexLastIndexOf > locating last i where there is none', () => {
    expect(_.regexLastIndexOf('bruno fernandes', /i/g)).toBe(-1);
});

// toDate
test('toDate > 2020-01-01 10:00', () => {
    var d = _.toDate('2020-01-01 10:00');
    expect(d.getDate()===1 && (d.getMonth()+1)===1 && d.getFullYear()===2020).toBe(true);
});
test('toDate > 2020-10-20', () => {
    var d = _.toDate('2020-10-20');
    expect(d.getDate()===20 && (d.getMonth()+1)===10 && d.getFullYear()===2020).toBe(true);
});

// parseUrl
test('parseUrl > valid url https://99xp.org/anything', () => {
    var m = _.parseUrl('https://99xp.org/anything');
    expect(m.port===80 && m.hostname==='99xp.org' && m.schema==='https' && m.path==='/anything').toBe(true);
});
test('parseUrl > invalid url anything', () => {
    var m = _.parseUrl('anything');
    expect(!m).toBe(true);
});