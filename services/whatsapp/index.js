/**
 * TypeScript message
 * @typedef { import("whatsapp-web.js").Message } msg
 * @typedef { import("whatsapp-web.js").GroupNotification } notification
 */

require("./qrCode");
require("./ready");
require("./status");
require("./loadScreen");
require("./sendMSGS");
require("./grupoAPI");
require("./grupoSubscribe");

module.exports = { status: true };
