import { Repository, request } from "../repo/repo";

export class GetText {
  constructor(private readonly repo: Repository) {}

  async execute(text: request) {
    return this.repo.request(text);
  }
}

export default GetText;
