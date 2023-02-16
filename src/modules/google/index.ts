import configs from "@config/index";
import { EventsApp, EventsWhatsapp, Module as ModuleType } from "@types";
import { config } from "dotenv";
import GetContacts from "./app/get-contacts";
import SaveQrCode from "./app/save-qr-code";
import SearchGoogle from "./app/search-google";
import SpeechToTextOGG from "./app/speech-to-text-ogg";

export const module = <ModuleType>{
  async initialize(app: import("events")) {
    const contatos = await new GetContacts().execute();
    app.emit(EventsApp.CONTACTS_UPDATE, contatos);

    app.on(EventsWhatsapp.QR_RECEIVED, new SaveQrCode().execute);

    app.on(EventsWhatsapp.MESSAGE_CREATE, async (msg) => {
      if (msg.body.startsWith("🤖:") || msg.to !== configs.WHATSAPP.GROUP_API)
        return;

      const search = await new SearchGoogle().execute(msg);
      if (search)
        app.emit(EventsApp.SEND_API, `Google: ${msg.body}\n${search}`);

      const transcription = await new SpeechToTextOGG().execute(msg);
      if (transcription)
        app.emit(
          EventsApp.SEND_API,
          `Olá, sou um assistente. Entendi: \n\n"${transcription}"\n\nIsso mesmo? `
        );
    });

    return true;
  },
};

export default module;
