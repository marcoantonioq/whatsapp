import { Agenda } from "../../contacts/core/Contacts";
import { app } from "../../../infra/whatsapp";
import API from "../../../modules/api/core/API";

export const agenda = new Agenda();
agenda.update();
setInterval(agenda.update, 120 * 60 * 1000);

export const api = new API(app, agenda);
api.initialize();
