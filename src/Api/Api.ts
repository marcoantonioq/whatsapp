import { Agenda } from "../Contatos";
import { formatWhatsapp } from "../libs/Phone";
import { Message } from "../Message";
import { Client, Message as msg } from "whatsapp-web.js";
import Events from "events";
import moment from "moment";
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
    const tmp = numbers
      .split(/(\n|,|;|\t)/gi)
      .map((el) => el.replace(/\D/gim, ""))
      .filter((el) => el && el !== "")
      .map((el) => {
        try {
          return formatWhatsapp(el);
        } catch (e) {
          return undefined;
        }
      })
      .filter((el) => el)
      .map((el) => String(el));
    const n1 = new Set([...this._numbers, ...tmp]);
    this._numbers = [...n1];
    this.timeOut.push(
      setTimeout(() => {
        if (!this.isEnable("send_citado") && this._numbers.length) {
          this.enable("send_citado");
          this.sendToAPI(
            `▶️ Enviaremos novas mensagens para: \n\n⏹️ Sair / Cancelar\n📤 Enviar / Ok\n\nNúmeros citados: ${this.numbersToString()}`
          );
        }
      }, 30000)
    );
    this.timeOut.push(
      setTimeout(() => {
        if (this.isEnable("send_citado")) {
          this.sendToAPI(`⏹️ Paramos encaminhar msg para os números citados!`);
          this.mensagens.forEach((message) => message.destroy);
          this.disable("send_citado");
        }
      }, 15 * 60 * 1000)
    );
    if (this._numbers.length)
      this.sendToAPI(
        `🆗 Números registrados ${this.numbersToString()}!!\n\nAguarde ⏱️... \n*Estamos preparando tudo*, em segundos iniciaremos...`,
        1000
      );
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
    this._numbers = [];
    this.mensagens = [];
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

  hello() {
    this.sendToAPI("Olá!");
  }

  initialize() {
    this.app.on("ready", async () => {
      if (!this.locks) {
        this.sendToAPI(`${moment().format("DD/MM, h:mm")}`);
      }
    });

    this.app.on("message_create", async (msg) => {
      try {
        if (this.isToAPI(msg)) {
          const reg = /(^grupo |^send |^contatos )(.*)$/gi;
          const match = reg.exec(msg.body);
          if (match && match[2]) {
            const informados = match[2].split(/,|;/).map((el) => el.trim());
            msg.reply(this.getGruposContatos(informados.join(",")));
          }
          if (!this.locks) {
            const hello = /^api$|^oi$|^ping$|^info$/gi;
            if (msg.body.match(hello)) {
              this.sendToAPI("Olá!");
            }
          }
          const reboot = /^reboot$|^restart$/gi;
          if (msg.body.match(reboot)) {
            this.sendToAPI("Reiniciando API....");
            setTimeout(() => {
              this.command("/sbin/reboot");
            }, 1000);
          }
          const numeroCitado = msg.body.match(/(\d{4}-\d{4}|\d{8})+/gi);
          // if está ativo ou algum numero de telefone foi citado
          if (this.isEnable("send_citado") || numeroCitado) {
            // if cancelar, apaga todas as mensagens
            if (msg.body.match(/^(cancelar|sair)$/gi)) {
              this._numbers = [];
              this.mensagens.forEach((message) => message.destroy);
              this.disable("send_citado");
              this.sendToAPI("👋 envio cancelado!");
              // if enviar mensagens (apaga todas)
            } else if (msg.body.trim().match(/^(enviar|ok)$/gi)) {
              this._numbers = [];
              for (const message of this.mensagens) {
                try {
                  await message.send();
                  await message.destroy();
                  this.disable("send_citado");
                } catch (e: any) {
                  console.log(`Erro ao enviar mensagens: ${e}`);
                }
              }
            } else {
              // cria novas mensagens
              if (numeroCitado) this.numbers = msg.body;
              this.arrayNumbers().forEach(async (number) => {
                try {
                  const message = new Message();
                  const { data: dt } = message;
                  dt.to = number;
                  dt.from = msg.from;
                  dt.body = msg.body;
                  dt.type = msg.type;
                  dt.hasMedia = msg.hasMedia;
                  if (dt.hasMedia) {
                    const media = await msg.downloadMedia();
                    dt.data = media.data;
                    dt.mimetype = media.mimetype;
                  }
                  await message.replaceNomeContact();
                  await message.save();
                  this.mensagens.push(message);
                  return message;
                } catch (error) {
                  this.sendToAPI(
                    `Erro ao criar mensagem apiSendCitado: ${error}`
                  );
                }
              });
            }
          }
        }
      } catch (e) {
        this.sendToAPI(`🤖: Erro no processamento ao criar mensagem: ${e}`);
      }
    });
  }
}

export default API;
