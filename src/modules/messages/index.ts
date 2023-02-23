// https://docs.orkestral.io/venom/#/
import { EventsApp, GOOGLE_SHEET_SAVE, Module as ModuleType } from "@types";
import Repository from "./infra/repository-wppconnect";

import StateMessages from "./app/on-state";
import OnCreate from "./app/on-created";
import SendMessage from "./app/send-message";
import configs from "@config/index";
import OnQR from "./app/on-qr";

export const module = <ModuleType>{
  async initialize(app: import("events")): Promise<Boolean> {
    const repo = new Repository([], app);
    const onCreate = new OnCreate(repo);
    const stateMessages = new StateMessages(repo);
    const sendMessage = new SendMessage(repo);

    // enviar
    app.on(EventsApp.MESSAGE_SEND, (msg) => {
      sendMessage.execute(msg);
    });
    // create message
    app.on(EventsApp.MESSAGE_CREATE, async (msg) => {
      onCreate.execute(msg);
    });
    // status
    app.on(EventsApp.STATUS, async (state, session) => {
      stateMessages.execute(state, session);
    });
    // lista de mensagens
    app.on(EventsApp.MESSAGES, async (callback: Function) => {
      if (callback) callback(repo);
      return repo.messages;
    });

    app.on(EventsApp.QR_RECEIVED, async (qr) => {
      app.emit(EventsApp.GOOGLE_SHEET_SAVE, <GOOGLE_SHEET_SAVE>{
        spreadsheetId: configs.GOOGLE.SHEET_DOC_ID,
        values: [
          [
            `=image("https://image-charts.com/chart?chs=500x500&cht=qr&choe=UTF-8&chl="&ENCODEURL("${qr}"))`,
          ],
          [new Date().toLocaleString()],
        ],
        range: "Whatsapp!A2:A3",
      });
      new OnQR(repo).execute(qr);
    });

    app.on(EventsApp.READY, () => {
      console.log("App iniciado!!!");
    });

    return true;
  },
};
