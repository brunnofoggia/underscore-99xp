import _ from 'underscore';
import _s from 'underscore.string';

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

// --------------
// Template Rendering like Angular / Vue
//     /* Samples */
//     {{ my_variable }}
//     {% if(true) { %} test {% } %}

_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g,
  evaluate: /\{\%(.+?)\%\}/g,
  escape: /\{-([\s\S]+?)-\}/g
}; // Objects - Advanced helpers
// --------------
// Traverses the children of obj along path.
// If a child is a function, it is invoked with given context and arguments.
// Returns the value of the final child, or fallback if any child is undefined.

_.result2 = function (obj, key, defaultValue, args, context) {
  var v;

  if (!obj || !_.isObject(obj) || !args && !context || typeof obj[key] !== 'function') {
    v = _.result(obj, key, defaultValue);
  } else {
    var fn = obj[key];

    if (context) {
      fn = _.bind(fn, context);
    }

    if (args) {
      fn = _.partial(_.partial, fn).apply(null, args);
    }

    v = fn() || defaultValue;
  }

  return v;
}; // Fill in a given object with default properties.
// The object of this 2nd version is to work with not plain objects


_.defaults2 = function (o, d) {
  var k1 = [],
      k2 = [];
  var kd1 = [],
      kd2 = [];

  _.map(o, function (i, k) {
    return _.isJSON(i) || _.isArray(i) ? k2.push(k) : k1.push(k);
  });

  _.map(d, function (i, k) {
    return _.isJSON(i) || _.isArray(i) ? kd2.push(k) : kd1.push(k);
  });

  var o1 = _.partial(_.pick, o).apply(null, k1),
      o2 = _.partial(_.pick, o).apply(null, k2);

  var od1 = _.partial(_.pick, d).apply(null, kd1),
      od2 = _.partial(_.pick, d).apply(null, kd2);

  o1 = _.defaults(o1, od1);

  var keys = [],
      or2 = _.clone(o2);

  if (_.size(od2)) {
    _.map(od2, function (i, k) {
      if (_.indexOf(keys, k) !== -1) {
        return;
      }

      keys.push(k);

      var r = _.defaults2(o2[k] || {}, od2[k]);

      or2[k] = r;
    });
  }

  if (_.size(o2)) {
    _.map(o2, function (i, k) {
      if (_.indexOf(keys, k) !== -1) {
        return;
      }

      keys.push(k);

      var r = _.defaults2(o2[k], od2[k] || {});

      or2[k] = r;
    });
  }

  o1 = _.extend(o1, or2);
  return o1;
}; // Locate values into an object as the samples below
//     /* Samples */
//     var json = {name: '99xp', contacts: [ {email: 'team@99xp.org'} , {email: 'admin@99xp.org'} ]};
//     
//     _.deepValueSearch('name', json) = 99xp
//     _.deepValueSearch('contacts[0][email]', json) = team@99xp.org
//     _.deepValueSearch('contacts[][email]', json) = [team@99xp.org, admin@99xp.org]
//     _.deepValueSearch('contacts', json) = [ {email: 'team@99xp.org'} , {email: 'admin@99xp.org'} ]
//     _.deepValueSearch('contacts[]', json) = [ {email: 'team@99xp.org'} , {email: 'admin@99xp.org'} ]


_.deepValueSearch = function (k, json) {
  var onlyObject = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var p = typeof k === 'string' && k ? k.split(/\[/) : k instanceof Array ? k : [];

  if (!p.length) {
    return json;
  }

  var pk = p.shift();

  if (/^(\w|\_|\-)+$/.test(pk)) {
    return this.deepValueSearch(p, json[pk], onlyObject);
  }

  if (pk === ']') {
    if (!p.length) {
      return json;
    }

    if (json instanceof Array || _.isJSON(json)) {
      var r = _.isJSON(json) || onlyObject ? {} : [];

      for (var x in json) {
        if (_.isJSON(r)) {
          r[x] = this.deepValueSearch(_.clone(p), _.clone(json[x]), onlyObject);
        } else {
          r.push(this.deepValueSearch(_.clone(p), _.clone(json[x]), onlyObject));
        }
      }

      return r;
    }
  }

  if (/(\w|\_|\-)+\]$/.test(pk)) {
    pk = pk.replace(']', '');

    if (!p.length) {
      return json ? json[pk] : undefined;
    }

    return !json ? json : this.deepValueSearch(p, json[pk], onlyObject);
  }
};

var createFieldStack = function createFieldStack(k, o) {
  var r = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (o && _typeof(o) === 'object') {
    for (var x in o) {
      var str2 = k + '[' + x + ']';

      if (_typeof(o[x]) === 'object') {
        createFieldStack(str2, o[x], r);
      } else {
        r[str2] = o[x];
      }
    }
  } else {
    r[k] = o;
  }

  return r;
}; // Convert complex json into form data
//     /* Samples */
//     var json = {name: '99xp', contacts: [ {email: 'team@99xp.org'} , {email: 'admin@99xp.org'} ]};
//     
//     _.jsonToHTMLForm(json) = {
//         name: '99xp',
//         'contacts[0][email]': 'team@99xp.org',
//         'contacts[1][email]': 'admin@99xp.org'
//      }


_.jsonToHTMLForm = function (json) {
  if (!_.isJSON(json)) {
    return false;
  }

  var r = {};

  if (_.size(json)) {
    for (var x in json) {
      r = createFieldStack(x, json[x], r);
    }
  }

  return r;
}; // Locate keys into an object as the samples below
//     /* Samples */
//     var json = {name: '99xp', contacts: [ {email: 'team@99xp.org'} , {email: 'admin@99xp.org'} ]};
//     
//     _.deepValueSearch('name', json) = [name]
//     _.deepValueSearch('contacts[][email]', json) = [contacts[0][email], contacts[1][email]]


_.deepKeySearch = function (k, j) {
  var o = _.jsonToHTMLForm(j),
      r = [];

  if (o) {
    r = _.filter(_.keys(o), function (x) {
      var rxp = new RegExp('^' + k.replace(/\[\]/, '[\\d+]').replace(/(\[|\])/g, '\\$1'), 'g');
      return rxp.test(x);
    });
  }

  return r;
}; // Checks if given object is not an array


_.isOnlyObject = function (o) {
  return _.isObject(o) && !_.isArray(o);
}; // Checks if given object is pure js object, not instance of any class


_.isJSON = function (o) {
  return _.isOnlyObject(o) && o.__proto__.__proto__ === null;
}; // String Helpers
// --------------
// Capture all occurrences in a string


_.matchAll = function (s, regexp) {
  var matches = [];
  s.replace(regexp, function () {
    var arr = [].slice.call(arguments, 0);
    var extras = arr.splice(-2);
    arr.index = extras[0];
    arr.input = extras[1];
    matches.push(arr);
  });
  return matches.length ? matches : null;
}; // Locate index of something into a string based on regexp


_.regexIndexOf = function (s, regex, startpos) {
  var indexOf = s.substring(startpos || 0).search(regex);
  return indexOf >= 0 ? indexOf + (startpos || 0) : indexOf;
}; // Locate last index of something into a string based on regexp


_.regexLastIndexOf = function (s, regex, ignoreAfterPos) {
  regex = regex.global ? regex : new RegExp(regex.source, 'g' + (regex.ignoreCase ? 'i' : '') + (regex.multiLine ? 'm' : ''));

  if (typeof ignoreAfterPos === 'undefined') {
    ignoreAfterPos = s.length;
  } else if (ignoreAfterPos < 0) {
    ignoreAfterPos = 0;
  }

  var stringToWorkWith = s.substring(0, ignoreAfterPos + 1);
  var lastIndexOf = -1;
  var nextStop = 0;
  var result;

  while ((result = regex.exec(stringToWorkWith)) != null) {
    lastIndexOf = result.index;
    regex.lastIndex = ++nextStop;
  }

  return lastIndexOf;
}; // Transform string into date


_.toDate = function (s) {
  if (!/^\d{4}\-\d{2}/.test(s)) {
    return false;
  }

  var data = s.toString().split(_.regexIndexOf(s.toString(), /T/) > 0 ? 'T' : ' '),
      dateStr = data[0].split('-'),
      timeStr = data[1] ? data[1].split(':') : [0, 0, 0],
      date;
  date = new Date(dateStr[0], parseInt(dateStr[1] || 0, 10) - 1, parseInt(dateStr[2] || 1, 10), timeStr[0] || 0, timeStr[1] || 0, timeStr[2] || 0);
  return date;
};

_.defaultPorts = {
  'http': 80,
  'https': 443,
  'ftp': 21
}; // get parts of a URL

_.parseUrl = function (u) {
  var regex = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)(:([^\/]*))?(((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(\?([^#]*))?(#(.*))?)$/gm;
  var m = regex.exec(u);

  if (m) {
    return {
      schema: m[2],
      hostname: m[3],
      port: m[5] || _.defaultPorts[m[2]],
      path: m[6] || ''
    };
  }
}; // Add all string helpers from [underscore.string](https://github.com/esamattis/underscore.string) library


_.mixin(_s.exports());

export default _;
