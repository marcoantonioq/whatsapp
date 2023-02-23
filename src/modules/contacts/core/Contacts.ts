import { Contatos as DSContatos, Grupos as DSGrupos } from "@prisma/client";
import { formatWhatsapp } from "@libs/phone";

export class Group implements DSGrupos {
  constructor(public nome: string) {
    this.nome = nome.trim();
  }
  toJSON() {
    return JSON.stringify({
      nome: this.nome,
    });
  }
}

export class Contact implements DSContatos {
  public update = false;
  constructor(
    public id: string = "",
    public nome: string = "",
    public notas: string | null = null,
    public telefones: string = "",
    public grupos: string | null = null,
    public aniversario: string | null = null,
    public email: string | null = null,
    public address: string | null = null,
    public status: boolean | null = true,
    public datas: Date | null = null,
    public modified: Date | null = null,
    public created: Date | null = null
  ) {}

  static create(contact: Partial<Contact>): Contact {
    const new_contact = Object.assign(new Contact(), { ...contact });
    if (contact.telefones) new_contact.setTelefones(contact.telefones);
    if (contact.grupos) new_contact.setGrupos(contact.grupos);
    return new_contact;
  }

  setTelefones(telefones: string) {
    this.telefones = telefones
      ?.split(/,|;/)
      .map((telefone) => {
        try {
          return formatWhatsapp(telefone);
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
        return new Group(nome).nome;
      })
      .filter((grupo) => grupo !== "")
      .join(", ");
  }

  isGroup(grupo: string) {
    if (!grupo || grupo === "") return false;
    return !!this.grupos?.includes(grupo);
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
  contacts(): Promise<Contact[]>;
  save(contato: Contact): Promise<Boolean>;
  delete(contato: Contact): Promise<Boolean>;
  clean(): Promise<Boolean>;
}
