import Events from "events";
import { Messages } from "@prisma/client";
import db from "../data";

export class DataBase extends Events {
  private _data: Messages | undefined;

  constructor(data?: Messages) {
    super();
    this.create(data);
  }

  get data() {
    return this._data;
  }

  set data(data) {
    this._data = data;
  }

  async create(data: Messages | undefined) {
    if (data) {
      this.data = data;
    }
    if (!this.data) {
      this._data = await db.messages.create({
        data: {
          to: "",
          from: null,
        },
      });
    }
    return this;
  }

  async save() {
    if (this._data && this._data.id) {
      await db.messages.delete({
        where: {
          id: this._data.id,
        },
      });
    }
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
