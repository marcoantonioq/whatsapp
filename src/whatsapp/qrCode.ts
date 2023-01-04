import { app, api } from "./whatsapp";
import { sheet } from "../Google/sheets";
import qrConsole from "qrcode-terminal";

app.on("qr", async (qr) => {
  try {
    qrConsole.generate(qr, { small: true });
    const plan = sheet.doc.sheetsByTitle.Whatsapp;
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
    console.log(ms);
  }
});
