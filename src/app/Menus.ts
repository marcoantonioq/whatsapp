import { Contact } from "@modules/contacts/core/Contacts";
import {
  contactWhatsappToContact,
  contatos,
  extractNumber,
  google,
  messages,
  openAI,
  questionAPI,
  removeDuplicates,
  scrapy,
  sendImgToAPI,
  sendTextAPI,
  transcreverAudio,
  writeSonic,
} from "./handlers";

const GROUPS = <string[]>[
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
  "Cooperador",
  // "Ancião",
];

const API: menu[] = [
  {
    label: "Enviar mensagem",
    regex: "send|enviar|msg",
    action: async (input: string) => {
      const numbers: string[] = [];
      const contacts: Contact[] = [];
      const messagesID: string[] = [];
      const menuGROUPS = GROUPS.map(
        (option, index) => `${index + 1}. ${option}`
      ).join("\n");

      const isExit = (body: string) => {
        if (/^(s|sair|cancelar)$/gi.test(body || "")) {
          const ms = "Operação cancelada!";
          sendTextAPI(ms);
          throw new Error(ms);
        }
      };

      while (true) {
        const msg = await questionAPI(
          `Informe contatos para o envio [ok]:\n\n${menuGROUPS}`
        );
        if (/^(o|ok)$/gi.test(msg.body || "")) break;
        if (msg.body) {
          isExit(msg.body);
          (await extractNumber(msg.body)).forEach((n) => numbers.push(n));
          const group = GROUPS[+Number(msg.body) - 1]; // grupo selecionado!
          const select = (await contatos.contacts()).filter((c) =>
            c.isInTheGroup(group)
          );
          for (const c of select) {
            (await extractNumber(c.telefones)).forEach((n) => numbers.push(n));
          }
          sendTextAPI(
            `Grupo (${+Number(msg.body)}) selecionando: ${group} com ${
              select.length
            } contatos!`
          );
        }
      }

      for (const number of removeDuplicates(numbers)) {
        const wc = await messages.getContact(`55${number}@c.us`);
        if (wc) {
          const contact = await contactWhatsappToContact(wc);
          if (contact) contacts.push(contact);
        }
      }
      // Mostrar contatos selecionados
      await sendTextAPI(
        contacts
          .map((el) => {
            return `${el.nome} - (${el.telefones})`;
          })
          .join("\n")
      );

      // Coleta mensagens para envio
      while (true) {
        const msg = await questionAPI(
          "Informe a mensagem para cadastro [enviar]:"
        );
        if (/^(e|enviar)$/gi.test(msg.body || "")) break;
        isExit(msg.body || "");
        messagesID.push(msg.id);
      }

      // Envia mensagens
      if (messagesID.length) {
        questionAPI("Cancelar [s/n]?")
          .then((msg) => {
            isExit(msg.body || "");
          })
          .catch((error) => {
            throw error;
          });
        sendTextAPI("Enviando mensagens...");
        await new Promise((resolve) => {
          setTimeout(async () => {
            resolve(true);
          }, 5000);
        });
        for (const contact of contacts) {
          await messages.forwardMessages({
            number: contact.id,
            messagesID: messagesID,
          });
        }
      }

      return "Finalizado!";
    },
  },
  {
    label: "Transcrição",
    regex: "audio",
    action: async (input: string) => {
      while (true) {
        const msg = await questionAPI("Ok, envie o audio [(s)sair]:");
        if (/^(s|sair)$/gi.test(msg.body || "")) break;
        if (msg.hasMedia && ["audio", "ptt"].includes(msg.type || "")) {
          const media = await messages.downloadMedia(msg.id);
          sendTextAPI(`Transcrição: \n\n"${await transcreverAudio(media)}"`);
          break;
        }
      }
      return "Transcrição realizada!";
    },
  },
  {
    label: "Criar aviso",
    regex: "(criar |)aviso",
    action: async (input: string) => {
      while (true) {
        const aviso = await questionAPI(
          "Informe o aviso que deseja  [(s)sair]:"
        );

        if (/^(s|sair)$/gi.test(aviso.body || "")) break;

        if (aviso.body) {
          const html = await scrapy.createPageTemplate("aviso", [
            [
              "content",
              aviso.body
                .trim()
                .split("\n")
                .map((el) => el.trim())
                .map((el, id) =>
                  el.match(/^\</gi) && !id ? el : `<br>${el}</br>`
                )
                .join(""),
            ],
          ]);

          const data = await scrapy.printScreenPage(
            { templateHTML: html },
            "./out/image.png"
          );
          const caption = await questionAPI("Informe o caption: ");
          if (data) await sendImgToAPI(data, caption.body || "");
        }
      }
      return "Aviso criado!";
    },
  },
  {
    label: "Google",
    regex: "google|g",
    action: async (input: string) => {
      let result = "";
      while (true) {
        const search = await questionAPI(
          "O que deseja pesquisar no google [(s)air]?"
        );
        if (/^(s|sair)$/gi.test(search.body || "")) break;
        result = await google.search.text(search.body || "");
      }
      return result;
    },
  },
  {
    label: "WriteSonic",
    regex: "write|chat|sonic",
    action: async (input: string) => {
      let result: string | undefined = "";
      while (true) {
        const search = await questionAPI(
          "O que deseja pesquisar no WriteSonic [(s)air]?"
        );
        if (/^(s|sair)$/gi.test(search.body || "")) break;
        const response = await writeSonic.text({
          to: search.to,
          from: search.from || "",
          body: search.body || "",
          type: "text",
        });

        result = response.result;
      }
      return result;
    },
  },
  {
    label: "OpenIA",
    regex: "ai|ia|open",
    action: async (input: string) => {
      let result: string | undefined = "";
      while (true) {
        const search = await questionAPI(
          "O que deseja pesquisar no OpenIA [(s)air]?"
        );
        if (/^(s|sair)$/gi.test(search.body || "")) break;
        const response = await openAI.text({
          to: search.to,
          from: search.from || "",
          body: search.body || "",
          type: "text",
        });

        result = response.result;
      }
      return result;
    },
  },
  {
    label: "Lote de mensagem",
    regex: "send|mensagens|enviar",
    action: async (input: string) => {
      while (true) {
        const contatos = await questionAPI(
          "Informe os contatos de envio (sair):"
        );
        if (/^(s|sair)$/gi.test(contatos.body || "")) break;
        console.log("Ok, enviar para os contatos: ", contatos);
      }
      return "Comando finalizado!";
    },
  },
  {
    label: "Ajuda!",
    regex: "?",
    action: async (input: string) => {
      while (true) {
        const question = await questionAPI("Em que posso ajuda-lo [(s)air]?");
        if (/^(s|sair)$/gi.test(question.body || "")) break;
        console.log("Ok: ");
      }
      return "Comando finalizado!";
    },
  },
];

/**
 * Interfaces
 */
export interface menu {
  label: string;
  regex?: string;
  action: (input: string) => Promise<string | undefined>;
}

/**
 * Class
 */
class Menu {
  options: menu[];

  constructor(options: menu[]) {
    this.options = options;
  }

  menu(): string {
    return this.options
      .map((option, index) => {
        return `${index + 1}. ${option.label}`;
      })
      .join("\n");
  }

  async selectOption(input: string): Promise<string | undefined> {
    try {
      let selectedOption: menu | undefined;
      if (/^\d+$/.test(input)) {
        const index = Number(input) - 1;
        if (index < 0 || index >= this.options.length) {
          console.log("Invalid option selected.");
          return;
        }
        selectedOption = this.options[index];
      } else if (/^\//.test(input)) {
        const newInput = input.slice(1);
        selectedOption = this.options
          .filter((op) => op.regex)
          .find((op) => {
            const regex = new RegExp(op.regex || "!!");
            return regex.test(newInput);
          });
      } else {
        console.log("Entrada inválida!");
        return;
      }
      if (!selectedOption) {
        console.log("Nenhum comando encontrado!");
        return;
      }
      return await selectedOption.action(input);
    } catch (error) {
      console.log("Erro::", error);
    }
  }
}

/**
 * Object
 */
export const menuAPI = new Menu(API);
