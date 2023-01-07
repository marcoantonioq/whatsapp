import { Agenda } from "../Contatos";
import { app } from "../Whatsapp";
import API from "./API";

export const agenda = new Agenda();
agenda.update();
setInterval(agenda.update, 120 * 60 * 1000);

export const api = new API(app, agenda);
api.initialize();
