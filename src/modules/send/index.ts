// https://docs.orkestral.io/venom/#/
import configs from "@config/index";
import { formatWhatsapp } from "@libs/phone";
import { Contact } from "@modules/contacts/core/Contacts";
import { Message } from "@modules/messages/core/Message";
import { EventsApp, Module as ModuleType } from "@types";

export const module = <ModuleType>{
  async initialize(app: import("events")): Promise<Boolean> {
    let numbers: string[] = [];
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

    app.on(EventsApp.MESSAGE_CREATE, async (msg: Message) => {
      if (
        msg.body &&
        !msg.body.startsWith("🤖:") &&
        msg.to === configs.WHATSAPP.GROUP_SEND
      ) {
        if (msg.body?.match(/^(reboot|cancelar|sair|exit)$/gi)) {
          numbers = [];
          sending = false;
          app.emit(
            EventsApp.MESSAGE_SEND,
            Message.create({
              to: configs.WHATSAPP.GROUP_SEND,
              body: `⏹️ Paramos encaminhar msg para os números citados!`,
            })
          );
        } else if (msg.body.match(/^(ok|enviar)$/gi)) {
          sending = true;
        } else if (msg.body.match(/(\d{4}-\d{4}|\d{8})+/gi)) {
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
          app.emit(EventsApp.FORWARD_MESSAGES, {
            to: configs.WHATSAPP.MY_NUMBER,
            msgs: [msg],
          });
        } else {
          try {
            const groupSelect = grupos[+Number(msg.body)];
            if (groupSelect) {
              const contacts: Contact[] = await new Promise((resolve) => {
                app.emit(EventsApp.CONTACTS, {
                  listener: (contacts: any) => {
                    resolve(contacts);
                  },
                });
              });
              let nums: string[] = [];
              contacts
                .filter((contact) => contact.isGroup(groupSelect))
                .forEach((contact) => {
                  contact.telefones.split(",").forEach((number) => {
                    nums.push(number);
                  });
                });
              numbers = [...new Set([...numbers, ...nums])];
              showNumbers();
            }
          } catch (e) {
            console.log("erro ao selecionar grupo: ", e);
          }

          app.emit(
            EventsApp.MESSAGE_SEND,
            Message.create({
              to: configs.WHATSAPP.GROUP_SEND,
              body: `Enviar mensagem para o grupo: 
              ${grupos.map((el, id) => `\n${id} - ${el}`).join()}`,
            })
          );
          //           const match = /(^grupo |^send |^contatos )(.*)$/gi.exec(msg.body);
          // if (match && match[2]) {
          //   const informados = match[2].split(/,|;/).map((el) => el.trim());
          //   const contacts: Contact[] = await new Promise((resolve) => {
          //     app.emit(EventsApp.CONTACTS, {
          //       listener: (contacts: any) => {
          //         resolve(contacts)                  // console.log(`Contatos recebidos::::::: `, contatos);
          //       },
          //     });
          //   });
          //   contacts.filter()
          //   const grupos = this.agenda.grupos.filter((grupo) =>
          //     informados.some((gp) =>
          //       grupo.toUpperCase().includes(gp.toUpperCase())
          //     )
          //   );

          //   if (!grupos || grupos.length < 1) {
          //     return `🤖: Grupo ${informados.join(
          //       ", "
          //     )} inválido! \nGrupos disponíveis: ${this.agenda.grupos.join(
          //       ", "
          //     )}`;
          //   }

          //   const contatos = this.agenda._contatos.filter((contato) => {
          //     return grupos.some((grupo) => {
          //       return contato.data.grupos
          //         ?.toUpperCase()
          //         .includes(grupo.toUpperCase());
          //     });
          //   });

          //   if (contacts.length === 0) {
          //     return `Nenhum contato para o grupo ${grupos.join(", ")}!`;
          //   }

          //   const ms = `🤖: Participantes (${
          //     contacts.length
          //   }) do grupo ${grupos.join(", ")}: \n${contacts
          //     .map(
          //       (contato) => `${contato.data.nome}:\t ${contato.data.telefones}`
          //     )
          //     .join("\n")}`;

          //   numbers = [...new Set([...numbers, ...ms])];
          // }
        }
      }
    });
    return true;
  },
};
