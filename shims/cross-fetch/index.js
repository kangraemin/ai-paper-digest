'use strict';
const f = (...args) => globalThis.fetch(...args);
module.exports = f;
module.exports.default = f;
module.exports.fetch = f;
module.exports.Request = globalThis.Request;
module.exports.Response = globalThis.Response;
module.exports.Headers = globalThis.Headers;
