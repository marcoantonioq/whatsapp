import configs from "@config/index";
import Google, { google } from "@libs/google";
import { Contato, InterfaceRepository } from "../core/Contacts";

export class SyncSheet {
  constructor(private readonly repo: InterfaceRepository) {}

  async execute() {
    await google.auth({
      credentials: configs.GOOGLE.AUTH,
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets.readonly",
        "https://www.googleapis.com/auth/contacts.readonly",
      ],
    });

    const rows = await google.contatos({
      id: configs.GOOGLE.SHEET_DOC_ID,
      range: "Contatos",
    });
    console.log(rows);
    // if (rows.data.values) {
    //   // Header
    //   rows.data.values.shift();
    //   this.repo.clean();
    //   rows.data.values
    //     .filter(([nome, , telefone]) => nome && telefone)
    //     .forEach(([nome, notas, telefone, datas, grupos, address, id]) =>
    //       this.repo.add(
    //         new Contato(id, nome, notas, telefone, grupos, datas, null, address)
    //       )
    //     );
    // }
    // return this.repo.index();
  }
}

export default SyncSheet;
