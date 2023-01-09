import * as dotenv from "dotenv";
dotenv.config();

import { Contato } from "./Contatos";
import { app } from "./Whatsapp";
import { api } from "./Api";
import "./Grupos";
import "./LoadScreen";
import "./QrCode";
import "./Logger";
import "./Status";
import "./Send";

export { Contato, app, api };
