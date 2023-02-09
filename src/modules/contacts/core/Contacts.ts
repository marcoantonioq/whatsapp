import { Contatos as DSContatos, Grupos as DSGrupos } from "@prisma/client";
import { format } from "../../../libs/phone";

export class Grupo implements DSGrupos {
  constructor(public nome: string) {
    this.nome = nome.trim();
  }
  toJSON() {
    return JSON.stringify({
      nome: this.nome,
    });
  }
}

export class Contato implements DSContatos {
  public update = false;
  constructor(
    public id: string,
    public nome: string,
    public notas: string | null = null,
    public telefones: string,
    public grupos: string | null = null,
    public aniversario: string | null = null,
    public email: string | null = null,
    public address: string | null = null,
    public status: boolean | null = true,
    public modified: Date | null = null,
    public created: Date | null = null
  ) {
    this.setTelefones(telefones);
    if (grupos) this.setGrupos(grupos);
  }

  setTelefones(telefones: string) {
    this.telefones = telefones
      ?.split(/,|;/)
      .map((telefone) => {
        try {
          return format(telefone);
        } catch (e) {
          return "";
        }
      })
      .filter((phone) => phone !== "")
      .join(", ");
  }

  setGrupos(grupos: string) {
    this.grupos = grupos
      ?.split(/,|;/)
      .map((nome) => {
        return new Grupo(nome).nome;
      })
      .filter((grupo) => grupo !== "")
      .join(", ");
  }

  getJSON() {
    return JSON.stringify({
      id: this.id,
      nome: this.nome,
      notas: this.notas,
      telefones: this.telefones,
      grupos: this.grupos,
      aniversario: this.aniversario,
      email: this.email,
      address: this.address,
      status: this.status,
      modified: this.modified,
      created: this.created,
    });
  }
}

export interface InterfaceRepository {
  index(): Promise<Contato[]>;
  add(contato: Contato): Promise<Boolean>;
  delete(contato: Contato): Promise<Boolean>;
  clean(): Promise<Boolean>;
}
