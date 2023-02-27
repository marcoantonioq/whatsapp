import { InterfaceRepository } from "../core/Message";

export class OnQR {
  constructor(private readonly repo: InterfaceRepository) {}

  async execute(listener: (qr: string) => void) {
    this.repo.event.on("qr", listener);
  }
}
export default OnQR;
