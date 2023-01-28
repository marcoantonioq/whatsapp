import { Agenda } from "../Contatos";
import { Message } from "../Message";
import { Client, Message as msg } from "whatsapp-web.js";
import Events from "events";
import { formatWhatsapp } from "../Phone";
import { filterAsync } from "../Util/ArrayFunction";
import { api } from ".";
import { textResponse as gptSearch } from "./Openai";
import { search as googleSearch, speechToTextOGG } from "./Google";
const util = require("util");
const exec = util.promisify(require("child_process").exec);

/**
 * Grupo API do whatsapp 🤖
 */
export class API extends Events {
  private _locks: Array<string> = [];
  private _numbers: Array<string> = [];
  timeOut = [setTimeout(() => {}, 1000)];
  mensagens: Message[] = [];
  app: Client;
  agenda: Agenda;

  constructor(app: Client, agendas: Agenda) {
    super();
    this.app = app;
    this.agenda = agendas;
  }

  get locks() {
    return this._locks.length;
  }

  get numbers() {
    return this._numbers.join(", ");
  }

  set numbers(numbers: string) {
    this._numbers = [
      ...new Set([
        ...this._numbers,
        ...numbers
          .split(/(\n|\r|\t|,|;|\|)/gi)
          .map((el) => el.replace(/\D/gim, ""))
          .filter((el) => el.match(/(\d{8})+/gi))
          .map((el) => formatWhatsapp(el))
          .filter((el) => el && el !== "")
          .map((el) => String(el)),
      ]),
    ];

    this.timeOut.push(
      setTimeout(() => {
        if (!this.isEnable("send_citado") && this._numbers.length) {
          this.enable("send_citado");
          this.sendToAPI(
            `▶️ Enviaremos novas mensagens para: \n\n⏹️ Sair / Cancelar\n📤 Enviar / Ok\n\nNúmeros citados (${
              this._numbers.length
            }): ${this.numbersToString()}`
          );
        }
      }, 30000)
    );
    this.timeOut.push(
      setTimeout(() => {
        if (this.isEnable("send_citado")) {
          this.disable("send_citado");
          this.sendToAPI(`⏹️ Paramos encaminhar msg para os números citados!`);
          this._numbers = [];
          this.mensagens.forEach((message) => message.destroy);
        }
      }, 15 * 60 * 1000)
    );
    if (this._numbers.length) {
      filterAsync(
        this._numbers,
        async (el) => !!(await this.app.isRegisteredUser(el))
      ).then((numbers) => {
        this._numbers = numbers;
        if (this._numbers.length)
          this.sendToAPI(
            `Aguarde ⏱️... \n*Estamos preparando tudo*, em segundos iniciaremos o envio...\n\n🆗 Números registrados (${
              this._numbers.length
            }): ${this.numbersToString()}!!`,
            1000
          );
      });
    }
  }

  arrayNumbers() {
    return this._numbers.filter((el) => el);
  }

  numbersToString(delimitador = ", ") {
    return this._numbers
      .filter((el) => el)
      .map((el) => el.replace(/^55|@c.us$/gi, ""))
      .join(delimitador);
  }

  isToAPI(msg: msg) {
    return !msg.body.startsWith("🤖:") &&
      msg.fromMe &&
      msg.to === process.env.API_ID
      ? true
      : false;
  }

  isEnable(text: string) {
    return !!this._locks.find((el) => el === text);
  }

  enable(text: string) {
    if (!this.isEnable(text)) {
      this._locks.push(text);
      this._locks = [...new Set(this._locks)];
    }
  }

  disable(text: string) {
    this._locks = this._locks.filter((el) => el !== text);
    this.timeOut.forEach((time) => clearTimeout(time));
  }

  async sendToAPI(text: string, delay: number = 0) {
    setTimeout(async () => {
      await this.app.sendMessage(String(process.env.API_ID), `🤖: ${text}`);
    }, delay);
  }

  async reset() {
    this._locks = [];
    this.mensagens = [];
    this._numbers = [];
    this.timeOut.forEach((time) => clearTimeout);
  }

  toString() {
    return this;
  }

  getGruposContatos(gruposInformados: string) {
    const informados = gruposInformados.split(",");
    const grupos = this.agenda.grupos.filter((grupo) =>
      informados.some((gp) => grupo.toUpperCase().includes(gp.toUpperCase()))
    );

    if (!grupos || grupos.length < 1) {
      return `🤖: Grupo ${informados.join(
        ", "
      )} inválido! \nGrupos disponíveis: ${this.agenda.grupos.join(", ")}`;
    }

    const contatos = this.agenda._contatos.filter((contato) => {
      return grupos.some((grupo) => {
        return contato.data.grupos?.toUpperCase().includes(grupo.toUpperCase());
      });
    });

    if (contatos.length === 0) {
      return `Nenhum contato para o grupo ${grupos.join(", ")}!`;
    }

    const ms = `🤖: Participantes (${contatos.length}) do grupo ${grupos.join(
      ", "
    )}: \n${contatos
      .map((contato) => `${contato.data.nome}:\t ${contato.data.telefones}`)
      .join("\n")}`;

    this.numbers = ms;
    return ms;
  }

  private async command(cmd: string) {
    const { err, stdout, stderr } = await exec(cmd);
    if (err) console.log(`Erro shell exec: ${err.message}`);
    if (stderr) console.log(`Erro shell stderr: ${stderr}`);
    return stdout.trim();
  }

  reboot() {
    this.sendToAPI("💤 reiniciando API....");
    setTimeout(() => {
      this.command("/sbin/reboot");
    }, 1000);
  }

  hello() {
    this.sendToAPI("Olá!");
  }

  initialize() {
    this.app.on("ready", async () => {
      if (!this.locks) {
        this.sendToAPI(`🦾`);
      }
    });

    this.app.on("message_create", async (msg) => {
      if (this.isToAPI(msg)) {
        const chat = await msg.getChat();
        if (["audio", "ptt"].includes(msg.type)) {
          const media = await msg.downloadMedia();
          speechToTextOGG(media.data).then((response) => {
            if (response) msg.reply(`🤖: ${response}`);
          });
        }
        try {
          chat.sendStateTyping();
          const black_list = ["ok"];
          if (!this.locks && !black_list.includes(msg.body)) {
            const match = /(^grupo |^send |^contatos )(.*)$/gi.exec(msg.body);
            if (match && match[2]) {
              const informados = match[2].split(/,|;/).map((el) => el.trim());
              msg.reply(this.getGruposContatos(informados.join(",")));
            } else if (msg.body.match(/^api$|^oi$|^ping$|^info$/gi)) {
              this.sendToAPI("Olá!");
            } else if (msg.body.match(/^(reboot|restart|reiniciar)$/gi)) {
              await chat.clearMessages();
              this.reboot();
            } else if (msg.body.match(/^(limpar|cls|clear|apagar)$/gi)) {
              await chat.clearMessages();
            } else {
              if (msg.body.trim() !== "") {
                gptSearch(msg.body).then((response) => {
                  if (response) msg.reply(`🤖: ${response}`);
                });
                if (msg.body.match(/\?$/g)) {
                  googleSearch(msg.body).then((response) => {
                    if (response)
                      msg.reply(`🤖: Resultados do google: \n${response}`);
                  });
                }
              }
            }
          }
          const numeroCitado = msg.body.match(/(\d{4}-\d{4}|\d{8})+/gi);
          if (this.isEnable("send_citado") || numeroCitado) {
            if (msg.body.match(/^(cancelar|sair)$/gi)) {
              this.disable("send_citado");
              this._numbers = [];
              for (const message of this.mensagens) {
                await message.destroy;
              }
              this.sendToAPI("👋 envio cancelado!");
            } else if (msg.body.trim().match(/^(enviar|ok)$/gi)) {
              this.disable("send_citado");
              const numbersSort = this.mensagens.sort((a, b) =>
                a.data.to > b.data.to &&
                a.data.created &&
                b.data.created &&
                a.data.created > b.data.created
                  ? -1
                  : 1
              );
              for (const message of numbersSort) {
                try {
                  await message.send();
                  await message.destroy();
                } catch (e: any) {
                  this.sendToAPI(`Erro ao enviar mensagem: ${e}`);
                }
              }
              this._numbers = [];
            } else {
              if (numeroCitado) this.numbers = msg.body;
              if (this.isEnable("send_citado")) {
                for (const number of this._numbers) {
                  try {
                    const isRegistered = await this.app.isRegisteredUser(
                      number
                    );
                    if (isRegistered) {
                      const message = new Message();
                      message.data.to = number;
                      await message.updateDataWithMsg(msg);
                      await message.replaceNomeContact();
                      this.mensagens.push(message);
                      await message.save();
                    }
                  } catch (e) {
                    console.log("Erro ");
                    api.sendToAPI(`Erro ${number}: ${e}`);
                  }
                }
                api.sendToAPI(`Mensagem salva!`);
              }
            }
          }
        } catch (e) {
          this.sendToAPI(`🤖: Erro no processamento ao criar mensagem: ${e}`);
        }
        // chat.clearState();
      }
    });
  }
}

export default API;
