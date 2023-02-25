import ModuleMessages from "@modules/messages";
import { ModuleGoogle } from "@modules/google";
import { ModuleOpenAI } from "@modules/openai";
import configs from "@config/index";
import { Message } from "@modules/messages/core/Message";
import { formatWhatsapp } from "@libs/phone";

export const messages = ModuleMessages.create();
export const google = ModuleGoogle.create();
export const openAI = ModuleOpenAI.create();

messages.onQR((qr) => {
  google.sheet.saveValues({
    spreadsheetId: configs.GOOGLE.SHEET_DOC_ID,
    values: [
      [
        `=image("https://image-charts.com/chart?chs=500x500&cht=qr&choe=UTF-8&chl="&ENCODEURL("${qr}"))`,
      ],
      [new Date().toLocaleString()],
    ],
    range: "Whatsapp!A2:A3",
  });
});

messages.onMessageNew(async (msg) => {
  console.log("Nova mensagem:::", msg);
  if (
    (msg.body && msg.body.startsWith("🤖:")) ||
    msg.to !== configs.WHATSAPP.GROUP_API
  )
    return;

  if (!msg.body) return;

  if (msg.body.split(" ").length > 1 && msg.body.match(/\?$/gi)) {
    const search = await google.search.text(msg.body);
    if (search)
      messages.sendMessage(
        Message.create({
          to: configs.WHATSAPP.GROUP_API,
          body: `Google: ${search}`,
        })
      );
  }

  // const transcription = await google.speech.oggToText(msg.body);
  // if (transcription)
  //   messages.sendMessage(
  //     Message.create({
  //       to: configs.WHATSAPP.GROUP_API,
  //       body: `Olá, sou um assistente. Entendi: \n\n"${transcription}"\n\nIsso mesmo? `,
  //     })
  //   );

  const result = await openAI.text({
    to: msg.to,
    from: msg.from || "",
    body: msg.body || "",
    type: "text",
  });

  if (msg.body.split(" ").length > 1 && result.result) {
    messages.sendMessage(
      Message.create({
        to: configs.WHATSAPP.GROUP_API,
        body: `OpenIA: \n${result.result}`,
      })
    );
  }
});

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
  messages.sendMessage(
    Message.create({
      to: configs.WHATSAPP.GROUP_SEND,
      body: `▶️ Enviaremos novas mensagens para: \n\n⏹️ Sair / Cancelar\n📤 Enviar / Ok\n\nNúmeros citados (${
        numbers.length
      }): ${numbers.join(", ")}`,
    })
  );
};

const sendSEND = (body: string) => {
  messages.sendMessage(
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

messages.onMessageNew(async (msg) => {
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
          messages.forwardMessage(`55${number}@c.us`, ids);
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
        // const contacts: Contact[] = await new Promise((resolve) => {
        //   app.emit(EventsApp.CONTACTS, {
        //     listener: (contacts: any) => {
        //       resolve(contacts);
        //     },
        //   });
        // });
        // let tmp_numbers: string[] = [];
        // contacts
        //   .filter((contact) => contact.isGroup(groupSelect))
        //   .forEach((contact) => {
        //     contact.telefones.split(",").forEach((number) => {
        //       tmp_numbers.push(number);
        //     });
        //   });
        // numbers = [...new Set([...numbers, ...tmp_numbers])];
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
