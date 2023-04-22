import { InterfaceRepository } from "../interfaces/InterfaceRepository";

export class DownloadMedia {
  constructor(private readonly repo: InterfaceRepository) {}

  async execute(messageID: string) {
    return await this.repo.download(messageID);
  }
}
export default DownloadMedia;
