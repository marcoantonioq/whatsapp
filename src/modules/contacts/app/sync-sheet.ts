import configs from "@config/index";
import Google from "@libs/google";
import { Contato, InterfaceRepository } from "../core/Contacts";

export class SyncSheet {
  constructor(private readonly repo: InterfaceRepository) {}

  async execute() {
    const google = Google.create({
      credentials: configs.GOOGLE.AUTH,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const service = await google.sheets();
    const rows = await service.spreadsheets.values.get({
      auth: google.client,
      spreadsheetId: configs.GOOGLE.SHEET_DOC_ID,
      range: "Contatos",
    });
    (await this.repo.index()).forEach((contato) => {
      if (contato.update) {
        console.log("Atualizar dados na planilha::: ");
        // const updateValue = await service.spreadsheets.values.update({
        //   spreadsheetId: configs.GOOGLE.SHEET_DOC_ID,
        //   valueInputOption: "USER_ENTERED",
        //   range: "Whatsapp!A3",
        //   requestBody: {
        //     values: [[new Date().toLocaleString()]],
        //   },
        // });
        // console.log("Update:::", updateValue);
      }
    });
    if (rows.data.values) {
      // Header
      rows.data.values.shift();
      this.repo.clean();
      rows.data.values
        .filter(([nome, , telefone]) => nome && telefone)
        .forEach(([nome, notas, telefone, datas, grupos, address, id]) =>
          this.repo.add(
            new Contato(id, nome, notas, telefone, grupos, datas, null, address)
          )
        );
    }
    return this.repo.index();
  }
}

export default SyncSheet;
