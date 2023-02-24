import { Contact, InterfaceRepository } from "../core/Contacts";

export class ExtractValues {
  constructor(private readonly repo: InterfaceRepository) {}

  async execute(values: any[]) {
    return values
      .filter(
        ([nome, , telefone]: [string, string, string]) => nome && telefone
      )
      .map(
        ([nome, notas, telefones, aniversario, grupos, address, id]: [
          string,
          string,
          string,
          string,
          string,
          string,
          string
        ]) =>
          Contact.create({
            address,
            aniversario,
            grupos,
            id,
            nome,
            notas,
            telefones,
          })
      );
  }
}

export default ExtractValues;
