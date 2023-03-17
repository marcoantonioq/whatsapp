import { menu } from "./Menus";
import { Contact } from "@modules/contacts/core/Contacts";
import { layouts as PageLayouts } from "@modules/scrappy/app/create-page-template";
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
  whatsappToHtml,
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
  "TempoNovo",
  "Ânimo",
  "Irmão",
  "Piedade",
  "Porteiros",
  "IFG",
  "Teste1",
  "Teste2",
  "Família",
  "Cooperador",
];

export const API: menu[] = [
  {
    label: "Enviar mensagem",
    regex: "send|enviar|msg",
    action: async (input: string) => {
      // Variáveis
      const numbers: string[] = [];
      const contacts: Contact[] = [];
      const messagesID: string[] = [];
      const menuGROUPS = GROUPS.map(
        (option, index) => `${index + 1}. ${option}`
      ).join("\n");

      // Funções
      const isExit = (body: string) => {
        if (/^(s|sair|cancelar)$/gi.test(body || "")) {
          const ms = "Operação cancelada!";
          sendTextAPI(ms);
          throw new Error(ms);
        }
      };

      // Coletar números de telefones
      while (true) {
        const msg = await questionAPI(
          `Informe contatos para o envio [ok]:\n\n${menuGROUPS}`
        );
        if (/^(o|ok)$/gi.test(msg.body || "")) break;
        if (msg.body) {
          isExit(msg.body);
          const extracted = await extractNumber(msg.body);
          if (extracted.length) {
            sendTextAPI(`Números extraídos: ${extracted.length}!`);
            extracted.forEach((n) => numbers.push(n));
          }
          const group = GROUPS[+Number(msg.body) - 1]; // grupo selecionado!
          const select = (await contatos.contacts()).filter((c) =>
            c.isInTheGroup(group)
          );
          for (const c of select) {
            (await extractNumber(c.telefones)).forEach((n) => numbers.push(n));
          }
          if (select.length)
            sendTextAPI(
              `Grupo (${+Number(msg.body)}) selecionando: ${group} com ${
                select.length
              } contatos!`
            );
        }
      }

      // Remover números duplicados e criar lista de contatos
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
        }
      }
      return "Transcrição realizada!";
    },
  },
  {
    label: "Criar aviso",
    regex: "(criar |)aviso",
    action: async (input: string) => {
      const types = Object.keys(PageLayouts);
      while (true) {
        try {
          let menu: string = types
            .map((el, id) => `${1 + id}. ${el}`)
            .join("\n");
          let select: number = Number(
            (
              await questionAPI(
                `Informe o tipo de aviso que deseja [(s)sair]: \n${menu}`
              )
            ).body
          );
          const type = types[select - 1];
          console.log("Selecionado: ", select, type, types);
          const aviso = await questionAPI(
            `Aviso selecionado: ${type}\n\nInforme o texto [(s)sair]:`
          );

          if (/^(s|sair)$/gi.test(aviso.body || "")) break;

          if (aviso.body) {
            const html = await scrapy.createPageTemplate(
              <keyof typeof PageLayouts>type,
              [["content", whatsappToHtml(aviso.body)]]
            );

            const data = await scrapy.printScreenPage(
              { templateHTML: html },
              "./out/image.png"
            );
            // const caption = await questionAPI("Informe o caption: ");
            if (data) await sendImgToAPI(data, "");
          }
        } catch (error) {
          console.log("Erro ao criar aviso: ", error);
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
        sendTextAPI(result || "Nenhum resultado encontrado!");
      }
      return "Finalizado!";
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

        sendTextAPI(response.result || "Nenhum resultado encontrado!");
      }
      return "Finalizado!";
    },
  },
  {
    label: "OpenIA",
    regex: "ai|ia|open",
    action: async (input: string) => {
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

        sendTextAPI(response.result || "Nenhum resultado encontrado!");
      }
      return "Finalizado";
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
