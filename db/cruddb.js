process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const nano = require("nano")("https://ruler:ruler@192.168.57.254:5984");

// ✅ DASHBOARD DATABASE
const cruddb = nano.use("kasi_");

module.exports = cruddb;
