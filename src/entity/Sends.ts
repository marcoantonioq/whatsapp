import { format } from "@libs/phone";
import { ModuleContacts } from "@modules/contacts";

/**
 * Enviar mensagens para grupos
 */
export class Sends {
  private constructor(private contatos: ModuleContacts) {}
  static create({ contatos }: { contatos: ModuleContacts }) {
    return new Sends(contatos);
  }
  async toAnalyzeAddNumber(msg: string) {
    try {
      const reg = (reg: RegExp) => {
        return msg.match(reg);
      };
      if (reg(/^(iniciar|enviar)$/gi) && this.messagesID.length > 0) {
        this.action = `Enviando mensagens!`;
        this.loggingNewMessages = false;
      } else if (reg(/^(reboot|cancelar|sair|exit)$/gi)) {
        this.action = `Ok, operação cancelada!`;
        this.cancel = true;
        this.loggingNewMessages = false;
        setTimeout(() => {
          this.cancel = false;
        }, 120000);
      } else if (reg(/^(listar|lista|números|telefones)$/gi)) {
        this.action = `Números!`;
      } else if (
        reg(/^(ok|cadastrar)$/gi) &&
        this.numbers.length > 0 &&
        !this.loggingNewMessages
      ) {
        this.action = `Ok, informe as mensagens para envio!`;
        setTimeout(() => {
          this.loggingNewMessages = true;
        }, 8000);
      } else if (this.loggingNewMessages) {
        this.action = `Mensagem registrada!`;
      } else if (reg(/^[0-9]+$/)) {
        this.action = `Novos números!`;
        this.msg = await this.addNumber(msg);
        const groupSelect = this.listGroups[+Number(msg)];
        if (groupSelect) {
          const contatos = (await this.contatos.contacts()).filter((contact) =>
            contact.isGroup(groupSelect)
          );

          this.msg = `${this.msg}\n\nGrupo selecionando: ${groupSelect} com ${
            contatos.length
          } contatos!\n\n${contatos
            .map((c) => `${c.nome} (${c.telefones})`)
            .join("\n")}`;
          this.addNumber(contatos.map((c) => c.telefones).join(", "));
        }
      } else {
        this.error = "";
        this.action = "";
      }
    } catch (e) {
      console.log("Erro ao analisar a mensagem:", e);
      this.error = String(e);
    }
    return this.response;
  }
  async addNumber(numbers: string) {
    let msg = "";
    if (!this.loggingNewMessages && numbers.match(/(\d{4}-\d{4}|\d{8})+/gi)) {
      const citados = numbers
        .split(/(\n|\r|\t|,|;)/gi)
        .map((el) => el.replace(/\D/gim, ""))
        .filter((el) => el.match(/(\d{8,13})+/gi))
        .map(format)
        .filter((el) => el !== "");

      citados.forEach((number) => {
        if (this.numbers.indexOf(number) === -1) {
          this.numbers.push(number);
        }
      });
      if (citados.length)
        msg = `\nNúmeros citados (${citados.length}): ${citados.join(", ")}`;
    }
    return msg;
  }

  addMsg(id: string) {
    this.messagesID.push(id);
    return this.messagesID;
  }

  async reset(
    msg: string = "⏹️ Paramos encaminhar msg para os números citados!"
  ) {
    this.numbers = [];
    this.messagesID = [];
    this.error = "";
    this.msg = "";
    this.loggingNewMessages = false;
    return msg;
  }

  get groups() {
    return `Enviar mensagem para o grupo: \n\n${this.listGroups
      .map((el, id) => `${id} - ${el}`)
      .join("\n")}`;
  }

  get response() {
    const { msg, action, error, messagesID, numbers } = this;
    return {
      msg,
      action,
      error,
      messagesID,
      numbers,
    };
  }

  numbers: string[] = [];
  messagesID: string[] = [];
  action = "";
  msg = "";
  error = "";
  loggingNewMessages = false;
  listGroups = [
    "Aviso - Reuniões de Evangelização",
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
