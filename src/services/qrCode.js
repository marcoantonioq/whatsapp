const { app } = require("../modules/whatsapp");
const sheet = require("../lib/google-sheets");
const qrConsole = require("qrcode-terminal");

app.on("qr", async (qr) => {
  try {
    qrConsole.generate(qr, { small: true });
    const doc = await sheet.getDoc();
    const plan = doc.sheetsByTitle.Whatsapp;
    await plan.loadCells("A1:A3");
    const A2 = plan.getCellByA1("A2");
    A2.value = `=image("https://image-charts.com/chart?chs=500x500&cht=qr&choe=UTF-8&chl="&ENCODEURL("${qr}"))`;
    A2.save();
    const A3 = plan.getCellByA1("A3");
    A3.value = `${new Date().toLocaleString()}`;
    A3.save();
  } catch (e) {
    const ms = `Erro saveQRCode: ${e}`;
    console.error(ms);
    app.emit("messageToAPI", ms);
  }
});
