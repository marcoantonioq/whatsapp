import { format } from "@libs/phone";
import { ModuleContacts } from "@modules/contacts";
import EventEmitter from "events";

export interface Contact {
  id?: string;
  name: string;
  number: string;
  isWhatsapp?: boolean;
  isMyContact?: boolean;
  icons?: string;
}
/**
 * Enviar mensagens para grupos
 */
export class Sends extends EventEmitter {
  private constructor(private contatos: ModuleContacts) {
    super();
  }
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
      } else if (reg(/^(list|l|listar|lista|números|telefones)$/gi)) {
        this.action = `Lista de números:`;
      } else if (
        reg(/^(ok|cadastrar)$/gi) &&
        this.contacts.length > 0 &&
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
            contact.isInTheGroup(groupSelect)
          );

          this.msg = `${this.msg}\n\nGrupo selecionando: ${groupSelect} com ${contatos.length} contatos!`;
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

      const contacts = citados
        .map((num) => {
          const id = this.contacts.findIndex(({ number }) => number === num);
          if (id < 0) {
            return <Contact>{ name: "", number: num };
          }
          return false;
        })
        .filter((contact) => contact);
      this.contacts = <Contact[]>contacts;
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
    this._contacts = [];
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
    const { msg, action, error, messagesID, _contacts: contacts } = this;
    return {
      msg,
      action,
      error,
      messagesID,
      contacts,
    };
  }

  onCreateContact(listener: (contact: Contact) => void) {
    this.on("contact_create", listener);
  }

  contactsToString() {
    return this.contacts
      .map((el) => {
        return `${el.name} - (${el.number})${el.icons}`;
      })
      .join("\n");
  }

  get contacts() {
    return this._contacts;
  }

  set contacts(contacts: Contact[]) {
    contacts.forEach((contact) => {
      const id = this._contacts.findIndex(
        ({ number }) => number === contact.number
      );
      if (id > -1) {
        const old = this._contacts[id];
        const value = <Contact>{
          name: contact.name || old.name,
          number: contact.number || old.number,
          isMyContact: contact.name || old.isMyContact,
          isWhatsapp: contact.isMyContact || old.isMyContact,
        };
        const isTrue = (value: boolean | undefined, icon: string) => {
          return value ? icon : "";
        };
        value.icons = `${isTrue(value.isWhatsapp, "🆗")} ${isTrue(
          value.isMyContact,
          "💾"
        )}`;

        this._contacts[id] = value;
      } else {
        this._contacts.push(contact);
        this.emit("contact_create", contact);
      }
    });
  }

  _contacts: Contact[] = [];
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
