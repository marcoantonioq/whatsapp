import configs from "@config/index";
import { InterfaceRepository, Message } from "../core/Message";

export class OnCreate {
  constructor(private readonly repo: InterfaceRepository) {}

  async execute(msg: Message) {}
}
export default OnCreate;
