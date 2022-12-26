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
require("./groupAPI");
require("./groupSubscribe");
require("./groupRemove");
require("./groupLOG");

module.exports = { status: true };
