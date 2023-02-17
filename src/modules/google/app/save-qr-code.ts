import configs from "@config/index";
import Google from "../core/Google";
import { Contato } from "@modules/contacts/core/Contacts";

export class SaveQrCode {
  constructor(private readonly repo?: any) {}

  async execute(qr: string) {
    const google = Google.create();
    await google.auth({
      credentials: configs.GOOGLE.AUTH,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const updateValue = await google.spreadsheets.values.update({
      spreadsheetId: configs.GOOGLE.SHEET_DOC_ID,
      valueInputOption: "USER_ENTERED",
      range: "Whatsapp!A2:A3",
      requestBody: {
        values: [
          [
            `=image("https://image-charts.com/chart?chs=500x500&cht=qr&choe=UTF-8&chl="&ENCODEURL("${qr}"))`,
          ],
          [new Date().toLocaleString()],
        ],
      },
    });
    return updateValue;
  }
}

export default SaveQrCode;
