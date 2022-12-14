import { Contatos as DSContatos, Grupos as DSGrupos } from "@prisma/client";
import db from "../libs/data";
import { sheet } from "../libs/Google/sheets";
import { format } from "../libs/Phone";

export class Grupo {
  data: DSGrupos;

  constructor(data: DSGrupos) {
    this.data = { nome: data.nome.trim() };
  }

  async save() {
    try {
      await db.grupos.upsert({
        where: this.data,
        update: this.data,
        create: this.data,
      });
    } catch (error) {}
  }
}

export class Contato {
  data: DSContatos;

  constructor(data: DSContatos) {
    this.data = data;
  }

  get telefones() {
    return this.data?.telefones
      ?.split(/,|;/)
      .map((telefone) => {
        try {
          return format(telefone);
        } catch (e) {
          return "";
        }
      })
      .filter((phone) => phone !== "");
  }

  get grupos() {
    return this.data?.grupos
      ?.split(/,|;/)
      .map((nome) => {
        return new Grupo({ nome });
      })
      .filter((grupo) => grupo.data.nome.trim() !== "");
  }

  async save() {
    this.grupos?.forEach(async (grupo) => {
      try {
        await grupo.save();
      } catch (error) {
        console.log(`Erro ao salvar grupo: ${grupo.data.nome}\n${error}`);
      }
    });
    try {
      await db.contatos.upsert({
        where: { id: this.data.id },
        update: this.data,
        create: this.data,
      });
    } catch (error) {}
  }
}

export class Agenda {
  _contatos: Contato[] = [];
  async update() {
    try {
      this.contatos = (await sheet.getRows("Contatos"))
        .map(({ _rawData }) => _rawData)
        .filter(([nome]) => nome)
        .map(
          ([
            nome,
            notas,
            telefones,
            aniversario,
            grupos,
            address,
            id,
          ]: string[]) => {
            const contato = new Contato({
              id,
              nome,
              notas,
              telefones,
              aniversario,
              grupos,
              address,
              email: "",
              status: true,
              modified: new Date(),
              created: new Date(),
            });
            contato.save();
            return contato;
          }
        );
    } catch (e) {
      this.contatos = (await db.contatos.findMany()).map(
        (data: DSContatos) => new Contato(data)
      );
      console.log("\nRecuperado dados do banco de dados!\nErro: ", e);
    }
  }

  get grupos() {
    const grupos: string[] = [];
    this.contatos.forEach((contato) => {
      contato.grupos?.forEach((grupo) => {
        return grupos.push(grupo.data.nome);
      });
    });
    return [...new Set([...grupos])];
  }

  get contatos() {
    return this._contatos;
  }

  set contatos(contatos) {
    this._contatos = [...new Set([...this._contatos, ...contatos])];
  }
}
