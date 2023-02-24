import configs from "@config/index";
import { Message } from "@modules/messages/core/Message";
import { EventsApp, GOOGLE_SHEET_GET, Module as ModuleType } from "@types";
import GetValuesInSheet from "./app/sheet-get-values";
import SaveQrCode from "./app/sheet-save-values";
import SearchGoogle from "./app/search-google";
import SpeechToTextOGG from "./app/speech-to-text-ogg";

export const module = <ModuleType>{
  async initialize(app: import("events")) {
    app.on(
      EventsApp.GOOGLE_SHEET_GET,
      async ({ spreadsheetId, range, listener: call }: GOOGLE_SHEET_GET) => {
        const contatos = await new GetValuesInSheet().execute(
          spreadsheetId,
          range
        );
        call(contatos);
      }
    );

    app.on(EventsApp.QR_RECEIVED, (qr) => {
      return new SaveQrCode().execute({
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

    app.on(EventsApp.MESSAGE_CREATE, async (msg) => {
      if (
        (msg.body && msg.body.startsWith("🤖:")) ||
        msg.to !== configs.WHATSAPP.GROUP_API
      )
        return;

      if (msg.body.match(/\?$/gi)) {
        const search = await new SearchGoogle().execute(msg.body);
        if (search)
          app.emit(
            EventsApp.MESSAGE_SEND,
            Message.create({
              to: configs.WHATSAPP.GROUP_API,
              body: `Google: ${search}`,
            })
          );
      }

      const transcription = await new SpeechToTextOGG().execute(msg.body);
      if (transcription)
        app.emit(
          EventsApp.MESSAGE_SEND,
          Message.create({
            to: configs.WHATSAPP.GROUP_API,
            body: `Olá, sou um assistente. Entendi: \n\n"${transcription}"\n\nIsso mesmo? `,
          })
        );
    });

    return true;
  },
};

export default module;
