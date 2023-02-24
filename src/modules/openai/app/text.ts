import { Repository, request } from "../infra/repo";

export class GetText {
  constructor(private readonly repo: Repository) {}

  async execute(text: request) {
    return this.repo.request(text);
  }
}

export default GetText;
