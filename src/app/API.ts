import { menu } from "./Menus";
import { criarAviso } from "./handlers/criar-aviso";
import { EnviarMensagem } from "./handlers/enviar-mensagens";
import { TranscricaoAudio } from "./handlers/transcricao-audio";
import { GoogleSearch } from "./handlers/google-search";
import { WriteSonic } from "./handlers/write-sonic";
import { OpenIA } from "./handlers/open-ia";
import { Help } from "./handlers/help";

export const API: menu[] = [
  {
    label: "Enviar mensagem",
    regex: "send|enviar|msg",
    action: EnviarMensagem,
  },
  {
    label: "Transcrição",
    regex: "audio",
    action: TranscricaoAudio,
  },
  {
    label: "Criar aviso",
    regex: "(criar |)aviso",
    action: criarAviso,
  },
  {
    label: "Google",
    regex: "google|g",
    action: GoogleSearch,
  },
  {
    label: "WriteSonic",
    regex: "write|chat|sonic",
    action: WriteSonic,
  },
  {
    label: "OpenIA",
    regex: "ai|ia|open",
    action: OpenIA,
  },
  {
    label: "Ajuda!",
    regex: "?",
    action: Help,
  },
];
