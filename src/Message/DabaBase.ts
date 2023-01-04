import Events from "events";
import { Messages } from "@prisma/client";
import db from "../data";

export class DataBase extends Events {
  private _data: Messages = {
    id: 0,
    to: "",
    serialized: "",
    body: "",
    from: "",
    group: "",
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

  constructor(data?: Messages) {
    super();
    if (data) this.data = data;
  }

  get data() {
    return this._data;
  }

  set data(data) {
    this._data = { ...this.data, ...data };
  }

  async save() {
    const data = Object.create(this.data);
    console.log("Objetos daa: ", data, this.data);
    if (!data.id) delete data.id;
    this.data = await db.messages.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });
    console.log("New Objetos daa: ", data, this.data);
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
}
