import configs from "@config/index";
import Google from "../core/Google";
import { Contact } from "@modules/contacts/core/Contacts";

export class GetValuesInSheet {
  constructor(private readonly repo?: any) {}

  async execute(spreadsheetId: string, range: string) {
    const contatos: Contact[] = [];
    const google = Google.create();
    await google.auth({
      credentials: configs.GOOGLE.AUTH,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const rows = await google.spreadsheets.values.get({
      auth: google.client,
      spreadsheetId,
      range,
    });
    return rows.data;
  }
}

export default GetValuesInSheet;
