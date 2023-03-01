import { InterfaceRepository } from "../core/Message";

export class OnReady {
  constructor(private readonly repo: InterfaceRepository) {}

  async execute(listener: () => void) {
    this.repo.event.on("ready", listener);
  }
}
export default OnReady;
