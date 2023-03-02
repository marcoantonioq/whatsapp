import { InterfaceRepository, Request } from "../core/Request";

export class GetText {
  constructor(private readonly repo: InterfaceRepository) {}

  async execute(text: Request) {
    return this.repo.request(text);
  }
}

export default GetText;
