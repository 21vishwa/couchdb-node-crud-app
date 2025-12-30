
const nano = require("nano")("https://ruler:ruler@192.168.57.254:5984");

// ✅ DASHBOARD DATABASE
const authdb = nano.use("kasi_auth");

module.exports = authdb;
