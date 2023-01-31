import EventEmitter from "events";
import { InterfaceRepository } from "../../../libs/whatsapp";

export class Repository implements InterfaceRepository {
  constructor(private readonly event: EventEmitter) {}
  index(): [] {
    throw new Error("Method not implemented.");
  }
}

export default Repository;
