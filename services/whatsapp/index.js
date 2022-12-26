/**
 * TypeScript message
 * @typedef { import("whatsapp-web.js").Message } msg
 * @typedef { import("whatsapp-web.js").GroupNotification } notification
 */
require("./apiGroup");
require("./apiHello");
require("./groupLOG");
require("./groupRemove");
require("./groupSubscribe");
require("./loadScreen");
require("./qrCode");
require("./sendCitado");
require("./sendMSGS");
require("./status");

module.exports = { status: true };
