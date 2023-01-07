import Events from "events";
import { Messages } from "@prisma/client";
import db from "../libs/data";
import { formatWhatsapp } from "../libs/Phone";

type keys = "to";

export class DataBase extends Events {
  // private _data: Messages = this.defaultData();
  private _data: Messages = this.defaultData();
  validate = {
    to: [(number: string) => number.match(/@c.us$/gi)],
  };

  format = {
    to: [(number: string) => formatWhatsapp(number)],
  };

  constructor(data?: Messages) {
    super();
    this.data = data ? data : this.defaultData();
  }

  get data() {
    return this._data;
  }

  set data(data) {
    this._data = new Proxy(data, {
      set: (target: any, key: keys, value) => {
        try {
          let newValue = value;
          if (this.format[key]) {
            newValue = this.format[key].reduce((acc, format) => {
              acc = format(acc);
              return acc;
            }, value);
          }
          if (this.validate[key]) {
            if (!this.validate[key].every((valid) => valid(value)))
              throw `Valor ${value} inválido para ${key}!`;
          }
          target[key] = newValue;
          console.log(`${key.toString()} inseriu o valor ${newValue}`);
          if (this.data.id) this.save();
        } catch (error) {
          console.log(error);
        }
        return true;
      },
    });
  }

  async save() {
    let data: any = { ...this.data };
    if (!data.id) delete data.id;
    this.data = await db.messages.upsert({
      where: { id: data.id || -1 },
      update: data,
      create: data,
    });
    return this;
  }

  async restore(id: number) {
    this.data = await db.messages.findUniqueOrThrow({
      where: { id: id },
    });
    return this;
  }

  async delete() {
    if (this._data && this._data.id) {
      await db.messages.delete({
        where: {
          id: this._data.id,
        },
      });
    }
  }

  defaultData(): Messages {
    return {
      id: 0,
      to: "",
      serialized: "",
      body: "",
      from: "",
      group: "SENDING",
      notifyName: "",
      self: "",
      caption: "",
      mimetype: "",
      type: "",
      data: "",
      old: "",
      info: "",
      status: true,
      hasMedia: false,
    };
  }

  reset() {
    this._data = this.defaultData();
  }

  async clearCache() {
    if (this.data.group === "CACHE") await this.reset();
    await db.messages.deleteMany({
      where: {
        group: "CACHE",
      },
    });
  }

  async destroy() {
    await this.delete();
    this.reset();
  }
}
