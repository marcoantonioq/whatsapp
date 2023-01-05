import Events from "events";
import { Messages } from "@prisma/client";
import db from "../libs/data";
import { Message } from ".";

export class DataBase extends Events {
  private _data: Messages = this.defaultData();

  constructor(data?: Messages) {
    super();
    if (data) this.data = data;
  }

  get data() {
    return this._data;
  }

  set data(data) {
    this._data = data;
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