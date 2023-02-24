// https://docs.orkestral.io/venom/#/
import configs from "@config/index";
import { formatWhatsapp } from "@libs/phone";
import { Contact } from "@modules/contacts/core/Contacts";
import { Message } from "@modules/messages/core/Message";
import { EventsApp, Module as ModuleType } from "@types";

export const module = <ModuleType>{
  async initialize(app: import("events")): Promise<Boolean> {
    let numbers: string[] = [];
    let ids: string[] = [];
    let sending = false;
    const grupos = [
      "Ancião",
      "Ânimo",
      "Cooperador",
      "Família",
      "IFG",
      "Irmandade Goiás",
      "Irmandade Mirandópolis",
      "Irmandade Mossâmedes",
      "Irmandade Uvá",
      "Irmão",
      "Jovens Goiás",
      "Ministério Cidade de Goiás",
      "Músicos Goiás",
      "Piedade",
      "Porteiros",
      "TempoNovo",
      "Teste1",
      "Teste2",
      "Testemunhado",
      "Voluntários",
    ];

    const showNumbers = () => {
      app.emit(
        EventsApp.MESSAGE_SEND,
        Message.create({
          to: configs.WHATSAPP.GROUP_SEND,
          body: `▶️ Enviaremos novas mensagens para: \n\n⏹️ Sair / Cancelar\n📤 Enviar / Ok\n\nNúmeros citados (${
            numbers.length
          }): ${numbers.join(", ")}`,
        })
      );
    };

    const sendSEND = (body: string) => {
      app.emit(
        EventsApp.MESSAGE_SEND,
        Message.create({
          to: configs.WHATSAPP.GROUP_SEND,
          body,
        })
      );
    };

    const resetSEND = (
      body: string = "⏹️ Paramos encaminhar msg para os números citados!"
    ) => {
      numbers = [];
      ids = [];
      sending = false;
      sendSEND(body);
    };

    app.on(EventsApp.MESSAGE_CREATE, async (msg: Message) => {
      if (msg.body?.startsWith("🤖:")) return true;
      if (msg.to === configs.WHATSAPP.GROUP_SEND) {
        const reg = (reg: RegExp) => {
          return !msg.hasMedia && msg.body && msg.body.match(reg);
        };
        if (reg(/^(reboot|cancelar|sair|exit)$/gi)) {
          resetSEND();
        } else if (reg(/^(iniciar|ok|enviar)$/gi) && numbers.length > 0) {
          if (sending) {
            numbers.forEach((number) => {
              app.emit(EventsApp.FORWARD_MESSAGES, {
                to: `55${number}@c.us`,
                ids: ids,
              });
            });
            resetSEND();
          } else {
            sendSEND(`Ok, vamos organizar tudo para iniciar....`);
            setTimeout(() => {
              sendSEND(
                `Próximas mensagens será encaminhada para ${numbers.length} número(s)!`
              );
              sending = true;
              setTimeout(resetSEND, 60000);
            }, 8000);
          }
        } else if (msg.body && reg(/(\d{4}-\d{4}|\d{8})+/gi)) {
          numbers = [
            ...new Set([
              ...numbers,
              ...msg.body
                .split(/(\n|\r|\t|,|;)/gi)
                .map((el) => el.replace(/\D/gim, ""))
                .filter((el) => el.match(/(\d{4}-\d{4}|\d{8})+/gi))
                .map(formatWhatsapp)
                .filter((el) => el && el !== "")
                .map((el) => String(el)),
            ]),
          ];
          showNumbers();
        } else if (sending) {
          sendSEND(`Mensagem registrada!`);
          ids.push(msg.id);
        } else {
          const groupSelect = grupos[+Number(msg.body)];
          if (groupSelect) {
            const contacts: Contact[] = await new Promise((resolve) => {
              app.emit(EventsApp.CONTACTS, {
                listener: (contacts: any) => {
                  resolve(contacts);
                },
              });
            });
            let tmp_numbers: string[] = [];
            contacts
              .filter((contact) => contact.isGroup(groupSelect))
              .forEach((contact) => {
                contact.telefones.split(",").forEach((number) => {
                  tmp_numbers.push(number);
                });
              });
            numbers = [...new Set([...numbers, ...tmp_numbers])];
            showNumbers();
          }

          sendSEND(
            `Enviar mensagem para o grupo: ${grupos
              .map((el, id) => `\n${id} - ${el}`)
              .join()}`
          );
        }
      }
    });
    return true;
  },
};
