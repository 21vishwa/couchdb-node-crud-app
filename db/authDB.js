
const nano = require("nano")("https://admin:pass@192.168.57.254:5984");

// ✅ DASHBOARD DATABASE
const authdb = nano.use("db name");

module.exports = authdb;
