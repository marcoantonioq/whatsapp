import configs from "@config/index";
import Google from "../core/Google";
import { Contato } from "@modules/contacts/core/Contacts";

export class GetContacts {
  constructor(private readonly repo?: any) {}

  async execute() {
    const contatos: Contato[] = [];
    const google = Google.create();
    await google.auth({
      credentials: configs.GOOGLE.AUTH,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const rows = await google.spreadsheets.values.get({
      auth: google.client,
      spreadsheetId: configs.GOOGLE.SHEET_DOC_ID,
      range: "Contatos",
    });
    rows.data.values?.forEach((el) => {});
    if (rows.data.values) {
      rows.data.values.shift();
      rows.data.values
        .filter(([nome, , telefone]) => nome && telefone)
        .forEach(([nome, notas, telefone, datas, grupos, address, id]) =>
          contatos.push(
            new Contato(id, nome, notas, telefone, grupos, datas, null, address)
          )
        );
    }
    return contatos;
  }
}

export default GetContacts;
