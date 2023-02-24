// https://docs.orkestral.io/venom/#/
import { EventsApp, Module as ModuleType } from "@types";
import Repository from "./infra/repository-wppconnect";

import StateMessages from "./app/on-state";
import OnCreate from "./app/on-created";
import SendMessage from "./app/send-message";
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
      new OnQR(repo).execute(qr);
    });

    app.on(EventsApp.READY, () => {
      console.log("App iniciado!!!");
    });

    app.on(EventsApp.FORWARD_MESSAGES, (params) => {
      console.log("Params:::", params);
      repo.forwardMessages(params.to, params.ids);
    });

    return true;
  },
};
