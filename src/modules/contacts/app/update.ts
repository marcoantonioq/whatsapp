import configs from "@config/index";
import ModuleGoogle from "@modules/google";
import { Contact, InterfaceRepository } from "../core/Contacts";

export class Update {
  constructor(private readonly repo: InterfaceRepository) {}

  async execute() {
    const google = ModuleGoogle.create();
    const { values } = await google.sheet.getValues(
      configs.GOOGLE.SHEET_DOC_ID,
      "Contatos"
    );
    if (values) {
      const contacts = values
        .filter((c) => c[0] && c[2])
        .map((data) => {
          const [nome, notas, telefones, aniversario, grupos, address, id] =
            data;
          return Contact.create({
            address,
            aniversario,
            grupos,
            id,
            nome,
            notas,
            telefones,
          });
        });
      for (const contact of contacts) {
        await this.repo.save(contact);
      }
    }
    return this.repo.contacts();
  }
}

export default Update;
