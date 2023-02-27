import { formatWhatsapp } from "@libs/phone";
import { ModuleContacts } from "@modules/contacts";

interface Result {
  msg: string;
  error: string;
  numbers: string[];
}

/**
 * Enviar mensagens para grupos
 */
export class Sends {
  private constructor(private contatos: ModuleContacts) {}
  static create({ contatos }: { contatos: ModuleContacts }) {
    return new Sends(contatos);
  }
  async toAnalyzeAddNumber(msg: string): Promise<Result> {
    let response = {
      msg: "",
      error: "",
      numbers: this.numbers,
    };
    try {
      const reg = (reg: RegExp) => {
        return msg.match(reg);
      };
      if (reg(/^(reboot|cancelar|sair|exit)$/gi)) {
        this.cancel = true;
        response.msg = `Ok, operação cancelada!`;
      } else if (reg(/^(ok|cadastrar)$/gi) && !this.loggingNewMessages) {
        this.loggingNewMessages = true;
        response.msg = `Ok, informe as mensagens para envio!`;
      } else if (/^[0-9]+$/gi) {
        response.msg = await this.addNumber(msg);
        const groupSelect = this.grupos[+Number(msg)];
        if (groupSelect) {
          const contatos = (await this.contatos.contacts()).filter((contact) =>
            contact.isGroup(groupSelect)
          );

          response.msg = `${
            response.msg
          }\n\nGrupo selecionando: ${groupSelect} com ${
            contatos.length
          } contatos!\n\n${contatos
            .map((c) => `${c.nome}(${c.telefones}))`)
            .join(", ")}`;
          this.addNumber(contatos.join(", "));
        }
        response.msg = `${
          response.msg
        }\n\nEnviar mensagem para o grupo: ${this.grupos
          .map((el, id) => `\n${id} - ${el}`)
          .join()}`;
      }
    } catch (e) {
      console.log("Erro ao analisar a mensagem:", e);
      response.error = String(e);
    }
    return response;
  }
  async addNumber(numbers: string) {
    if (!this.loggingNewMessages && numbers.match(/(\d{4}-\d{4}|\d{8})+/gi)) {
      let isAdd = false;
      const citados = numbers
        .split(/(\n|\r|\t|,|;)/gi)
        .map((el) => el.replace(/\D/gim, ""))
        .filter((el) => el.match(/(\d{4}-\d{4}|\d{8})+/gi))
        .map(formatWhatsapp)
        .filter((el) => el && el !== "");

      citados.forEach((number) => {
        if (this.numbers.indexOf(number) === -1) {
          this.numbers.push(numbers);
          isAdd = true;
        }
      });
      if (isAdd)
        return `\nNúmeros citados (${citados.length}): ${citados.join(", ")}`;
    }
    return "";
  }

  async reset(
    msg: string = "⏹️ Paramos encaminhar msg para os números citados!"
  ) {
    this.numbers = [];
    this.ids = [];
    this.loggingNewMessages = false;
    return msg;
  }

  numbers: string[] = [];
  ids: string[] = [];
  loggingNewMessages = false;
  grupos = [
    "Irmandade Goiás",
    "Irmandade Mirandópolis",
    "Irmandade Mossâmedes",
    "Irmandade Uvá",
    "Ministério Cidade de Goiás",
    "Jovens Goiás",
    "Músicos Goiás",
    "Voluntários",
    "Testemunhado",
    // "TempoNovo",
    "Ânimo",
    // "Irmão",
    // "Piedade",
    // "Porteiros",
    // "IFG",
    "Teste1",
    "Teste2",
    // "Família",
    // "Cooperador",
    // "Ancião",
  ];
  cancel = false;
}
