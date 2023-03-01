import { InterfaceRepository } from "../core/Message";

export class Initialize {
  constructor(private readonly repo: InterfaceRepository) {}

  async execute() {
    return this.repo.initialize();
  }
}
export default Initialize;
