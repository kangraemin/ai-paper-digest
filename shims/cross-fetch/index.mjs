const f = (...args) => globalThis.fetch(...args);
export default f;
export { f as fetch };
export const Request = globalThis.Request;
export const Response = globalThis.Response;
export const Headers = globalThis.Headers;
