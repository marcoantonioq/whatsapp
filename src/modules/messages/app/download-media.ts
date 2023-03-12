import { InterfaceRepository, Message } from "../core/Message";

export class DownloadMedia {
  constructor(private readonly repo: InterfaceRepository) {}

  async execute(messageID: string) {
    return await this.repo.download(messageID);
  }
}
export default DownloadMedia;
